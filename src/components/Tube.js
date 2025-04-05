import React from 'react';
import './Tube.css';

const Tube = ({ balls, isSelected, isHinted, isSource, onClick }) => {
  // 試管的容量，在這裡設置為固定值
  const capacity = 4;
  
  // 計算試管中的空位數量
  const emptySpaces = capacity - balls.length;
  
  // 確定試管的CSS類
  const tubeClass = `tube 
    ${isSelected ? 'selected' : ''} 
    ${isHinted ? 'hinted' : ''} 
    ${isSource ? 'source' : ''}`;
  
  return (
    <div 
      className={tubeClass} 
      onClick={onClick}
    >
      <div className="tube-content">
        {/* 空位部分 - 放在上方 */}
        {Array.from({ length: emptySpaces }).map((_, index) => (
          <div key={`empty-${index}`} className="empty-space"></div>
        ))}
        
        {/* 球的部分 - 放在下方 */}
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
