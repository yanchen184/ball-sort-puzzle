import React, { useState, useEffect } from 'react';
import './App.css';
import BallSortGame from './components/BallSortGame';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>試管倒球遊戲</h1>
      </header>
      <main>
        <BallSortGame />
      </main>
      <footer className="App-footer">
        <p>&copy; 2025 試管倒球遊戲 | <a href="https://github.com/yanchen184/ball-sort-puzzle" target="_blank" rel="noopener noreferrer">GitHub</a></p>
      </footer>
    </div>
  );
}

export default App;
