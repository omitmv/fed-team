import React from 'react';
import { MaterialIcon } from '../../../components';
import { Treino, TreinoCreate } from '../types';
import { useAppContext } from '../../../context';
import CardStaffTeam from '../../../components/CardStaffTeam';

interface TreinoFormProps {
  formData: TreinoCreate;
  setFormData: React.Dispatch<React.SetStateAction<TreinoCreate>>;
  editingTreino?: Treino | null; // Para futura edição
  isOperationLoading?: boolean; // Para indicar se a operação está em andamento
  onSubmit: (data: TreinoCreate) => void;
  onCancel: () => void;
  isLoading?: boolean;
  calcularDuracao: (dtInicio: string, dtFinal: string) => number;
  atletas: { cdUsuario: number; nome: string }[]; // Lista de atletas para seleção
}

const TreinoForm: React.FC<TreinoFormProps> = ({
  formData,
  setFormData,
  editingTreino,
  onSubmit,
  onCancel,
  isLoading = false,
  calcularDuracao,
  atletas
}) => {
  const { state } = useAppContext();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleInputChange = (field: keyof TreinoCreate, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const duracao = formData.dtInicio && formData.dtFinal 
    ? calcularDuracao(
        typeof formData.dtInicio === 'string' ? formData.dtInicio : formData.dtInicio.toLocaleDateString().slice(0, 10),
        typeof formData.dtFinal === 'string' ? formData.dtFinal : formData.dtFinal.toLocaleDateString().slice(0, 10)
      )
    : 0;

  return (
    <CardStaffTeam>
      <h3 className="text-lg color-text-primary mb-xs">
        <MaterialIcon name="add_circle" color="success" size="small" className="mr-xs" />
        {editingTreino ? 'Editar Treino' : 'Cadastrar Novo Treino'}
      </h3>

      <form onSubmit={handleSubmit} className="form-grid gap-md">
        {/* Informações Básicas */}
        <div className="form-section col-span-full">
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
                className="form-input w-100"
                placeholder="Ex: Treino de Peito e Tríceps"
                required
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="cd-atleta" className="form-label">
                Atleta*
              </label>
              <select
                id="cd-atleta"
                value={formData.cdAtleta}
                onChange={(e) => handleInputChange('cdAtleta', Number(e.target.value))}
                className="form-input w-100"
                required
                disabled={isLoading}
              >
                <option value="">Selecione um atleta</option>
                {atletas.map(atleta => (
                  <option key={atleta.cdUsuario} value={atleta.cdUsuario}>
                    {atleta.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Período */}
        <div className="form-section col-span-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
            <div className="form-group">
              <label htmlFor="dt-inicio" className="form-label">
                Data de Início*
              </label>
              <input
                id="dt-inicio"
                type="date"
                value={typeof formData.dtInicio === 'string' ? formData.dtInicio : formData.dtInicio.toLocaleDateString('pt-BR').slice(0, 10)}
                onChange={(e) => handleInputChange('dtInicio', e.target.value)}
                className="form-input w-100"
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
                value={typeof formData.dtFinal === 'string' ? formData.dtFinal : formData.dtFinal.toLocaleDateString('pt-BR').slice(0, 10)}
                onChange={(e) => handleInputChange('dtFinal', e.target.value)}
                className="form-input w-100"
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
          <div className="form-group">
            <label htmlFor="cd-profissional" className="form-label">
              Profissional*
            </label>
            <input
              id="cd-profissional"
              type="hidden"
              value={formData.cdProfissional}
            />
            <p>{state.currentUser?.nome || 'Não identificado'}</p>
          </div>
        </div>

        {/* Observações */}
        <div className="form-section col-span-full">
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
            disabled={isLoading}
            className="btn btn-primary">
              {editingTreino ? 'Salvar' : 'Criar'}
          </button>
        </div>
      </form>
    </CardStaffTeam>
  );
};

export default TreinoForm;
