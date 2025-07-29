import React from 'react';
import '../../../styles/theme.css';
import '../../../styles/components.css';
import '../styles/App.css';
import PluginManager from './PluginManager';
//import { Login } from '../../auth';

function App() {
  return (
    <div className="App">
      <main className="App-main">
        {/* <Login /> */}
        <PluginManager />
      </main>
    </div>
  );
}

export default App;
