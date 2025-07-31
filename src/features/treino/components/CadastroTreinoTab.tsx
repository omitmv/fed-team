import React from 'react';
import { MaterialIcon } from '../../../components';
import { TreinoFormData } from '../types';
import { useAppContext } from '../../../context';

interface CadastroTreinoTabProps {
  formData: TreinoFormData;
  setFormData: React.Dispatch<React.SetStateAction<TreinoFormData>>;
  error: string | null;
  loading: boolean;
  isFormLoading: boolean;
  onCreateTreino: () => void;
  onClearError: () => void;
  calcularDuracao: (dtInicio: string, dtFinal: string) => number;
}

const CadastroTreinoTab: React.FC<CadastroTreinoTabProps> = ({
  formData,
  setFormData,
  error,
  loading,
  isFormLoading,
  onCreateTreino,
  onClearError,
  calcularDuracao
}) => {
  const { state } = useAppContext();

  return (
    <div className="cadastro-content">
      <div className="cadastro-header">
        <h2>➕ Cadastro de Treino</h2>
        <p>Crie um novo treino personalizado</p>
      </div>

      <div className="cadastro-form">
        {error && (
          <div className="error-message">
            ⚠️ {error}
            <button onClick={onClearError} className="error-close">✖</button>
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
            onClick={onCreateTreino}
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
  );
};

export default CadastroTreinoTab;
