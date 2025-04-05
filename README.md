# 試管倒球遊戲 (Ball Sort Puzzle)

一個使用 React 開發的試管倒球益智遊戲。玩家需要通過移動試管中的彩色球，將所有同顏色的球歸類到同一試管中。

## 在線演示

[試管倒球遊戲](https://yanchen184.github.io/ball-sort-puzzle)

## 功能特點

* 四種不同難度級別：簡單、中等、困難和專家
* 自動保存遊戲進度，可隨時繼續未完成的遊戲
* 移動撤銷功能，可回退錯誤的步驟
* 提示系統，在遇到難題時提供幫助
* 遊戲計時器，記錄解題時間
* 移動步數計數和記錄
* 精美的視覺效果和動畫
* 遊戲音效，增強遊戲體驗
* 響應式設計，適用於不同尺寸的設備

## 遊戲規則

* 點擊一根試管選擇它，再點擊另一根試管將球移動過去
* 只能移動試管最上方的球
* 球只能移動到空試管或頂部有相同顏色球的試管
* 獲勝條件：每根試管中裝的要麼是同種顏色的球，要麼是空的

## 技術堆棧

* React.js - 前端框架
* TailwindCSS - 樣式和UI
* LocalStorage - 本地數據存儲
* HTML5 Audio API - 音效播放

## 本地開發

要在本地運行此項目，請按照以下步驟操作：

1. 克隆倉庫
   ```
   git clone https://github.com/yanchen184/ball-sort-puzzle.git
   ```

2. 安裝依賴
   ```
   cd ball-sort-puzzle
   npm install
   ```

3. 啟動開發服務器
   ```
   npm start
   ```

4. 構建生產版本
   ```
   npm run build
   ```

5. 部署到 GitHub Pages
   ```
   npm run deploy
   ```

## 許可證

MIT License
