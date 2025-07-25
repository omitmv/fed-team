import React from 'react';
import './App.css';
import UserList from './components/UserList';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Fed Team - React + Axios Project</h1>
        <p>Projeto front-end com integração à API</p>
      </header>
      
      <main className="App-main">
        <UserList />
      </main>
    </div>
  );
}

export default App;
