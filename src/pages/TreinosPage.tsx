import React, { useState, useEffect } from 'react';
import { usePermissions } from '../hooks/usePermissions';
import { useTreino } from '../hooks/useTreino';
import { TreinoFormData, TreinoWithUsers } from '../features/treino/types';
import { useAppContext } from '../context';
import { MaterialIcon } from '../components';
import PageStaffTeam from '../components/PageStaffTeam';
import PageHeaderStaffTeam from '../components/PageHeaderStaffTeam';
import PageContentStaffTeam from '../components/PageContentStaffTeam';
import { 
  MeusTreinosTab, 
  BibliotecaTab, 
  HistoricoTab, 
  CadastroTreinoTab,
  TreinoTabNavigation
} from '../features/treino';

const TreinosPage: React.FC = () => {
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
  
  const [activeTab, setActiveTab] = useState<'meus-treinos' | 'biblioteca' | 'historico' | 'cadastro'>('meus-treinos');
  const [treinos, setTreinos] = useState<TreinoWithUsers[]>([]);
  const [isFormLoading, setIsFormLoading] = useState(false);
  
  // Form state para cadastro
  // Profissional é automaticamente definido como o usuário logado
  const [formData, setFormData] = useState<TreinoFormData>({
    dsTreino: '',
    dtInicio: '',
    dtFinal: '',
    cdProfissional: state.currentUser ? Number(state.currentUser.id) : 1,
    cdAtleta: 1, // TODO: Implementar seleção de atleta
    obs: ''
  });

  // Carregar treinos ao montar o componente
  useEffect(() => {
    const loadTreinos = async () => {
      const data = await getTreinosWithUsers();
      setTreinos(data);
    };
    
    loadTreinos();
  }, [getTreinosWithUsers]);

  const handleCreateTreino = async () => {
    if (activeTab !== 'cadastro') {
      setActiveTab('cadastro');
      return;
    }

    // Validar formulário
    const { dsTreino, dtInicio, dtFinal } = formData;
    
    if (!dsTreino.trim()) {
      alert('Nome do treino é obrigatório');
      return;
    }

    if (!dtInicio || !dtFinal) {
      alert('Datas de início e fim são obrigatórias');
      return;
    }

    const validationError = validarDatas(dtInicio, dtFinal);
    if (validationError) {
      alert(validationError);
      return;
    }

    setIsFormLoading(true);
    const newTreino = await createTreino(formData);
    
    if (newTreino) {
      alert('Treino criado com sucesso!');
      // Limpar formulário
      setFormData({
        dsTreino: '',
        dtInicio: '',
        dtFinal: '',
        cdProfissional: state.currentUser ? Number(state.currentUser.id) : 1,
        cdAtleta: 1,
        obs: ''
      });
      // Recarregar lista de treinos
      const updatedTreinos = await getTreinosWithUsers();
      setTreinos(updatedTreinos);
      // Voltar para aba de treinos
      setActiveTab('meus-treinos');
    }
    
    setIsFormLoading(false);
  };

  const handleExecutarTreino = (treinoId: string) => {
    // TODO: Implementar navegação para execução do treino
    console.log('Executar treino:', treinoId);
  };

  return (
    <PageStaffTeam>
      <PageHeaderStaffTeam
        icon={<MaterialIcon name="fitness_center" color="primary" size="medium" />}
        title="Treinos"
        subtitle="Gerencie seus treinos e acompanhe seu progresso"
      />
      <PageContentStaffTeam>
        <div className="flex justify-between items-center mb-lg">
          <div></div>
          <button 
            className="btn btn-primary"
            onClick={handleCreateTreino}
          >
            ➕ Novo Treino
          </button>
        </div>

        {/* Tabs de navegação */}
        <TreinoTabNavigation 
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Conteúdo das tabs */}
        <div className="tab-content">
          {activeTab === 'meus-treinos' && (
            <MeusTreinosTab
              treinos={treinos}
              loading={loading}
              onExecutarTreino={handleExecutarTreino}
              onCadastrarTreino={() => setActiveTab('cadastro')}
            />
          )}

          {activeTab === 'biblioteca' && (
            <BibliotecaTab />
          )}

          {activeTab === 'historico' && (
            <HistoricoTab />
          )}

          {activeTab === 'cadastro' && canCreateTraining() && (
            <CadastroTreinoTab
              formData={formData}
              setFormData={setFormData}
              error={error}
              loading={loading}
              isFormLoading={isFormLoading}
              onCreateTreino={handleCreateTreino}
              onClearError={clearError}
              calcularDuracao={calcularDuracao}
            />
          )}
        </div>
      </PageContentStaffTeam>
    </PageStaffTeam>
  );
};

export default TreinosPage;
