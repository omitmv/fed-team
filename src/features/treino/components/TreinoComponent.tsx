import React, { useState, useEffect } from 'react';
import { usePermissions } from '../../../hooks/usePermissions';
import { useTreino } from '../../../hooks/useTreino';
import { TreinoFormData, TreinoWithUsers } from '../types';
import { useAppContext } from '../../../context';
import { MaterialIcon } from '../../../components';
import CardStaffTeam from '../../../components/CardStaffTeam';
import TreinoForm from './TreinoForm';
import TreinoList from './TreinoList';

const TreinoComponent: React.FC = () => {
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
  
  // Estados para navegação e dados
  const [treinos, setTreinos] = useState<TreinoWithUsers[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTreino, setEditingTreino] = useState<TreinoWithUsers | null>(null);
  
  // Estados para formulário
  const [formData, setFormData] = useState<TreinoFormData>({
    dsTreino: '',
    dtInicio: '',
    dtFinal: '',
    cdProfissional: state.currentUser ? Number(state.currentUser.id) : 1,
    cdAtleta: 1, // TODO: Implementar seleção de atleta
    obs: ''
  });

  // Função para carregar treinos
  const loadTreinos = React.useCallback(async () => {
    const data = await getTreinosWithUsers();
    setTreinos(data);
  }, [getTreinosWithUsers]);

  // Carregar treinos ao montar o componente
  useEffect(() => {
    loadTreinos();
  }, [loadTreinos]);

  // Função para criar um novo treino
  const handleCreateTreino = async (data: TreinoFormData) => {
    const validationResult = validarDatas(data.dtInicio, data.dtFinal);
    
    if (validationResult) {
      console.error('Erro de validação:', validationResult);
      return;
    }

    const success = await createTreino({
      dsTreino: data.dsTreino,
      dtInicio: data.dtInicio,
      dtFinal: data.dtFinal,
      cdProfissional: data.cdProfissional,
      cdAtleta: data.cdAtleta,
      obs: data.obs
    });

    if (success) {
      await loadTreinos(); // Recarrega a lista
      setShowForm(false);
      resetForm();
    }
  };

  // Função para atualizar um treino (para futura implementação)
  const handleUpdateTreino = async (data: TreinoFormData) => {
    // TODO: Implementar atualização
    console.log('Atualizar treino:', data);
  };

  // Função para deletar um treino (para futura implementação)
  const handleDeleteTreino = async (treinoId: number) => {
    if (window.confirm('Tem certeza que deseja deletar este treino?')) {
      // TODO: Implementar deleção
      console.log('Deletar treino:', treinoId);
    }
  };

  // Função para executar um treino
  const handleExecutarTreino = (treinoId: number) => {
    // TODO: Implementar execução do treino
    console.log('Executar treino:', treinoId);
  };

  // Função para resetar o formulário
  const resetForm = () => {
    setFormData({
      dsTreino: '',
      dtInicio: '',
      dtFinal: '',
      cdProfissional: state.currentUser ? Number(state.currentUser.id) : 1,
      cdAtleta: 1,
      obs: ''
    });
    setEditingTreino(null);
    setShowForm(false);
  };

  // Função para iniciar edição
  const startEdit = (treino: TreinoWithUsers) => {
    setEditingTreino(treino);
    setFormData({
      dsTreino: treino.dsTreino,
      dtInicio: treino.dtInicio.toString().split('T')[0], // Converter para formato de input date
      dtFinal: treino.dtFinal.toString().split('T')[0],
      cdProfissional: treino.profissional.cdUsuario,
      cdAtleta: treino.atleta.cdUsuario,
      obs: treino.obs || ''
    });
    setShowForm(true);
  };

  // Função para lidar com o submit do formulário
  const handleFormSubmit = (data: TreinoFormData) => {
    if (editingTreino) {
      handleUpdateTreino(data);
    } else {
      handleCreateTreino(data);
    }
  };

  // Estados de loading combinados
  const isOperationLoading = loading;
  const operationError = error;

  // Se estiver carregando treinos
  if (loading && treinos.length === 0) {
    return (
      <CardStaffTeam>
        <div className="text-center py-lg">
          <MaterialIcon name="hourglass_empty" color="secondary" size="large" className="mb-md animate-spin" />
          <p className="color-text-secondary">Carregando treinos...</p>
        </div>
      </CardStaffTeam>
    );
  }

  // Se houver erro
  if (error && treinos.length === 0) {
    return (
      <CardStaffTeam>
        <div className="text-center py-lg">
          <MaterialIcon name="error" color="error" size="large" className="mb-md" />
          <h3 className="text-lg color-text-error mb-sm">Erro ao carregar treinos</h3>
          <p className="color-text-secondary mb-md">Erro: {error}</p>
          <button onClick={loadTreinos} className="btn btn-error">
            <MaterialIcon name="refresh" size="small" className="mr-xs" />
            Tentar novamente
          </button>
        </div>
      </CardStaffTeam>
    );
  }

  return (
    <CardStaffTeam>
      {/* Header com botão de ação */}
      <div className="flex items-center justify-between mb-lg">
        <div>
          <h2 className="text-xl color-text-primary mb-xs">
            <MaterialIcon name="fitness_center" color="primary" size="medium" className="mr-sm" />
            Gerenciamento de Treinos
          </h2>
          <p className="color-text-secondary">Gerencie seus treinos de forma eficiente</p>
        </div>
        
        {!showForm && canCreateTraining() && (
          <button 
            onClick={() => setShowForm(true)}
            className="btn btn-primary"
            disabled={isOperationLoading}
          >
            <MaterialIcon name="add" size="small" className="mr-xs" />
            Novo Treino
          </button>
        )}
        
        {operationError && (
          <button 
            onClick={clearError}
            className="btn btn-error ml-sm"
            title="Limpar erro"
          >
            <MaterialIcon name="refresh" size="small" className="mr-xs" />
            Tentar novamente
          </button>
        )}
      </div>

      {/* Formulário de criação/edição */}
      {showForm && (
        <div className="mb-lg">
          <TreinoForm
            formData={formData}
            setFormData={setFormData}
            editingTreino={editingTreino}
            onSubmit={handleFormSubmit}
            onCancel={resetForm}
            isLoading={isOperationLoading}
            error={operationError}
            onClearError={clearError}
            calcularDuracao={calcularDuracao}
          />
        </div>
      )}

      {/* Lista de Treinos */}
      {!showForm && (
        <TreinoList 
          treinos={treinos}
          onEdit={startEdit}
          onDelete={handleDeleteTreino}
          onExecutar={handleExecutarTreino}
          isLoading={isOperationLoading}
        />
      )}
    </CardStaffTeam>
  );
};

export default TreinoComponent;
