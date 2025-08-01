import React from 'react';
import { MaterialIcon } from '../../../components';
import { TreinoFormData } from '../types';
import { useAppContext } from '../../../context';
import CardStaffTeam from '../../../components/CardStaffTeam';

interface TreinoFormProps {
  formData: TreinoFormData;
  setFormData: React.Dispatch<React.SetStateAction<TreinoFormData>>;
  editingTreino?: any; // Para futura edição
  onSubmit: (data: TreinoFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
  error?: string | null;
  onClearError?: () => void;
  calcularDuracao: (dtInicio: string, dtFinal: string) => number;
}

const TreinoForm: React.FC<TreinoFormProps> = ({
  formData,
  setFormData,
  editingTreino,
  onSubmit,
  onCancel,
  isLoading = false,
  error,
  onClearError,
  calcularDuracao
}) => {
  const { state } = useAppContext();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleInputChange = (field: keyof TreinoFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const duracao = formData.dtInicio && formData.dtFinal 
    ? calcularDuracao(formData.dtInicio, formData.dtFinal)
    : 0;

  return (
    <CardStaffTeam>
      <div className="flex items-center justify-between mb-lg">
        <div>
          <h3 className="text-lg color-text-primary mb-xs">
            <MaterialIcon name="add_circle" color="success" size="small" className="mr-xs" />
            {editingTreino ? 'Editar Treino' : 'Cadastrar Novo Treino'}
          </h3>
          <p className="text-sm color-text-secondary">
            {editingTreino ? 'Modifique as informações do treino' : 'Crie um novo treino personalizado'}
          </p>
        </div>
        <button 
          onClick={onCancel}
          className="btn btn-secondary btn-sm"
          disabled={isLoading}
        >
          <MaterialIcon name="close" size="small" className="mr-xs" />
          Cancelar
        </button>
      </div>

      {error && onClearError && (
        <div className="alert alert-error mb-md">
          <MaterialIcon name="error" color="error" size="small" />
          <span>{error}</span>
          <button 
            onClick={onClearError} 
            className="btn btn-sm btn-ghost ml-auto"
            title="Fechar erro"
            aria-label="Fechar mensagem de erro"
          >
            <MaterialIcon name="close" size="small" />
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="form-grid gap-md">
        {/* Informações Básicas */}
        <div className="form-section col-span-full">
          <h4 className="text-md mb-sm color-text-primary">
            <MaterialIcon name="info" color="primary" size="small" className="mr-xs" />
            Informações Básicas
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
            <div className="form-group">
              <label htmlFor="ds-treino" className="form-label">
                Nome do Treino*
              </label>
              <input
                id="ds-treino"
                type="text"
                value={formData.dsTreino}
                onChange={(e) => handleInputChange('dsTreino', e.target.value)}
                className="form-input"
                placeholder="Ex: Treino de Peito e Tríceps"
                required
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="cd-atleta" className="form-label">
                Atleta*
              </label>
              <input
                id="cd-atleta"
                type="number"
                value={formData.cdAtleta}
                onChange={(e) => handleInputChange('cdAtleta', Number(e.target.value))}
                className="form-input"
                placeholder="ID do atleta"
                required
                disabled={isLoading}
              />
              <small className="form-hint">
                TODO: Implementar seleção de atleta
              </small>
            </div>
          </div>
        </div>

        {/* Período */}
        <div className="form-section col-span-full">
          <h4 className="text-md mb-sm color-text-primary">
            <MaterialIcon name="schedule" color="primary" size="small" className="mr-xs" />
            Período do Treino
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
            <div className="form-group">
              <label htmlFor="dt-inicio" className="form-label">
                Data de Início*
              </label>
              <input
                id="dt-inicio"
                type="date"
                value={formData.dtInicio}
                onChange={(e) => handleInputChange('dtInicio', e.target.value)}
                className="form-input"
                required
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="dt-final" className="form-label">
                Data Final*
              </label>
              <input
                id="dt-final"
                type="date"
                value={formData.dtFinal}
                onChange={(e) => handleInputChange('dtFinal', e.target.value)}
                className="form-input"
                required
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Duração</label>
              <div className="form-input-static">
                <MaterialIcon name="access_time" color="accent" size="small" className="mr-xs" />
                {duracao > 0 ? `${duracao} dias` : 'Defina as datas'}
              </div>
            </div>
          </div>
        </div>

        {/* Profissional */}
        <div className="form-section col-span-full">
          <h4 className="text-md mb-sm color-text-primary">
            <MaterialIcon name="person" color="primary" size="small" className="mr-xs" />
            Profissional Responsável
          </h4>
          
          <div className="form-group">
            <label htmlFor="cd-profissional" className="form-label">
              Profissional*
            </label>
            <input
              id="cd-profissional"
              type="number"
              value={formData.cdProfissional}
              onChange={(e) => handleInputChange('cdProfissional', Number(e.target.value))}
              className="form-input"
              required
              disabled={isLoading}
            />
            <small className="form-hint">
              Usuário logado: {state.currentUser?.nome || 'Não identificado'}
            </small>
          </div>
        </div>

        {/* Observações */}
        <div className="form-section col-span-full">
          <h4 className="text-md mb-sm color-text-primary">
            <MaterialIcon name="notes" color="primary" size="small" className="mr-xs" />
            Observações
          </h4>
          
          <div className="form-group">
            <label htmlFor="obs" className="form-label">
              Observações
            </label>
            <textarea
              id="obs"
              value={formData.obs || ''}
              onChange={(e) => handleInputChange('obs', e.target.value)}
              className="form-textarea"
              placeholder="Observações adicionais sobre o treino..."
              rows={4}
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex gap-sm justify-end col-span-full pt-md border-t">
          <button 
            type="button" 
            onClick={onCancel}
            className="btn btn-secondary"
            disabled={isLoading}
          >
            Cancelar
          </button>
          <button 
            type="submit"
            className="btn btn-primary"
            disabled={isLoading || !formData.dsTreino || !formData.dtInicio || !formData.dtFinal}
          >
            {isLoading ? (
              <>
                <MaterialIcon name="hourglass_empty" size="small" className="mr-xs animate-spin" />
                {editingTreino ? 'Salvando...' : 'Criando...'}
              </>
            ) : (
              <>
                <MaterialIcon name="save" size="small" className="mr-xs" />
                {editingTreino ? 'Salvar Alterações' : 'Criar Treino'}
              </>
            )}
          </button>
        </div>
      </form>
    </CardStaffTeam>
  );
};

export default TreinoForm;
