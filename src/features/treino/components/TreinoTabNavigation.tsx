import React from 'react';
import { MaterialIcon } from '../../../components';
import { usePermissions } from '../../../hooks/usePermissions';

interface TreinoTabNavigationProps {
  activeTab: 'meus-treinos' | 'biblioteca' | 'historico' | 'cadastro';
  onTabChange: (tab: 'meus-treinos' | 'biblioteca' | 'historico' | 'cadastro') => void;
}

const TreinoTabNavigation: React.FC<TreinoTabNavigationProps> = ({ 
  activeTab, 
  onTabChange 
}) => {
  const { canCreateTraining } = usePermissions();

  return (
    <div className="tab-navigation">
      <button 
        className={`tab-button ${activeTab === 'meus-treinos' ? 'active' : ''}`}
        onClick={() => onTabChange('meus-treinos')}
      >
        <MaterialIcon name="fitness_center" color="primary" size="small" />
        Meus Treinos
      </button>
      <button 
        className={`tab-button ${activeTab === 'biblioteca' ? 'active' : ''}`}
        onClick={() => onTabChange('biblioteca')}
      >
        <MaterialIcon name="local_library" color="secondary" size="small" />
        Biblioteca
      </button>
      <button 
        className={`tab-button ${activeTab === 'historico' ? 'active' : ''}`}
        onClick={() => onTabChange('historico')}
      >
        <MaterialIcon name="analytics" color="accent" size="small" />
        Histórico
      </button>
      {canCreateTraining() && (
        <button 
          className={`tab-button ${activeTab === 'cadastro' ? 'active' : ''}`}
          onClick={() => onTabChange('cadastro')}
        >
          <MaterialIcon name="add_circle" color="success" size="small" />
          Cadastro
        </button>
      )}
    </div>
  );
};

export default TreinoTabNavigation;
