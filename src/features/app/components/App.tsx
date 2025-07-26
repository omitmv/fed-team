import React from 'react';
import '../../../theme.css';
import '../../../components.css';
import '../styles/App.css';
import { Login } from '../../auth';

function App() {
  return (
    <div className="App">
      <main className="App-main">
        <Login />
      </main>
    </div>
  );
}

export default App;
