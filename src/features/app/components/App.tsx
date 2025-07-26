import React from 'react';
import '../styles/App.css';
import { UsuarioList } from '../../usuario';
// Para usar o componente de login, descomente a linha abaixo:
// import { Login } from '../../auth';

function App() {
  // Para usar a tela de login, substitua o conteúdo do return por:
  // return <Login />;
  
  return (
    <div className="App">
      <header className="App-header">
        <h1>Fed Team - Sistema de Usuários</h1>
        <p>Gerenciamento de Usuários com React + TypeScript</p>
        <p>API: {process.env.REACT_APP_API_BASE_URL}</p>
      </header>
      
      <main className="App-main">
        <UsuarioList />
      </main>
    </div>
  );
}

export default App;
