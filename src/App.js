import React, {useEffect, useState} from 'react';
import './App.css';
import Article from "./Article.jsx"
import {Github} from "./github/Github"

function App() {
  return (
    <div className="App">
      <Github/>
      <Article/>
    </div>
  );
}

export default App;
