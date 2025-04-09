import React, { useState, useEffect } from 'react';
import './BallSortGame.css';
import Tube from './Tube';
import { generatePuzzle, isSolved, canMove, getHint, saveGame, loadGame } from '../utils/gameUtils';

// 遊戲版本
const GAME_VERSION = 'v1.6.0';

// 遊戲難度級別配置 (修改空管數量，使高難度更具挑戰性)
const DIFFICULTY_LEVELS = {
  BEGINNER: { tubes: 7, colors: 3, emptyTubes: 4 },    // 3+4 試管 (最簡單)
  EASY: { tubes: 9, colors: 4, emptyTubes: 5 },        // 4+5 試管 (簡單)
  MEDIUM: { tubes: 9, colors: 6, emptyTubes: 3 },      // 6+3 試管 (中等)
  HARD: { tubes: 11, colors: 8, emptyTubes: 3 },       // 8+3 試管 (困難)
  EXPERT: { tubes: 13, colors: 10, emptyTubes: 3 },    // 10+3 試管 (專家)
  MASTER: { tubes: 15, colors: 12, emptyTubes: 3 },    // 12+3 試管 (大師)
  INSANE: { tubes: 16, colors: 14, emptyTubes: 2 },    // 14+2 試管 (瘋狂)
  NIGHTMARE: { tubes: 17, colors: 16, emptyTubes: 1 }  // 16+1 試管 (噩夢)
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
  const [theme, setTheme] = useState('light'); // 新增主題切換
  const [highScores, setHighScores] = useState({}); // 儲存各難度的最佳成績
  
  // 初始化遊戲
  useEffect(() => {
    // 嘗試從本地存儲加載遊戲
    const savedGame = loadGame();
    const savedScores = localStorage.getItem('ballSortHighScores');
    
    if (savedScores) {
      setHighScores(JSON.parse(savedScores));
    }
    
    // 載入之前保存的主題設置
    const savedTheme = localStorage.getItem('ballSortTheme');
    if (savedTheme) {
      setTheme(savedTheme);
    }
    
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
  
  // 主題變更時應用到 body
  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem('ballSortTheme', theme);
  }, [theme]);
  
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
      
      // 儲存最佳成績
      if (highScores[difficulty] === undefined || 
          moveCount < highScores[difficulty].moves || 
          (moveCount === highScores[difficulty].moves && gameTime < highScores[difficulty].time)) {
        const newHighScores = {...highScores};
        newHighScores[difficulty] = { moves: moveCount, time: gameTime };
        setHighScores(newHighScores);
        localStorage.setItem('ballSortHighScores', JSON.stringify(newHighScores));
      }
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
          
          // 從源試管頂部取出一個球（第一個元素，對應視覺上最上面的球）
          const ball = newTubes[sourceIndex].shift();
          
          // 放入目標試管頂部（添加到數組開頭）
          newTubes[targetIndex].unshift(ball);
          
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
      
      // 從目標試管頂部取出球（現在是第一個元素）
      const ball = newTubes[lastMove.to].shift();
      
      // 放回源試管頂部（添加到數組開頭）
      newTubes[lastMove.from].unshift(ball);
      
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
  
  // 切換主題
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
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

  // 獲取難度中文名稱
  const getDifficultyName = (diff) => {
    const difficultyNames = {
      'BEGINNER': '入門',
      'EASY': '簡單',
      'MEDIUM': '中等',
      'HARD': '困難',
      'EXPERT': '專家',
      'MASTER': '大師',
      'INSANE': '瘋狂',
      'NIGHTMARE': '噩夢'
    };
    return difficultyNames[diff] || diff;
  };

  // 取得當前難度的最佳成績
  const getCurrentHighScore = () => {
    if (highScores[difficulty]) {
      return {
        moves: highScores[difficulty].moves,
        time: formatTime(highScores[difficulty].time)
      };
    }
    return null;
  };

  const highScore = getCurrentHighScore();

  return (
    <div className={`ball-sort-game ${theme}`}>
      <div className="game-header">
        <div className="game-title">Bob的試管倒球遊戲</div>
        <div className="game-version">{GAME_VERSION}</div>
        <button 
          className="theme-toggle" 
          onClick={toggleTheme}
          aria-label={theme === 'light' ? '切換到深色模式' : '切換到淺色模式'}
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </div>
      
      <div className="game-info">
        <div className="game-stats">
          <div className="move-counter">步數: {moveCount}</div>
          <div className="timer">時間: {formatTime(gameTime)}</div>
          <div className="difficulty-display">難度: {getDifficultyName(difficulty)}</div>
        </div>
        
        <div className="difficulty-selector">
          <select 
            value={difficulty} 
            onChange={(e) => changeDifficulty(e.target.value)}
            aria-label="選擇難度"
          >
            <option value="BEGINNER">入門</option>
            <option value="EASY">簡單</option>
            <option value="MEDIUM">中等</option>
            <option value="HARD">困難</option>
            <option value="EXPERT">專家</option>
            <option value="MASTER">大師</option>
            <option value="INSANE">瘋狂</option>
            <option value="NIGHTMARE">噩夢</option>
          </select>
        </div>
        
        {highScore && (
          <div className="high-score">
            <div>最佳: {highScore.moves}步 {highScore.time}</div>
          </div>
        )}
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
          <div>難度: {getDifficultyName(difficulty)}</div>
          <div>移動次數: {moveCount} 步</div>
          <div>用時: {formatTime(gameTime)}</div>
          {highScore && moveCount <= highScore.moves && gameTime <= highScores[difficulty].time && (
            <div className="new-record">🏆 新記錄！</div>
          )}
        </div>
      )}
    </div>
  );
};

export default BallSortGame;