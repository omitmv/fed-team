import React, { useState } from 'react';
import { useApi, useApiCreate, useApiUpdate, useApiDelete } from '../../../hooks/useApi';
import { Treino, TreinoCreate, TreinoUpdate } from '../types';
import { ENDPOINTS } from '../../../constants';
import CardStaffTeam from '../../../components/CardStaffTeam';
import TreinoForm from './TreinoForm';
import TreinoList from './TreinoList';
import ButtonStaffTeam from '../../../components/ButtonStaffTeam';

const TreinoComponent: React.FC = () => {
  // Estados para o formulário
  const [showForm, setShowForm] = useState(false);
  const [editingTreino, setEditingTreino] = useState<Treino | null>(null);
  const [formData, setFormData] = useState<TreinoCreate>({
    dsTreino: '',
    dtInicio: new Date(),
    dtFinal: new Date(),
    cdProfissional: 1, // TODO: pegar do usuário logado
    cdAtleta: 1, // TODO: Implementar seleção de atleta
    obs: ''
  });

  // Usando hooks customizados para operações da API
  const { data: treinos, loading, error, refetch } = useApi<Treino[]>(ENDPOINTS.NEW_TREINO);
  const { create, loading: createLoading, error: createError } = useApiCreate<Treino, TreinoCreate>();
  const { update, loading: updateLoading, error: updateError } = useApiUpdate<Treino, TreinoUpdate>();
  const { deleteResource, loading: deleteLoading, error: deleteError } = useApiDelete<Treino>();

  // Função para criar um novo treino
  const handleCreateTreino = async (treinoData: TreinoCreate) => {
    const newTreino = await create(ENDPOINTS.NEW_TREINO, treinoData);
    if (newTreino) {
      refetch(); // Recarrega a lista após criar
      setShowForm(false);
      resetForm();
    }
  };

  // Função para atualizar um treino
  const handleUpdateTreino = async (cdTreino: number, treinoData: TreinoUpdate) => {
    const updatedTreino = await update(ENDPOINTS.UPDATE_TREINO(cdTreino), treinoData);
    if (updatedTreino) {
      refetch(); // Recarrega a lista após atualizar
      setEditingTreino(null);
      resetForm();
    }
  };

  // Função para deletar um treino
  const handleDeleteTreino = async (cdTreino: number) => {
    if (window.confirm('Tem certeza que deseja deletar este treino?')) {
      const success = await deleteResource(ENDPOINTS.UPDATE_TREINO(cdTreino)); // Usando o mesmo endpoint com DELETE
      if (success) {
        refetch(); // Recarrega a lista após deletar
      }
    }
  };

  // Função para resetar o formulário
  const resetForm = () => {
    setFormData({
      dsTreino: '',
      dtInicio: new Date(),
      dtFinal: new Date(),
      cdProfissional: 1,
      cdAtleta: 1,
      obs: ''
    });
    setEditingTreino(null);
    setShowForm(false);
  };

  // Função para iniciar edição
  const startEdit = (treino: Treino) => {
    setEditingTreino(treino);
    setFormData({
      dsTreino: treino.dsTreino,
      dtInicio: treino.dtInicio,
      dtFinal: treino.dtFinal,
      cdProfissional: treino.cdProfissional,
      cdAtleta: treino.cdAtleta,
      obs: treino.obs || ''
    });
    setShowForm(true);
  };

  // Função para lidar com o submit do formulário
  const handleFormSubmit = (data: TreinoCreate) => {
    if (editingTreino) {
      handleUpdateTreino(editingTreino.cdTreino, data);
    } else {
      handleCreateTreino(data);
    }
  };

  // Função para calcular duração entre datas
  const calcularDuracao = (dtInicio: string | Date, dtFinal: string | Date): number => {
    const inicio = typeof dtInicio === 'string' ? new Date(dtInicio) : dtInicio;
    const final = typeof dtFinal === 'string' ? new Date(dtFinal) : dtFinal;
    const diffTime = Math.abs(final.getTime() - inicio.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Estados de loading combinados
  const isOperationLoading = createLoading || updateLoading || deleteLoading;

  // Erros combinados  
  const operationError = createError || updateError || deleteError;

  if (loading) {
    return (
      <CardStaffTeam>
        <div className="flex justify-center items-center p-lg">
          <div className="text-center">
            <p>Carregando treinos...</p>
          </div>
        </div>
      </CardStaffTeam>
    );
  }

  if (error) {
    return (
      <CardStaffTeam>
        <div className="text-center p-lg">
          <p className="text-error mb-md">Erro: {error}</p>
          <ButtonStaffTeam onClick={refetch}>
            Tentar novamente
          </ButtonStaffTeam>
        </div>
      </CardStaffTeam>
    );
  }

  return (
    <CardStaffTeam>
      {/* Header */}
      <div className="flex items-center justify-between mb-lg">
        <h2 className="text-xl font-semibold">Gerenciamento de Treinos</h2>
        {!showForm && (
          <ButtonStaffTeam 
            onClick={() => setShowForm(true)}
            disabled={isOperationLoading}
          >
            Novo Treino
          </ButtonStaffTeam>
        )}
      </div>

      {/* Exibir erros de operação */}
      {operationError && (
        <div className="alert alert-error mb-md">
          <span>{operationError}</span>
        </div>
      )}

      {/* Formulário de criação/edição */}
      {showForm && (
        <TreinoForm
          formData={formData}
          setFormData={setFormData}
          editingTreino={editingTreino}
          onSubmit={handleFormSubmit}
          onCancel={resetForm}
          isLoading={isOperationLoading}
          calcularDuracao={calcularDuracao}
        />
      )}

      {/* Lista de Treinos */}
      {!showForm && (
        <TreinoList 
          treinos={treinos || []}
          onEdit={startEdit}
          onDelete={handleDeleteTreino}
          isLoading={isOperationLoading}
        />
      )}
    </CardStaffTeam>
  );
};

export default TreinoComponent;
