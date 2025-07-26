import React from 'react';
import '../../../styles/theme.css';
import '../../../styles/components.css';
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
