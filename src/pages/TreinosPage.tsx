import React, { useState, useEffect } from 'react';
import '../features/treino/styles/treinos.css';
import { usePermissions } from '../hooks/usePermissions';
import { useTreino } from '../hooks/useTreino';
import { TreinoFormData, TreinoWithUsers } from '../features/treino/types';
import { useAppContext } from '../context';
import { MaterialIcon } from '../components';

const TreinosPage: React.FC = () => {
  const { canCreateTraining } = usePermissions();
  const { state } = useAppContext();
  const { 
    loading, 
    error, 
    createTreino, 
    getTreinosWithUsers, 
    validarDatas, 
    calcularDuracao,
    clearError 
  } = useTreino();
  
  const [activeTab, setActiveTab] = useState<'meus-treinos' | 'biblioteca' | 'historico' | 'cadastro'>('meus-treinos');
  const [treinos, setTreinos] = useState<TreinoWithUsers[]>([]);
  const [isFormLoading, setIsFormLoading] = useState(false);
  
  // Form state para cadastro
  // Profissional é automaticamente definido como o usuário logado
  const [formData, setFormData] = useState<TreinoFormData>({
    dsTreino: '',
    dtInicio: '',
    dtFinal: '',
    cdProfissional: state.currentUser ? Number(state.currentUser.id) : 1,
    cdAtleta: 1, // TODO: Implementar seleção de atleta
    obs: ''
  });

  // Carregar treinos ao montar o componente
  useEffect(() => {
    const loadTreinos = async () => {
      const data = await getTreinosWithUsers();
      setTreinos(data);
    };
    
    loadTreinos();
  }, [getTreinosWithUsers]);

  const handleCreateTreino = async () => {
    if (activeTab !== 'cadastro') {
      setActiveTab('cadastro');
      return;
    }

    // Validar formulário
    const { dsTreino, dtInicio, dtFinal } = formData;
    
    if (!dsTreino.trim()) {
      alert('Nome do treino é obrigatório');
      return;
    }

    if (!dtInicio || !dtFinal) {
      alert('Datas de início e fim são obrigatórias');
      return;
    }

    const validationError = validarDatas(dtInicio, dtFinal);
    if (validationError) {
      alert(validationError);
      return;
    }

    setIsFormLoading(true);
    const newTreino = await createTreino(formData);
    
    if (newTreino) {
      alert('Treino criado com sucesso!');
      // Limpar formulário
      setFormData({
        dsTreino: '',
        dtInicio: '',
        dtFinal: '',
        cdProfissional: state.currentUser ? Number(state.currentUser.id) : 1,
        cdAtleta: 1,
        obs: ''
      });
      // Recarregar lista de treinos
      const updatedTreinos = await getTreinosWithUsers();
      setTreinos(updatedTreinos);
      // Voltar para aba de treinos
      setActiveTab('meus-treinos');
    }
    
    setIsFormLoading(false);
  };

  const handleExecutarTreino = (treinoId: string) => {
    // TODO: Implementar navegação para execução do treino
    console.log('Executar treino:', treinoId);
  };

  return (
    <div className="page treinos-page">
      <div className="page-header">
        <div className="header-content">
          <div className="title-section">
            <h1>
              <MaterialIcon name="fitness_center" color="primary" size="medium" />
              Treinos
            </h1>
            <p>Gerencie seus treinos e acompanhe seu progresso</p>
          </div>
          <div className="header-actions">
            <button 
              className="btn btn-primary"
              onClick={handleCreateTreino}
            >
              ➕ Novo Treino
            </button>
          </div>
        </div>
      </div>

      <div className="page-content">
        {/* Tabs de navegação */}
        <div className="tab-navigation">
          <button 
            className={`tab-button ${activeTab === 'meus-treinos' ? 'active' : ''}`}
            onClick={() => setActiveTab('meus-treinos')}
          >
            <MaterialIcon name="fitness_center" color="primary" size="small" />
            Meus Treinos
          </button>
          <button 
            className={`tab-button ${activeTab === 'biblioteca' ? 'active' : ''}`}
            onClick={() => setActiveTab('biblioteca')}
          >
            📚 Biblioteca
          </button>
          <button 
            className={`tab-button ${activeTab === 'historico' ? 'active' : ''}`}
            onClick={() => setActiveTab('historico')}
          >
            📈 Histórico
          </button>
          {canCreateTraining() && (
            <button 
              className={`tab-button ${activeTab === 'cadastro' ? 'active' : ''}`}
              onClick={() => setActiveTab('cadastro')}
            >
              ➕ Cadastro
            </button>
          )}
        </div>

        {/* Conteúdo das tabs */}
        <div className="tab-content">
          {activeTab === 'meus-treinos' && (
            <div className="meus-treinos-content">
              <div className="treinos-stats">
                <div className="stat-card">
                  <div className="stat-number">{treinos.length}</div>
                  <div className="stat-label">Treinos Criados</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">{treinos.filter(t => {
                    const hoje = new Date();
                    return new Date(t.dtFinal) < hoje;
                  }).length}</div>
                  <div className="stat-label">Treinos Concluídos</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">{treinos.filter(t => {
                    const hoje = new Date();
                    const inicio = new Date(t.dtInicio);
                    const final = new Date(t.dtFinal);
                    return inicio <= hoje && hoje <= final;
                  }).length}</div>
                  <div className="stat-label">Em Andamento</div>
                </div>
              </div>

              <div className="treinos-grid">
                {loading ? (
                  <div className="loading-placeholder">
                    <div className="loading-spinner">⏳</div>
                    <p>Carregando treinos...</p>
                  </div>
                ) : treinos.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">
                      <MaterialIcon name="fitness_center" color="disabled" size="large" />
                    </div>
                    <h3>Nenhum treino encontrado</h3>
                    <p>Comece criando seu primeiro treino!</p>
                    {canCreateTraining() && (
                      <button 
                        className="btn btn-primary"
                        onClick={() => setActiveTab('cadastro')}
                      >
                        ➕ Criar Primeiro Treino
                      </button>
                    )}
                  </div>
                ) : (
                  treinos.map((treino) => {
                    const hoje = new Date();
                    const inicio = new Date(treino.dtInicio);
                    const final = new Date(treino.dtFinal);
                    
                    let status = 'planejado';
                    let statusText = 'Planejado';
                    
                    if (hoje > final) {
                      status = 'concluido';
                      statusText = 'Concluído';
                    } else if (hoje >= inicio) {
                      status = 'em-andamento';
                      statusText = 'Em Andamento';
                    }

                    const duracaoTotal = calcularDuracao(treino.dtInicio.toString(), treino.dtFinal.toString());
                    const duracaoDecorrida = inicio <= hoje ? calcularDuracao(treino.dtInicio.toString(), hoje.toISOString()) : 0;
                    const progresso = Math.min(Math.round((duracaoDecorrida / duracaoTotal) * 100), 100);

                    return (
                      <div key={treino.cdTreino} className="treino-card">
                        <div className="treino-header">
                          <h3>� {treino.dsTreino}</h3>
                          <span className={`status-badge ${status}`}>{statusText}</span>
                        </div>
                        <div className="treino-info">
                          <p><strong>Profissional:</strong> {treino.profissional?.nome || 'N/A'}</p>
                          <p><strong>Atleta:</strong> {treino.atleta?.nome || 'N/A'}</p>
                          <div className="treino-meta">
                            <span>
                              <MaterialIcon name="calendar_today" color="secondary" size="small" />
                              {new Date(treino.dtInicio).toLocaleDateString('pt-BR')} - {new Date(treino.dtFinal).toLocaleDateString('pt-BR')}
                            </span>
                            <span>
                              <MaterialIcon name="schedule" color="secondary" size="small" />
                              {duracaoTotal} dias
                            </span>
                            <span>
                              <MaterialIcon name="bar_chart" color="secondary" size="small" />
                              {progresso}% concluído
                            </span>
                          </div>
                          {treino.obs && (
                            <p className="treino-obs"><strong>Obs:</strong> {treino.obs}</p>
                          )}
                        </div>
                        <div className="treino-actions">
                          <button 
                            className="btn btn-primary btn-sm"
                            onClick={() => handleExecutarTreino(treino.cdTreino.toString())}
                          >
                            ▶️ Executar
                          </button>
                          <button className="btn btn-secondary btn-sm">
                            ✏️ Editar
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {activeTab === 'biblioteca' && (
            <div className="biblioteca-content">
              <div className="biblioteca-header">
                <h2>📚 Biblioteca de Exercícios</h2>
                <p>Explore nossa coleção de exercícios</p>
              </div>
              
              <div className="exercicios-filters">
                <select className="form-select" aria-label="Filtrar por grupo muscular">
                  <option value="">Todos os grupos musculares</option>
                  <option value="peito">Peito</option>
                  <option value="costas">Costas</option>
                  <option value="ombros">Ombros</option>
                  <option value="bracos">Braços</option>
                  <option value="pernas">Pernas</option>
                  <option value="core">Core</option>
                </select>
                <select className="form-select" aria-label="Filtrar por equipamento">
                  <option value="">Todos os equipamentos</option>
                  <option value="barra">Barra</option>
                  <option value="halteres">Halteres</option>
                  <option value="maquinas">Máquinas</option>
                  <option value="peso-corporal">Peso Corporal</option>
                </select>
              </div>

              <div className="exercicios-grid">
                <div className="exercicio-card placeholder">
                  <div className="exercicio-image">
                    <MaterialIcon name="fitness_center" color="primary" size="medium" />
                  </div>
                  <div className="exercicio-info">
                    <h4>Supino Reto</h4>
                    <p>Peito • Barra</p>
                  </div>
                </div>
                <div className="exercicio-card placeholder">
                  <div className="exercicio-image">
                    <MaterialIcon name="sports_gymnastics" color="accent" size="medium" />
                  </div>
                  <div className="exercicio-info">
                    <h4>Agachamento</h4>
                    <p>Pernas • Peso Corporal</p>
                  </div>
                </div>
                <div className="exercicio-card placeholder">
                  <div className="exercicio-image">
                    <MaterialIcon name="sports_martial_arts" color="secondary" size="medium" />
                  </div>
                  <div className="exercicio-info">
                    <h4>Desenvolvimento</h4>
                    <p>Ombros • Halteres</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'historico' && (
            <div className="historico-content">
              <div className="historico-header">
                <h2>📈 Histórico de Treinos</h2>
                <p>Acompanhe seu progresso ao longo do tempo</p>
              </div>

              <div className="historico-stats">
                <div className="stat-card">
                  <div className="stat-number">156</div>
                  <div className="stat-label">Total de Sessões</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">78h</div>
                  <div className="stat-label">Tempo Total</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">21</div>
                  <div className="stat-label">Dias Consecutivos</div>
                </div>
              </div>

              <div className="historico-lista">
                <div className="sessao-card">
                  <div className="sessao-date">Hoje, 14:30</div>
                  <div className="sessao-treino">🔥 Treino Push</div>
                  <div className="sessao-duration">45min</div>
                  <div className="sessao-rpe">RPE: 8/10</div>
                </div>
                <div className="sessao-card">
                  <div className="sessao-date">Ontem, 08:00</div>
                  <div className="sessao-treino">🦵 Treino Legs</div>
                  <div className="sessao-duration">52min</div>
                  <div className="sessao-rpe">RPE: 9/10</div>
                </div>
                <div className="sessao-card">
                  <div className="sessao-date">27/07, 19:15</div>
                  <div className="sessao-treino">🔙 Treino Pull</div>
                  <div className="sessao-duration">58min</div>
                  <div className="sessao-rpe">RPE: 7/10</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'cadastro' && canCreateTraining() && (
            <div className="cadastro-content">
              <div className="cadastro-header">
                <h2>➕ Cadastro de Treino</h2>
                <p>Crie um novo treino personalizado</p>
              </div>

              <div className="cadastro-form">
                {error && (
                  <div className="error-message">
                    ⚠️ {error}
                    <button onClick={clearError} className="error-close">✖</button>
                  </div>
                )}
                
                <div className="form-section">
                  <h3>📋 Informações Básicas</h3>
                  <div className="form-grid">
                    <div className="form-group">
                      <label htmlFor="ds-treino" className="form-label">
                        Nome do Treino*
                      </label>
                      <input
                        id="ds-treino"
                        type="text"
                        className="form-input"
                        placeholder="Ex: Treino Push"
                        maxLength={250}
                        value={formData.dsTreino}
                        onChange={(e) => setFormData(prev => ({ ...prev, dsTreino: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="cd-profissional" className="form-label">
                        Profissional*
                      </label>
                      <input
                        id="cd-profissional"
                        type="text"
                        className="form-input form-input-fixed"
                        value={state.currentUser?.nome || 'Usuário não identificado'}
                        readOnly
                        disabled
                      />
                      <small className="form-helper-text">
                        ℹ️ O profissional é automaticamente definido como o usuário logado
                      </small>
                    </div>
                    <div className="form-group">
                      <label htmlFor="cd-atleta" className="form-label">
                        Atleta*
                      </label>
                      <select 
                        id="cd-atleta" 
                        className="form-select" 
                        value={formData.cdAtleta}
                        onChange={(e) => setFormData(prev => ({ ...prev, cdAtleta: Number(e.target.value) }))}
                        required 
                        aria-label="Selecionar atleta"
                      >
                        <option value="">Selecione o atleta</option>
                        <option value="10">Ana Costa</option>
                        <option value="11">Pedro Oliveira</option>
                        <option value="12">Mariana Ferreira</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="dt-inicio" className="form-label">
                        Data de Início*
                      </label>
                      <input
                        id="dt-inicio"
                        type="date"
                        className="form-input"
                        value={formData.dtInicio}
                        onChange={(e) => setFormData(prev => ({ ...prev, dtInicio: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="dt-final" className="form-label">
                        Data Final*
                      </label>
                      <input
                        id="dt-final"
                        type="date"
                        className="form-input"
                        value={formData.dtFinal}
                        onChange={(e) => setFormData(prev => ({ ...prev, dtFinal: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="duracao-estimada" className="form-label">
                        Duração Estimada (dias)
                      </label>
                      <input
                        id="duracao-estimada"
                        type="number"
                        className="form-input"
                        placeholder="Calculado automaticamente"
                        value={
                          formData.dtInicio && formData.dtFinal 
                            ? calcularDuracao(formData.dtInicio, formData.dtFinal)
                            : ''
                        }
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="obs-treino" className="form-label">
                      Observações
                    </label>
                    <textarea
                      id="obs-treino"
                      className="form-textarea"
                      rows={4}
                      maxLength={2500}
                      placeholder="Observações gerais sobre o treino, objetivos, restrições, etc..."
                      value={formData.obs || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, obs: e.target.value }))}
                    />
                    <small className="char-counter">{(formData.obs || '').length}/2500 caracteres</small>
                  </div>

                  {/* Removido: Seção de categorização opcional */}
                </div>

                <div className="form-section">
                  <h3>
                    <MaterialIcon name="sports_gymnastics" color="primary" size="small" />
                    Exercícios do Treino
                  </h3>
                  <div className="exercicios-treino">
                    <div className="exercicio-placeholder">
                      <div className="placeholder-icon">
                        <MaterialIcon name="sports_handball" color="disabled" size="large" />
                      </div>
                      <p>Nenhum exercício adicionado ainda</p>
                      <button className="btn btn-secondary">
                        📚 Adicionar da Biblioteca
                      </button>
                    </div>
                  </div>
                </div>

                <div className="form-actions">
                  <button type="button" className="btn btn-secondary">
                    💾 Salvar Rascunho
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-primary"
                    onClick={handleCreateTreino}
                    disabled={isFormLoading || loading}
                  >
                    {(isFormLoading || loading) ? (
                      <>
                        <MaterialIcon name="hourglass_empty" color="primary" size="small" />
                        Criando...
                      </>
                    ) : (
                      <>
                        <MaterialIcon name="check_circle" color="success" size="small" />
                        Criar Treino
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TreinosPage;
