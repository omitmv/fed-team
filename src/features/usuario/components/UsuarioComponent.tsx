import React, { useState } from 'react';
import { useApi, useApiCreate, useApiUpdate, useApiDelete } from '../../../hooks/useApi';
import { Usuario, UsuarioCreate, UsuarioUpdate } from '../types';
import { ENDPOINTS } from '../../../constants';
import CardStaffTeam from '../../../components/CardStaffTeam';
import UsuarioForm from './UsuarioForm';
import UsuarioList from './UsuarioList';
import ButtonStaffTeam from '../../../components/ButtonStaffTeam';

const UsuarioComponent: React.FC = () => {
  // Estados para o formulário
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<Usuario | null>(null);
  const [formData, setFormData] = useState<UsuarioCreate>({
    login: '',
    senha: '',
    nome: '',
    email: '',
    flAtivo: true,
    dtExpiracao: '',
    cdTpAcesso: 6, // Tipo de acesso padrão
  });

  // Usando hooks customizados para operações da API
  const { data: usuarios, loading, error, refetch } = useApi<Usuario[]>(ENDPOINTS.USUARIOS);
  const { create, loading: createLoading, error: createError } = useApiCreate<Usuario, UsuarioCreate>();
  const { update, loading: updateLoading, error: updateError } = useApiUpdate<Usuario, UsuarioUpdate>();
  const { deleteResource, loading: deleteLoading, error: deleteError } = useApiDelete<Usuario>();

  // Função para criar um novo usuário
  const handleCreateUser = async (userData: UsuarioCreate) => {
    // Enviar senha em texto plano - criptografia será feita no backend
    const newUser = await create(ENDPOINTS.USUARIOS, userData);
    if (newUser) {
      refetch(); // Recarrega a lista após criar
      setShowForm(false);
      resetForm();
    }
  };

  // Função para atualizar um usuário
  const handleUpdateUser = async (cdUsuario: number, userData: UsuarioUpdate) => {
    // Enviar senha em texto plano - criptografia será feita no backend
    const updatedUser = await update(ENDPOINTS.UPDATE_USUARIO(cdUsuario), userData);
    if (updatedUser) {
      refetch(); // Recarrega a lista após atualizar
      setEditingUser(null);
      resetForm();
    }
  };

  // Função para deletar um usuário
  const handleDeleteUser = async (cdUsuario: number) => {
    if (window.confirm('Tem certeza que deseja deletar este usuário?')) {
      const success = await deleteResource(ENDPOINTS.DELETE_USUARIO(cdUsuario));
      if (success) {
        refetch(); // Recarrega a lista após deletar
      }
    }
  };

  // Função para resetar o formulário
  const resetForm = () => {
    setFormData({
      login: '',
      senha: '',
      nome: '',
      email: '',
      flAtivo: true,
      dtExpiracao: '',
      cdTpAcesso: 6,
    });
    setEditingUser(null);
    setShowForm(false);
  };

  // Função para iniciar edição
  const startEdit = (usuario: Usuario) => {
    setEditingUser(usuario);
    setFormData({
      login: usuario.login,
      senha: '', // Não mostrar senha atual
      nome: usuario.nome,
      email: usuario.email,
      flAtivo: usuario.flAtivo,
      dtExpiracao: usuario.dtExpiracao || '',
      cdTpAcesso: usuario.cdTpAcesso,
    });
    setShowForm(true);
  };

  // Função para submeter o formulário
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      // Atualização - não enviar campos vazios
      const updateData: UsuarioUpdate = {};
      if (formData.login !== editingUser.login) updateData.login = formData.login;
      if (formData.senha) updateData.senha = formData.senha;
      if (formData.nome !== editingUser.nome) updateData.nome = formData.nome;
      if (formData.email !== editingUser.email) updateData.email = formData.email;
      if (formData.flAtivo !== editingUser.flAtivo) updateData.flAtivo = formData.flAtivo;
      if (formData.dtExpiracao !== (editingUser.dtExpiracao || '')) {
        updateData.dtExpiracao = formData.dtExpiracao || undefined;
      }
      if (formData.cdTpAcesso !== editingUser.cdTpAcesso) {
        updateData.cdTpAcesso = formData.cdTpAcesso;
      }
      handleUpdateUser(editingUser.cdUsuario, updateData);
    } else {
      // Criação
      handleCreateUser(formData);
    }
  };

  // Estados de loading combinados
  const isOperationLoading = createLoading || updateLoading || deleteLoading;

  // Erros combinados
  const operationError = createError || updateError || deleteError;

  if (loading) {
    return <div className="text-center p-xl text-muted">Carregando usuários...</div>;
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <p>Erro: {error}</p>
        <ButtonStaffTeam
          onClick={refetch}
          className="btn-error"
          text='Tentar novamente' />
      </div>
    );
  }

  const handleNewUserOrCancel = () => {
    setFormData({
      login: '',
      senha: '',
      nome: '',
      email: '',
      flAtivo: true,
      dtExpiracao: '',
      cdTpAcesso: 6,
    });
    setEditingUser(null);
    setShowForm(!showForm);
  };

  return (
    <CardStaffTeam>
      <h2 className="text-primary mb-lg w-100">Lista de Usuários</h2>
      <div className="flex p-md mb-lgflex-wrap flex-center">
        <ButtonStaffTeam
          onClick={refetch}
          className="btn-secondary"
          disabled={isOperationLoading}>
          {isOperationLoading ? 'Processando...' : 'Atualizar Lista'}
        </ButtonStaffTeam>
        <ButtonStaffTeam
          onClick={handleNewUserOrCancel}
          className="btn-success"
          disabled={isOperationLoading}
        >
          {showForm ? 'Cancelar' : 'Novo Usuário'}
        </ButtonStaffTeam>
      </div>
      {operationError && (
        <div className="alert alert-error mb-lg">
          <p>Erro na operação: {operationError}</p>
        </div>
      )}
      {/* Formulário de criação/edição */}
      {showForm && (
        <UsuarioForm
          formData={formData}
          setFormData={setFormData}
          editingUser={editingUser}
          isOperationLoading={isOperationLoading}
          onSubmit={handleSubmit}
          onCancel={resetForm}
        />
      )}
      {/* Lista de usuários */}
      <UsuarioList 
        usuarios={usuarios || []}
        onEdit={startEdit}
        onDelete={handleDeleteUser}
        isLoading={isOperationLoading}
      />
    </CardStaffTeam>
  );
};

export default UsuarioComponent;
