import React from 'react';
import './Tube.css';

const Tube = ({ balls, isSelected, onClick }) => {
  // 試管的容量，在這裡設置為固定值
  const capacity = 4;
  
  // 計算試管中的空位數量
  const emptySpaces = capacity - balls.length;
  
  return (
    <div 
      className={`tube ${isSelected ? 'selected' : ''}`} 
      onClick={onClick}
    >
      <div className="tube-content">
        {/* 空位部分 */}
        {Array.from({ length: emptySpaces }).map((_, index) => (
          <div key={`empty-${index}`} className="empty-space"></div>
        ))}
        
        {/* 球的部分 */}
        {balls.map((color, index) => (
          <div 
            key={`ball-${index}`} 
            className="ball" 
            style={{ backgroundColor: color }}
          ></div>
        ))}
      </div>
      
      {/* 試管底部 */}
      <div className="tube-bottom"></div>
    </div>
  );
};

export default Tube;
