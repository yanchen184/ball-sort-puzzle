/**
 * 試管倒球遊戲邏輯工具
 */

// 顏色列表
const COLORS = [
  '#FF5252', // 紅色
  '#4CAF50', // 綠色
  '#2196F3', // 藍色
  '#FFC107', // 黃色
  '#9C27B0', // 紫色
  '#FF9800', // 橙色
  '#795548', // 棕色
  '#607D8B', // 藍灰色
  '#E91E63', // 粉紅色
  '#00BCD4', // 青色
  '#673AB7', // 深紫色
  '#3F51B5'  // 靛藍色
];

/**
 * 生成遊戲難題
 * @param {number} tubeCount - 試管總數
 * @param {number} colorCount - 顏色種類數
 * @param {number} emptyTubes - 空試管數量
 * @param {number} ballsPerTube - 每個試管的球數
 * @returns {Array} - 初始化的試管狀態
 */
export const generatePuzzle = (tubeCount, colorCount, emptyTubes, ballsPerTube) => {
  // 初始化試管數組
  const tubes = Array(tubeCount).fill().map(() => []);
  
  // 計算有球的試管數量
  const filledTubes = tubeCount - emptyTubes;
  
  // 生成所有球的列表
  const allBalls = [];
  for (let color = 0; color < colorCount; color++) {
    for (let i = 0; i < ballsPerTube; i++) {
      allBalls.push(COLORS[color]);
    }
  }
  
  // 隨機打亂球的順序
  shuffle(allBalls);
  
  // 將球分配到試管中
  for (let i = 0; i < allBalls.length; i++) {
    const tubeIndex = i % filledTubes;
    tubes[tubeIndex].push(allBalls[i]);
  }
  
  return tubes;
};

/**
 * 檢查遊戲是否已解決
 * @param {Array} tubes - 當前試管狀態
 * @returns {boolean} - 是否已解決
 */
export const isSolved = (tubes) => {
  for (const tube of tubes) {
    // 空試管是合法的
    if (tube.length === 0) continue;
    
    // 檢查試管是否完全填滿（4個球）或是否為空
    if (tube.length !== 4 && tube.length !== 0) return false;
    
    // 檢查試管中的所有球是否為同一顏色
    const firstColor = tube[0];
    for (let i = 1; i < tube.length; i++) {
      if (tube[i] !== firstColor) return false;
    }
  }
  
  return true;
};

/**
 * 檢查是否可以從一個試管移動到另一個試管
 * @param {Array} tubes - 當前試管狀態
 * @param {number} fromIndex - 源試管索引
 * @param {number} toIndex - 目標試管索引
 * @returns {boolean} - 是否可以移動
 */
export const canMove = (tubes, fromIndex, toIndex) => {
  const sourceTop = tubes[fromIndex].length - 1;
  const targetTop = tubes[toIndex].length - 1;
  
  // 源試管必須有球
  if (sourceTop < 0) return false;
  
  // 目標試管必須有空間
  if (tubes[toIndex].length >= 4) return false;
  
  // 如果目標試管為空，可以移動
  if (tubes[toIndex].length === 0) return true;
  
  // 顏色必須匹配
  return tubes[fromIndex][sourceTop] === tubes[toIndex][targetTop];
};

/**
 * 輔助函數：洗牌算法
 * @param {Array} array - 要洗牌的數組
 */
const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};

/**
 * 獲取提示 - 找到下一個可能的移動
 * @param {Array} tubes - 當前試管狀態
 * @returns {Object|null} - 提示移動，包含 fromIndex 和 toIndex，或 null 如果沒有可用提示
 */
export const getHint = (tubes) => {
  for (let i = 0; i < tubes.length; i++) {
    for (let j = 0; j < tubes.length; j++) {
      // 同一試管，跳過
      if (i === j) continue;
      
      // 檢查是否可以移動
      if (canMove(tubes, i, j)) {
        return { fromIndex: i, toIndex: j };
      }
    }
  }
  
  // 沒有可用提示
  return null;
};

/**
 * 保存遊戲狀態到本地存儲
 * @param {Object} gameState - 遊戲狀態
 */
export const saveGame = (gameState) => {
  localStorage.setItem('ballSortGame', JSON.stringify(gameState));
};

/**
 * 從本地存儲加載遊戲狀態
 * @returns {Object|null} - 加載的遊戲狀態，或如果沒有保存的狀態則為 null
 */
export const loadGame = () => {
  const savedGame = localStorage.getItem('ballSortGame');
  return savedGame ? JSON.parse(savedGame) : null;
};
