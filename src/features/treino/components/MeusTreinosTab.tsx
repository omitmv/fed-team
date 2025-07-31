import React from 'react';
import { MaterialIcon } from '../../../components';
import { TreinoWithUsers } from '../types';
import { useTreino } from '../../../hooks/useTreino';
import { usePermissions } from '../../../hooks/usePermissions';

interface MeusTreinosTabProps {
  treinos: TreinoWithUsers[];
  loading: boolean;
  onExecutarTreino: (treinoId: string) => void;
  onCadastrarTreino: () => void;
}

const MeusTreinosTab: React.FC<MeusTreinosTabProps> = ({ 
  treinos, 
  loading, 
  onExecutarTreino, 
  onCadastrarTreino 
}) => {
  const { calcularDuracao } = useTreino();
  const { canCreateTraining } = usePermissions();

  // Calcular estatísticas
  const treinosConcluidos = treinos.filter(t => {
    const hoje = new Date();
    return new Date(t.dtFinal) < hoje;
  }).length;

  const treinosEmAndamento = treinos.filter(t => {
    const hoje = new Date();
    const inicio = new Date(t.dtInicio);
    const final = new Date(t.dtFinal);
    return inicio <= hoje && hoje <= final;
  }).length;

  return (
    <div className="meus-treinos-content">
      {/* Estatísticas */}
      <div className="treinos-stats">
        <div className="stat-card">
          <div className="stat-number">{treinos.length}</div>
          <div className="stat-label">Treinos Criados</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{treinosConcluidos}</div>
          <div className="stat-label">Treinos Concluídos</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{treinosEmAndamento}</div>
          <div className="stat-label">Em Andamento</div>
        </div>
      </div>

      {/* Grid de treinos */}
      <div className="feature-grid">
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
                onClick={onCadastrarTreino}
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
              <div key={treino.cdTreino} className="feature-card">
                <div className="treino-header">
                  <h3>🏋️ {treino.dsTreino}</h3>
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
                    onClick={() => onExecutarTreino(treino.cdTreino.toString())}
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
  );
};

export default MeusTreinosTab;
