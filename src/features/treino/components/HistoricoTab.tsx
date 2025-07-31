import React from 'react';
import { MaterialIcon } from '../../../components';

interface HistoricoTabProps {
  // Pode adicionar props futuramente para dados reais de histórico
}

interface SessaoTreino {
  id: string;
  data: string;
  treino: string;
  duracao: string;
  rpe: number;
  emoji: string;
}

const HistoricoTab: React.FC<HistoricoTabProps> = () => {
  // Mock data - futuramente substituir por dados reais
  const sessoesMock: SessaoTreino[] = [
    {
      id: '1',
      data: 'Hoje, 14:30',
      treino: 'Treino Push',
      duracao: '45min',
      rpe: 8,
      emoji: '🔥'
    },
    {
      id: '2',
      data: 'Ontem, 08:00',
      treino: 'Treino Legs',
      duracao: '52min',
      rpe: 9,
      emoji: '🦵'
    },
    {
      id: '3',
      data: '27/07, 19:15',
      treino: 'Treino Pull',
      duracao: '58min',
      rpe: 7,
      emoji: '🔙'
    },
    {
      id: '4',
      data: '26/07, 07:30',
      treino: 'Cardio HIIT',
      duracao: '30min',
      rpe: 8,
      emoji: '💨'
    },
    {
      id: '5',
      data: '25/07, 18:00',
      treino: 'Treino Core',
      duracao: '35min',
      rpe: 6,
      emoji: '💪'
    }
  ];

  const estatisticasMock = {
    totalSessoes: 156,
    tempoTotal: '78h',
    diasConsecutivos: 21,
    mediaSemanal: 4.2
  };

  return (
    <div className="historico-content">
      <div className="historico-header">
        <h2>📈 Histórico de Treinos</h2>
        <p>Acompanhe seu progresso ao longo do tempo</p>
      </div>

      {/* Estatísticas do histórico */}
      <div className="historico-stats">
        <div className="stat-card">
          <div className="stat-number">{estatisticasMock.totalSessoes}</div>
          <div className="stat-label">Total de Sessões</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{estatisticasMock.tempoTotal}</div>
          <div className="stat-label">Tempo Total</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{estatisticasMock.diasConsecutivos}</div>
          <div className="stat-label">Dias Consecutivos</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{estatisticasMock.mediaSemanal}</div>
          <div className="stat-label">Média Semanal</div>
        </div>
      </div>

      {/* Filtros e controles */}
      <div className="historico-filters">
        <div className="filter-group">
          <select className="form-select" aria-label="Filtrar por período">
            <option value="7">Últimos 7 dias</option>
            <option value="30">Últimos 30 dias</option>
            <option value="90">Últimos 3 meses</option>
            <option value="365">Último ano</option>
            <option value="all">Todo o período</option>
          </select>
        </div>
        <div className="filter-group">
          <select className="form-select" aria-label="Filtrar por tipo de treino">
            <option value="">Todos os tipos</option>
            <option value="push">Push</option>
            <option value="pull">Pull</option>
            <option value="legs">Legs</option>
            <option value="cardio">Cardio</option>
            <option value="core">Core</option>
          </select>
        </div>
        <button className="btn btn-secondary">
          <MaterialIcon name="download" color="secondary" size="small" />
          Exportar Dados
        </button>
      </div>

      {/* Lista de sessões */}
      <div className="historico-lista">
        {sessoesMock.map((sessao) => (
          <div key={sessao.id} className="sessao-card">
            <div className="sessao-emoji">{sessao.emoji}</div>
            <div className="sessao-info">
              <div className="sessao-header">
                <div className="sessao-treino">{sessao.treino}</div>
                <div className="sessao-date">{sessao.data}</div>
              </div>
              <div className="sessao-details">
                <span className="sessao-duration">
                  <MaterialIcon name="schedule" color="secondary" size="small" />
                  {sessao.duracao}
                </span>
                <span className="sessao-rpe">
                  <MaterialIcon name="fitness_center" color="secondary" size="small" />
                  RPE: {sessao.rpe}/10
                </span>
              </div>
            </div>
            <div className="sessao-actions">
              <button className="btn btn-link btn-sm">
                <MaterialIcon name="visibility" color="secondary" size="small" />
                Ver Detalhes
              </button>
              <button className="btn btn-link btn-sm">
                <MaterialIcon name="repeat" color="secondary" size="small" />
                Repetir Treino
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Botão carregar mais */}
      <div className="historico-load-more">
        <button className="btn btn-secondary">
          <MaterialIcon name="expand_more" color="secondary" size="small" />
          Carregar Mais Sessões
        </button>
      </div>
    </div>
  );
};

export default HistoricoTab;
