# 試管倒球遊戲 (Ball Sort Puzzle)

一個使用 React 開發的試管倒球益智遊戲。玩家需要通過移動試管中的彩色球，將所有同顏色的球歸類到同一試管中。

## 在線演示

[試管倒球遊戲](https://yanchen184.github.io/ball-sort-puzzle)

## 版本更新

- v1.11.0 - 完全重構試管佈局為嚴格的兩行，解決多管子溢出的問題
- v1.10.0 - 修正管子佈局為水平兩行排列，更加符合遊戲視覺需求
- v1.9.0 - 優化管子排列佈局為最多兩排，調整管子間距使其更密集
- v1.8.0 - 完善勝利訊息關閉按鈕樣式，優化響應式設計
- v1.7.0 - 優化佈局：限制管子最多兩排、改進獲勝動畫、調整難度選單位置
- v1.6.0 - 深色模式支持：添加黑色主題和主題切換功能
- v1.5.0 - 添加更多難度級別，新增最佳記錄功能
- v1.4.0 - 修復遊戲邏輯問題，確保最上方的球能正確移動到其他試管
- v1.3.0 - 增加不同難度級別和遊戲計時功能
- v1.2.0 - 增加遊戲存檔和提示功能
- v1.1.0 - 增加撤銷功能
- v1.0.0 - 初始版本發布

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
