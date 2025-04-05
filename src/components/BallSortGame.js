import React, { useState, useEffect } from 'react';
import './BallSortGame.css';
import Tube from './Tube';
import { generatePuzzle, isSolved, canMove } from '../utils/gameUtils';

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

  // 初始化遊戲
  useEffect(() => {
    startNewGame();
  }, [difficulty]);

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
  };

  // 檢查遊戲是否獲勝
  useEffect(() => {
    if (tubes.length > 0 && isSolved(tubes)) {
      setGameWon(true);
    }
  }, [tubes]);

  // 選擇試管
  const handleTubeClick = (index) => {
    // 如果已經獲勝，則不處理點擊
    if (gameWon) return;

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
          const newTubes = [...tubes];
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
      const newTubes = [...tubes];
      
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
    }
  };

  // 改變難度
  const changeDifficulty = (newDifficulty) => {
    setDifficulty(newDifficulty);
  };

  return (
    <div className="ball-sort-game">
      <div className="game-info">
        <div className="move-counter">移動次數: {moveCount}</div>
        
        <div className="difficulty-selector">
          <label>難度: </label>
          <select 
            value={difficulty} 
            onChange={(e) => changeDifficulty(e.target.value)}
            disabled={moveCount > 0}
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
            onClick={() => handleTubeClick(index)}
          />
        ))}
      </div>
      
      <div className="game-controls">
        <button onClick={startNewGame}>重新開始</button>
        <button onClick={undoMove} disabled={moves.length === 0}>
          撤銷
        </button>
      </div>
      
      {gameWon && (
        <div className="win-message">
          🎉 恭喜！你完成了遊戲！共用了 {moveCount} 步。
        </div>
      )}
    </div>
  );
};

export default BallSortGame;
