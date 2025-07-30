import React, { useState } from 'react';

export const SimpleDrawerTest: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => {
    console.log('🔄 Simple toggle called, current state:', isOpen);
    setIsOpen(prev => {
      console.log('📱 Changing from', prev, 'to', !prev);
      return !prev;
    });
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Teste Simples do Drawer</h2>
      <p>Estado atual: {isOpen ? 'ABERTO' : 'FECHADO'}</p>
      
      <button 
        onClick={toggle}
        style={{
          padding: '10px 20px',
          backgroundColor: isOpen ? 'red' : 'green',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        {isOpen ? 'Fechar' : 'Abrir'} Drawer
      </button>

      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '300px',
          height: '100vh',
          backgroundColor: '#333',
          color: 'white',
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 250ms ease',
          padding: '20px',
          zIndex: 1000
        }}
      >
        <h3>Drawer Simples</h3>
        <p>Este é um teste básico</p>
        <button 
          onClick={toggle}
          style={{
            padding: '8px 16px',
            backgroundColor: 'white',
            color: 'black',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Fechar
        </button>
      </div>

      {isOpen && (
        <div 
          onClick={toggle}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 999
          }}
        />
      )}
    </div>
  );
};

export default SimpleDrawerTest;
