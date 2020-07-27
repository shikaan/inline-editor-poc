import React from 'react';
import './App.css';
import Article from "./Article.jsx"
import {Github} from "./github/Github"

function App() {
  return (
    <div className="App">
      <Github>
        <Article/>
      </Github>
    </div>
  );
}

export default App;
