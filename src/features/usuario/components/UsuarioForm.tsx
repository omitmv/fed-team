import React from 'react';
import { Usuario, UsuarioCreate } from '../types';
import CardStaffTeam from '../../../components/CardStaffTeam';
import ButtonStaffTeam from '../../../components/ButtonStaffTeam';

interface UsuarioFormProps {
  formData: UsuarioCreate;
  setFormData: React.Dispatch<React.SetStateAction<UsuarioCreate>>;
  editingUser: Usuario | null;
  isOperationLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

const UsuarioForm: React.FC<UsuarioFormProps> = ({
  formData,
  setFormData,
  editingUser,
  isOperationLoading,
  onSubmit,
  onCancel
}) => {
  return (
    <CardStaffTeam>
      <h3 className="text-primary mb-md">{editingUser ? 'Editar Usuário' : 'Novo Usuário'}</h3>
      <form onSubmit={onSubmit} className="grid gap-md">
        <div className="form-group">
          <label htmlFor="login" className="form-label">Login:</label>
          <input
            type="text"
            id="login"
            value={formData.login}
            onChange={(e) => setFormData({ ...formData, login: e.target.value })}
            maxLength={250}
            required
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label htmlFor="senha" className="form-label">Senha:</label>
          <input
            type="password"
            id="senha"
            value={formData.senha}
            onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
            placeholder={editingUser ? 'Deixe vazio para manter a atual' : ''}
            required={!editingUser}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label htmlFor="nome" className="form-label">Nome:</label>
          <input
            type="text"
            id="nome"
            value={formData.nome}
            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
            maxLength={250}
            required
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label htmlFor="email" className="form-label">E-mail:</label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            maxLength={250}
            required
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label htmlFor="flAtivo" className="form-label flex items-center gap-sm">
            <input
              type="checkbox"
              id="flAtivo"
              checked={formData.flAtivo}
              onChange={(e) => setFormData({ ...formData, flAtivo: e.target.checked })}
              className="form-checkbox"
            />
            Usuário Ativo
          </label>
        </div>

        <div className="form-group">
          <label htmlFor="dtExpiracao" className="form-label">Data de Expiração:</label>
          <input
            type="date"
            id="dtExpiracao"
            value={formData.dtExpiracao}
            onChange={(e) => setFormData({ ...formData, dtExpiracao: e.target.value })}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label htmlFor="cdTpAcesso" className="form-label">Tipo de Acesso:</label>
          <select
            id="cdTpAcesso"
            value={formData.cdTpAcesso}
            onChange={(e) => setFormData({ ...formData, cdTpAcesso: Number(e.target.value) })}
            className="form-control"
          >
            <option value="">Selecione um tipo de acesso</option>
            <option value="1">Administrador</option>
            <option value="2">Nutricionista</option>
            <option value="3">Treinador</option>
            <option value="4">Coach</option>
            <option value="5">Funcionário</option>
            <option value="6">Atleta</option>
          </select>
        </div>

        <div className="flex gap-md justify-end mt-lg">
          <ButtonStaffTeam 
            typeButton="submit"
            disabled={isOperationLoading}
            className="btn-primary">
              {editingUser ? 'Atualizar' : 'Criar'}
          </ButtonStaffTeam>
          <ButtonStaffTeam
            onClick={onCancel}
            className="btn-secondary">
              Cancelar
          </ButtonStaffTeam>
        </div>
      </form>
    </CardStaffTeam>
  );
};

export default UsuarioForm;
