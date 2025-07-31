import { useState } from 'react';
import { Treino, TreinoFormData, TreinoCreateRequest, TreinoWithUsers } from '../features/treino/types';
import { api } from '../services/api';
import { mockApiTreino } from '../services/mockData';

// Flag para usar dados mock ou API real
const USE_MOCK_DATA = true;

/**
 * Hook para gerenciar operações de treino
 */
export const useTreino = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Criar um novo treino
   */
  const createTreino = async (formData: TreinoFormData): Promise<Treino | null> => {
    setLoading(true);
    setError(null);

    try {
      if (USE_MOCK_DATA) {
        const response = await mockApiTreino.createTreino(formData);
        return response as any as Treino;
      }

      const requestData: TreinoCreateRequest = {
        dsTreino: formData.dsTreino,
        dtInicio: new Date(formData.dtInicio),
        dtFinal: new Date(formData.dtFinal),
        cdProfissional: formData.cdProfissional,
        cdAtleta: formData.cdAtleta,
        obs: formData.obs
      };

      const response = await api.post('/v1/treino', requestData);
      return response.data as Treino;

    } catch (err: any) {
      console.error('Erro ao criar treino:', err);
      setError(err.response?.data?.message || 'Erro ao criar treino');
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Buscar treinos com informações de usuários
   */
  const getTreinosWithUsers = async (): Promise<TreinoWithUsers[]> => {
    setLoading(true);
    setError(null);

    try {
      if (USE_MOCK_DATA) {
        const response = await mockApiTreino.getTreinosWithUsers();
        return response;
      }

      const response = await api.get('/v1/treino/with-users');
      return response.data as TreinoWithUsers[];

    } catch (err: any) {
      console.error('Erro ao buscar treinos:', err);
      setError(err.response?.data?.message || 'Erro ao buscar treinos');
      return [];
    } finally {
      setLoading(false);
    }
  };

  /**
   * Buscar treino por ID
   */
  const getTreinoById = async (cdTreino: number): Promise<Treino | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get(`/v1/treino/${cdTreino}`);
      return response.data as Treino;

    } catch (err: any) {
      console.error('Erro ao buscar treino:', err);
      setError(err.response?.data?.message || 'Erro ao buscar treino');
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Atualizar treino
   */
  const updateTreino = async (cdTreino: number, formData: Partial<TreinoFormData>): Promise<Treino | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.put(`/v1/treino/${cdTreino}`, formData);
      return response.data as Treino;

    } catch (err: any) {
      console.error('Erro ao atualizar treino:', err);
      setError(err.response?.data?.message || 'Erro ao atualizar treino');
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Excluir treino
   */
  const deleteTreino = async (cdTreino: number): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      if (USE_MOCK_DATA) {
        const success = await mockApiTreino.deleteTreino(cdTreino);
        return success;
      }

      await api.delete(`/v1/treino/${cdTreino}`);
      return true;

    } catch (err: any) {
      console.error('Erro ao excluir treino:', err);
      setError(err.response?.data?.message || 'Erro ao excluir treino');
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Calcular duração em dias entre duas datas
   */
  const calcularDuracao = (dtInicio: string, dtFinal: string): number => {
    const inicio = new Date(dtInicio);
    const final = new Date(dtFinal);
    const diffTime = Math.abs(final.getTime() - inicio.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  /**
   * Validar datas do formulário
   */
  const validarDatas = (dtInicio: string, dtFinal: string): string | null => {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    
    const inicio = new Date(dtInicio);
    const final = new Date(dtFinal);

    if (inicio < hoje) {
      return 'Data de início não pode ser anterior a hoje';
    }

    if (final <= inicio) {
      return 'Data final deve ser posterior à data de início';
    }

    const diffDays = calcularDuracao(dtInicio, dtFinal);
    if (diffDays > 365) {
      return 'Duração do treino não pode exceder 365 dias';
    }

    return null;
  };

  return {
    loading,
    error,
    createTreino,
    getTreinosWithUsers,
    getTreinoById,
    updateTreino,
    deleteTreino,
    calcularDuracao,
    validarDatas,
    clearError: () => setError(null)
  };
};

export default useTreino;
