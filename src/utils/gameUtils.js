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
  // 檢查參數有效性
  if (colorCount > COLORS.length) {
    console.warn(`顏色數量超過預設顏色數 (${COLORS.length})，已自動調整`);
    colorCount = COLORS.length;
  }
  
  // 初始化試管數組
  const tubes = Array(tubeCount).fill().map(() => []);
  
  // 計算有球的試管數量
  const filledTubes = tubeCount - emptyTubes;
  
  // 確保填充的試管數量足夠放下所有不同顏色的球
  if (filledTubes < colorCount) {
    console.warn('填充的試管數量不足以放下所有不同顏色的球');
    return generatePuzzle(colorCount + emptyTubes, colorCount, emptyTubes, ballsPerTube);
  }
  
  // 首先創建已排序的球 (每個試管都有相同顏色的球)
  const sortedTubes = [];
  for (let color = 0; color < colorCount; color++) {
    const tube = [];
    for (let i = 0; i < ballsPerTube; i++) {
      tube.push(COLORS[color]);
    }
    sortedTubes.push(tube);
  }
  
  // 添加任何額外的填充試管 (如果需要)
  for (let i = colorCount; i < filledTubes; i++) {
    sortedTubes.push([]);
  }
  
  // 從排序的試管中隨機提取球並放入游戲試管
  // 這裡我們實現一個更復雜的邏輯來確保遊戲有解
  
  // 1. 首先建立一個包含所有球的陣列
  let allBalls = [];
  sortedTubes.forEach(tube => {
    allBalls = allBalls.concat(tube);
  });
  
  // 2. 徹底洗牌
  shuffle(allBalls);
  
  // 3. 將球重新分配到試管中，但確保沒有試管包含同一顏色的所有球
  const filledTubesIndices = Array.from({ length: filledTubes }, (_, i) => i);
  
  for (let i = 0; i < allBalls.length; i++) {
    let tubeIndex;
    
    // 對於最後一個同色球，確保它不與其他同色球放在同一試管
    const ballColor = allBalls[i];
    const isLastOfColor = allBalls.filter(b => b === ballColor).length === 1;
    
    if (isLastOfColor) {
      // 找一個不包含這種顏色的試管
      const availableTubes = filledTubesIndices.filter(idx => 
        !tubes[idx].includes(ballColor) && tubes[idx].length < ballsPerTube
      );
      
      // 如果找不到合適的試管，就隨機選一個有空間的試管
      if (availableTubes.length === 0) {
        const tubesWithSpace = filledTubesIndices.filter(idx => tubes[idx].length < ballsPerTube);
        tubeIndex = tubesWithSpace[Math.floor(Math.random() * tubesWithSpace.length)];
      } else {
        tubeIndex = availableTubes[Math.floor(Math.random() * availableTubes.length)];
      }
    } else {
      // 對於其他球，隨機選擇一個有空間的試管
      const tubesWithSpace = filledTubesIndices.filter(idx => tubes[idx].length < ballsPerTube);
      tubeIndex = tubesWithSpace[Math.floor(Math.random() * tubesWithSpace.length)];
    }
    
    tubes[tubeIndex].push(allBalls[i]);
  }
  
  // 確保遊戲開始時沒有試管是完美排序的
  for (let i = 0; i < filledTubes; i++) {
    if (tubes[i].length === ballsPerTube) {
      const color = tubes[i][0];
      const allSameColor = tubes[i].every(ball => ball === color);
      
      if (allSameColor) {
        // 如果有完美排序的試管，就交換一些球打亂它
        const otherTubeIdx = (i + 1) % filledTubes;
        const temp = tubes[i][0];
        tubes[i][0] = tubes[otherTubeIdx][0];
        tubes[otherTubeIdx][0] = temp;
      }
    }
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
  const sourceTube = tubes[fromIndex];
  const targetTube = tubes[toIndex];
  
  // 源試管必須有球
  if (sourceTube.length === 0) return false;
  
  // 目標試管必須有空間
  if (targetTube.length >= 4) return false;
  
  // 獲取源試管頂部的球 (現在是第一個元素，對應視覺上的最上面球)
  const topBall = sourceTube[0];
  
  // 如果目標試管為空，可以移動
  if (targetTube.length === 0) return true;
  
  // 目標試管頂部的球 (也是第一個元素)
  const targetTopBall = targetTube[0];
  
  // 顏色必須匹配
  return topBall === targetTopBall;
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
