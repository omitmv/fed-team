import React from 'react';
import SimpleDrawerTest from '../components/SimpleDrawerTest';
import NavigationTest from '../components/NavigationTest';

const TestPage: React.FC = () => {
  return (
    <div>
      <NavigationTest />
      <div style={{ padding: '20px', marginTop: '100px' }}>
        <h1>Página de Teste</h1>
        <p>Use o menu hamburger acima para testar o drawer.</p>
        <SimpleDrawerTest />
      </div>
    </div>
  );
};

export default TestPage;
