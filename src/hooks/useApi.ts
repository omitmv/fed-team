import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { UseApiResult } from '../types';
import { ApiErrorHandler } from '../utils/errorHandler';

/**
 * Hook customizado para requisições GET à API
 * @param url - Endpoint da API
 * @param immediate - Se deve fazer a requisição imediatamente
 * @returns Objeto com dados, loading, error e função refetch
 */
export function useApi<T>(url: string, immediate: boolean = true): UseApiResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(immediate);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get<T>(url);
      setData(response.data);
    } catch (err: any) {
      const errorMessage = ApiErrorHandler.handleError(err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [url]);

  const refetch = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (immediate) {
      fetchData();
    }
  }, [fetchData, immediate]);

  return {
    data,
    loading,
    error,
    refetch,
  };
}

/**
 * Hook customizado para operações de criação (POST)
 * @returns Função para criar recurso e estados de loading/error
 */
export function useApiCreate<T, D = any>() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const create = useCallback(async (url: string, data: D): Promise<T | null> => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.post<T>(url, data);
      return response.data;
    } catch (err: any) {
      const errorMessage = ApiErrorHandler.handleError(err);
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    create,
    loading,
    error,
  };
}

/**
 * Hook customizado para operações de atualização (PUT)
 * @returns Função para atualizar recurso e estados de loading/error
 */
export function useApiUpdate<T, D = any>() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const update = useCallback(async (url: string, data: D): Promise<T | null> => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.put<T>(url, data);
      return response.data;
    } catch (err: any) {
      const errorMessage = ApiErrorHandler.handleError(err);
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    update,
    loading,
    error,
  };
}

/**
 * Hook customizado para operações de exclusão (DELETE)
 * @returns Função para deletar recurso e estados de loading/error
 */
export function useApiDelete() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const deleteResource = useCallback(async (url: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      await api.delete(url);
      return true;
    } catch (err: any) {
      const errorMessage = ApiErrorHandler.handleError(err);
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    deleteResource,
    loading,
    error,
  };
}
