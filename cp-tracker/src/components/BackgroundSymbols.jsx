import React from 'react';
import './BackgroundSymbols.css';
const symbols = ['{', '}', '<', '>', '∑', 'λ', 'π', '=', '&&', '||', '!', 'function', 'return'];

const getRandomPosition = () => ({
  top: `${Math.random() * 100}%`,
  left: `${Math.random() * 100}%`,
  animationDuration: `${6 + Math.random() * 4}s`,
  fontSize: `${12 + Math.random() * 24}px`,
  color: `hsl(${Math.random() * 360}, 70%, 70%)`, // gradient feel
  opacity: 0.4 + Math.random() * 0.3,
});

const BackgroundSymbols = () => {
  return (
    
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {symbols.map((symbol, index) => {
        const style = getRandomPosition();
        return (
          <span
            key={index}
            style={style}
            className="absolute animate-float text-white blur-[1px]"
          >
            {symbol}
          </span>
        );
      })}
    </div>
  );
};

export default BackgroundSymbols;
