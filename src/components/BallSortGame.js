import React, { useState, useEffect } from 'react';
import './BallSortGame.css';
import Tube from './Tube';
import { generatePuzzle, isSolved, canMove, getHint, saveGame, loadGame } from '../utils/gameUtils';

// 遊戲難度級別配置
const DIFFICULTY_LEVELS = {
  EASY: { tubes: 5, colors: 4, emptyTubes: 1 },
  MEDIUM: { tubes: 7, colors: 5, emptyTubes: 2 },
  HARD: { tubes: 9, colors: 7, emptyTubes: 2 },
  EXPERT: { tubes: 12, colors: 9, emptyTubes: 3 }
};

// 默認遊戲配置
const DEFAULT_DIFFICULTY = 'EASY';
const BALLS_PER_TUBE = 4;

const BallSortGame = () => {
  // 遊戲狀態
  const [tubes, setTubes] = useState([]);
  const [selectedTubeIndex, setSelectedTubeIndex] = useState(null);
  const [moveCount, setMoveCount] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [difficulty, setDifficulty] = useState(DEFAULT_DIFFICULTY);
  const [moves, setMoves] = useState([]); // 用於撤銷
  const [showHint, setShowHint] = useState(false);
  const [hint, setHint] = useState(null);
  const [gameTime, setGameTime] = useState(0);
  const [isGameActive, setIsGameActive] = useState(false);
  
  // 初始化遊戲
  useEffect(() => {
    // 嘗試從本地存儲加載遊戲
    const savedGame = loadGame();
    
    if (savedGame) {
      // 如果有保存的遊戲，詢問用戶是否要繼續
      if (window.confirm('發現保存的遊戲進度，是否繼續？')) {
        setTubes(savedGame.tubes);
        setMoveCount(savedGame.moveCount);
        setDifficulty(savedGame.difficulty);
        setMoves(savedGame.moves || []);
        setGameTime(savedGame.gameTime || 0);
        setIsGameActive(true);
        return;
      }
    }
    
    // 否則，開始新遊戲
    startNewGame();
  }, []);
  
  // 當難度變更時，開始新遊戲
  useEffect(() => {
    if (tubes.length > 0) { // 避免初始化時重複觸發
      startNewGame();
    }
  }, [difficulty]);

  // 遊戲計時器
  useEffect(() => {
    let timer = null;
    
    if (isGameActive && !gameWon) {
      timer = setInterval(() => {
        setGameTime(prevTime => prevTime + 1);
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isGameActive, gameWon]);

  // 保存遊戲狀態
  useEffect(() => {
    if (tubes.length > 0 && isGameActive) {
      const gameState = {
        tubes,
        moveCount,
        difficulty,
        moves,
        gameTime,
      };
      saveGame(gameState);
    }
  }, [tubes, moveCount, difficulty, moves, gameTime, isGameActive]);

  // 開始新遊戲
  const startNewGame = () => {
    const config = DIFFICULTY_LEVELS[difficulty];
    const newTubes = generatePuzzle(
      config.tubes,
      config.colors,
      config.emptyTubes,
      BALLS_PER_TUBE
    );
    
    setTubes(newTubes);
    setSelectedTubeIndex(null);
    setMoveCount(0);
    setGameWon(false);
    setMoves([]);
    setShowHint(false);
    setHint(null);
    setGameTime(0);
    setIsGameActive(true);
  };

  // 檢查遊戲是否獲勝
  useEffect(() => {
    if (tubes.length > 0 && isSolved(tubes)) {
      setGameWon(true);
      setIsGameActive(false);
    }
  }, [tubes]);

  // 選擇試管
  const handleTubeClick = (index) => {
    // 如果已經獲勝，則不處理點擊
    if (gameWon) return;
    
    // 隱藏提示
    if (showHint) {
      setShowHint(false);
    }

    // 如果沒有選中的試管，選擇當前點擊的試管
    if (selectedTubeIndex === null) {
      // 只有非空的試管才能被選中
      if (tubes[index].length > 0) {
        setSelectedTubeIndex(index);
      }
    } else {
      // 如果已經有選中的試管，嘗試移動球
      if (selectedTubeIndex !== index) {
        const sourceIndex = selectedTubeIndex;
        const targetIndex = index;
        
        // 檢查是否可以移動
        if (canMove(tubes, sourceIndex, targetIndex)) {
          // 創建新的試管狀態
          const newTubes = JSON.parse(JSON.stringify(tubes)); // 深拷貝
          // 從源試管取出一個球
          const ball = newTubes[sourceIndex].pop();
          // 放入目標試管
          newTubes[targetIndex].push(ball);
          
          // 保存移動歷史
          setMoves([...moves, { from: sourceIndex, to: targetIndex, ball }]);
          
          // 更新狀態
          setTubes(newTubes);
          setMoveCount(moveCount + 1);
        }
        
        // 無論移動是否成功，都清除選中狀態
        setSelectedTubeIndex(null);
      } else {
        // 如果點擊的是已選中的試管，取消選中
        setSelectedTubeIndex(null);
      }
    }
  };

  // 撤銷上一步移動
  const undoMove = () => {
    if (moves.length > 0) {
      const lastMove = moves[moves.length - 1];
      const newTubes = JSON.parse(JSON.stringify(tubes)); // 深拷貝
      
      // 從目標試管取出球
      const ball = newTubes[lastMove.to].pop();
      // 放回源試管
      newTubes[lastMove.from].push(ball);
      
      // 更新狀態
      setTubes(newTubes);
      setMoves(moves.slice(0, -1));
      setMoveCount(moveCount - 1);
      setSelectedTubeIndex(null);
      setGameWon(false);
      setIsGameActive(true);
    }
  };

  // 改變難度
  const changeDifficulty = (newDifficulty) => {
    if (moveCount > 0) {
      if (!window.confirm('更改難度將開始新遊戲，您確定要繼續嗎？')) {
        return;
      }
    }
    setDifficulty(newDifficulty);
  };
  
  // 顯示提示
  const showGameHint = () => {
    const newHint = getHint(tubes);
    setHint(newHint);
    setShowHint(true);
    
    // 如果沒有找到提示，提示用戶
    if (!newHint) {
      alert('沒有可用的提示，可能遊戲已經陷入死局。嘗試撤銷一些步驟或重新開始。');
    }
  };
  
  // 格式化時間
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="ball-sort-game">
      <div className="game-info">
        <div className="move-counter">移動次數: {moveCount}</div>
        
        <div className="timer">時間: {formatTime(gameTime)}</div>
        
        <div className="difficulty-selector">
          <label>難度: </label>
          <select 
            value={difficulty} 
            onChange={(e) => changeDifficulty(e.target.value)}
          >
            <option value="EASY">簡單</option>
            <option value="MEDIUM">中等</option>
            <option value="HARD">困難</option>
            <option value="EXPERT">專家</option>
          </select>
        </div>
      </div>
      
      <div className="tubes-container">
        {tubes.map((tube, index) => (
          <Tube
            key={index}
            balls={tube}
            isSelected={index === selectedTubeIndex}
            isHinted={showHint && hint && (index === hint.fromIndex || index === hint.toIndex)}
            isSource={showHint && hint && index === hint.fromIndex}
            onClick={() => handleTubeClick(index)}
          />
        ))}
      </div>
      
      <div className="game-controls">
        <button onClick={startNewGame}>重新開始</button>
        <button onClick={undoMove} disabled={moves.length === 0}>
          撤銷
        </button>
        <button onClick={showGameHint} disabled={gameWon}>
          提示
        </button>
      </div>
      
      {gameWon && (
        <div className="win-message">
          🎉 恭喜！你完成了遊戲！
          <div>移動次數: {moveCount} 步</div>
          <div>用時: {formatTime(gameTime)}</div>
        </div>
      )}
    </div>
  );
};

export default BallSortGame;
