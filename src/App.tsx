import React from 'react';
import './App.css';
import UsuarioList from './components/UserList';

function App() {
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
