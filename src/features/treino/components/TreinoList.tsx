import React from 'react';
import { MaterialIcon } from '../../../components';
import { TreinoWithUsers } from '../types';
import { useTreino } from '../../../hooks/useTreino';
import CardStaffTeam from '../../../components/CardStaffTeam';

interface TreinoListProps {
  treinos: TreinoWithUsers[];
  onEdit?: (treino: TreinoWithUsers) => void;
  onDelete?: (treinoId: number) => void;
  onExecutar?: (treinoId: number) => void;
  isLoading?: boolean;
}

const TreinoList: React.FC<TreinoListProps> = ({ 
  treinos, 
  onEdit, 
  onDelete, 
  onExecutar,
  isLoading = false 
}) => {
  const { calcularDuracao } = useTreino();

  // Função para determinar o status do treino
  const getTreinoStatus = (treino: TreinoWithUsers) => {
    const hoje = new Date();
    const inicio = new Date(treino.dtInicio);
    const final = new Date(treino.dtFinal);

    if (hoje < inicio) {
      return { status: 'agendado', label: 'Agendado', className: 'badge-info' };
    } else if (hoje >= inicio && hoje <= final) {
      return { status: 'em-andamento', label: 'Em Andamento', className: 'badge-warning' };
    } else {
      return { status: 'concluido', label: 'Concluído', className: 'badge-success' };
    }
  };

  // Função para formatar data
  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString('pt-BR');
  };

  if (!treinos || treinos.length === 0) {
    return (
      <CardStaffTeam>
        <div className="text-center py-lg">
          <MaterialIcon name="fitness_center" color="secondary" size="large" className="mb-md" />
          <h3 className="text-lg color-text-secondary mb-sm">Nenhum treino encontrado</h3>
          <p className="color-text-muted">
            Não há treinos cadastrados ainda.
          </p>
        </div>
      </CardStaffTeam>
    );
  }

  // Calcular estatísticas
  const stats = treinos.reduce((acc, treino) => {
    const status = getTreinoStatus(treino).status;
    if (status === 'agendado') acc.agendado++;
    else if (status === 'em-andamento') acc['em-andamento']++;
    else if (status === 'concluido') acc.concluido++;
    acc.total++;
    return acc;
  }, { total: 0, agendado: 0, 'em-andamento': 0, concluido: 0 });

  return (
    <>
      {/* Estatísticas */}
      <CardStaffTeam className="mb-lg">
        <h3 className="text-md color-text-primary mb-md">
          <MaterialIcon name="analytics" color="primary" size="small" className="mr-xs" />
          Estatísticas dos Treinos
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-md">
          <div className="stat-card text-center p-md bg-gradient-primary rounded">
            <div className="text-xl font-bold color-text-white">{stats.total}</div>
            <div className="text-sm color-text-white-70">Total</div>
          </div>
          <div className="stat-card text-center p-md bg-gradient-info rounded">
            <div className="text-xl font-bold color-text-white">{stats.agendado}</div>
            <div className="text-sm color-text-white-70">Agendados</div>
          </div>
          <div className="stat-card text-center p-md bg-gradient-warning rounded">
            <div className="text-xl font-bold color-text-white">{stats['em-andamento']}</div>
            <div className="text-sm color-text-white-70">Em Andamento</div>
          </div>
          <div className="stat-card text-center p-md bg-gradient-success rounded">
            <div className="text-xl font-bold color-text-white">{stats.concluido}</div>
            <div className="text-sm color-text-white-70">Concluídos</div>
          </div>
        </div>
      </CardStaffTeam>

      {/* Lista de Treinos */}
      <CardStaffTeam>
        <h3 className="text-md color-text-primary mb-md">
          <MaterialIcon name="fitness_center" color="primary" size="small" className="mr-xs" />
          Lista de Treinos
        </h3>
        
        <div className="feature-grid grid-cols-auto gap-lg">
          {treinos.map(treino => {
            const statusInfo = getTreinoStatus(treino);
            const duracao = calcularDuracao(
              treino.dtInicio.toString(), 
              treino.dtFinal.toString()
            );

            return (
              <div key={treino.cdTreino} className="feature-card hover-shadow">
                <div className="mb-md">
                  <div className="flex items-center justify-between mb-sm">
                    <h4 className="text-primary font-semibold">{treino.dsTreino}</h4>
                    <span className={`badge ${statusInfo.className}`}>
                      {statusInfo.label}
                    </span>
                  </div>

                  <div className="space-y-xs">
                    <p className="text-sm">
                      <MaterialIcon name="person" size="small" className="mr-xs" />
                      <strong>Profissional:</strong> {treino.profissional.nome}
                    </p>
                    <p className="text-sm">
                      <MaterialIcon name="sports" size="small" className="mr-xs" />
                      <strong>Atleta:</strong> {treino.atleta.nome}
                    </p>
                    <p className="text-sm">
                      <MaterialIcon name="schedule" size="small" className="mr-xs" />
                      <strong>Período:</strong> {formatDate(treino.dtInicio)} - {formatDate(treino.dtFinal)}
                    </p>
                    <p className="text-sm">
                      <MaterialIcon name="access_time" size="small" className="mr-xs" />
                      <strong>Duração:</strong> {duracao} dias
                    </p>
                    <p className="text-sm">
                      <MaterialIcon name="calendar_today" size="small" className="mr-xs" />
                      <strong>Cadastrado:</strong> {formatDate(treino.dtCadastro)}
                    </p>
                    {treino.obs && (
                      <p className="text-sm">
                        <MaterialIcon name="notes" size="small" className="mr-xs" />
                        <strong>Obs:</strong> {treino.obs}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-sm justify-end">
                  {onExecutar && statusInfo.status === 'em-andamento' && (
                    <button 
                      onClick={() => onExecutar(treino.cdTreino)}
                      className="btn btn-success btn-sm"
                      disabled={isLoading}
                      title="Executar treino"
                    >
                      <MaterialIcon name="play_arrow" size="small" />
                      Executar
                    </button>
                  )}
                  
                  {onEdit && (
                    <button 
                      onClick={() => onEdit(treino)}
                      className="btn btn-warning btn-sm"
                      disabled={isLoading}
                      title="Editar treino"
                    >
                      <MaterialIcon name="edit" size="small" />
                      Editar
                    </button>
                  )}
                  
                  {onDelete && (
                    <button 
                      onClick={() => onDelete(treino.cdTreino)}
                      className="btn btn-error btn-sm"
                      disabled={isLoading}
                      title="Excluir treino"
                    >
                      <MaterialIcon name="delete" size="small" />
                      Excluir
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardStaffTeam>
    </>
  );
};

export default TreinoList;
