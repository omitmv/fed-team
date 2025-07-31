import React, { useState } from 'react';
import { MaterialIcon } from '../../../components';

interface BibliotecaTabProps {
  // Pode adicionar props futuramente para dados reais de exercícios
}

const BibliotecaTab: React.FC<BibliotecaTabProps> = () => {
  const [grupoMuscular, setGrupoMuscular] = useState('');
  const [equipamento, setEquipamento] = useState('');

  // Mock data - futuramente substituir por dados reais
  const exerciciosMock = [
    {
      id: 1,
      nome: 'Supino Reto',
      grupo: 'Peito',
      equipamento: 'Barra',
      icon: 'fitness_center'
    },
    {
      id: 2,
      nome: 'Agachamento',
      grupo: 'Pernas',
      equipamento: 'Peso Corporal',
      icon: 'sports_gymnastics'
    },
    {
      id: 3,
      nome: 'Desenvolvimento',
      grupo: 'Ombros',
      equipamento: 'Halteres',
      icon: 'sports_martial_arts'
    }
  ];

  return (
    <div className="biblioteca-content">
      <div className="biblioteca-header">
        <h2>📚 Biblioteca de Exercícios</h2>
        <p>Explore nossa coleção de exercícios</p>
      </div>
      
      {/* Filtros */}
      <div className="exercicios-filters">
        <select 
          className="form-select" 
          aria-label="Filtrar por grupo muscular"
          value={grupoMuscular}
          onChange={(e) => setGrupoMuscular(e.target.value)}
        >
          <option value="">Todos os grupos musculares</option>
          <option value="peito">Peito</option>
          <option value="costas">Costas</option>
          <option value="ombros">Ombros</option>
          <option value="bracos">Braços</option>
          <option value="pernas">Pernas</option>
          <option value="core">Core</option>
        </select>
        <select 
          className="form-select" 
          aria-label="Filtrar por equipamento"
          value={equipamento}
          onChange={(e) => setEquipamento(e.target.value)}
        >
          <option value="">Todos os equipamentos</option>
          <option value="barra">Barra</option>
          <option value="halteres">Halteres</option>
          <option value="maquinas">Máquinas</option>
          <option value="peso-corporal">Peso Corporal</option>
        </select>
      </div>

      {/* Grid de exercícios */}
      <div className="exercicios-grid">
        {exerciciosMock.map((exercicio) => (
          <div key={exercicio.id} className="exercicio-card">
            <div className="exercicio-image">
              <MaterialIcon 
                name={exercicio.icon as any} 
                color="primary" 
                size="medium" 
              />
            </div>
            <div className="exercicio-info">
              <h4>{exercicio.nome}</h4>
              <p>{exercicio.grupo} • {exercicio.equipamento}</p>
            </div>
            <div className="exercicio-actions">
              <button className="btn btn-secondary btn-sm">
                <MaterialIcon name="info" color="secondary" size="small" />
                Ver Detalhes
              </button>
              <button className="btn btn-primary btn-sm">
                <MaterialIcon name="add" color="primary" size="small" />
                Adicionar
              </button>
            </div>
          </div>
        ))}
        
        {/* Placeholder para mais exercícios */}
        <div className="exercicio-card placeholder">
          <div className="exercicio-image">
            <MaterialIcon name="add_circle_outline" color="disabled" size="medium" />
          </div>
          <div className="exercicio-info">
            <h4>Mais exercícios em breve...</h4>
            <p>Biblioteca em expansão</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BibliotecaTab;
