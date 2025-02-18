"use client";

import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

interface Token {
  symbol: string;
  price: number;
  change: number;
}

export default function TokenCarousel() {
  const [tokens] = useState<Token[]>([
    { symbol: "SUI", price: 1.23, change: 5.6 },
    { symbol: "BTC", price: 42000, change: -2.1 },
    { symbol: "ETH", price: 2800, change: 3.4 },
    { symbol: "DOGE", price: 0.08, change: 10.5 },
    { symbol: "SHIB", price: 0.00001, change: -1.2 },
  ]);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scroll = () => {
      if (container.scrollLeft >= container.scrollWidth - container.clientWidth) {
        container.scrollLeft = 0;
      } else {
        container.scrollLeft += 1;
      }
    };

    const interval = setInterval(scroll, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full py-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl font-pixel-operator text-[#00ffff] mb-4 rgb-text">
          HOT
        </h2>
        
        <div 
          ref={containerRef}
          className="flex space-x-6 py-4 overflow-x-hidden relative"
        >
          {[...tokens, ...tokens].map((token, index) => (
            <motion.div
              key={`${token.symbol}-${index}`}
              className="flex-shrink-0 w-64 p-4 bg-blue-800 rounded-lg border border-[#6b46c1] relative"
              whileHover={{ scale: 1.05 }}
            >
              <div className="scanlines opacity-30"></div>
              <div className="relative z-10">
                <h3 className="text-2xl font-pixel-operator mb-2">{token.symbol}</h3>
                <p className="text-xl font-segment7 rgb-text">
                  ${token.price.toLocaleString()}
                </p>
                <p className={`text-sm ${token.change >= 0 ? 'ts-green' : 'ts-red'}`}>
                  {token.change >= 0 ? '▲' : '▼'} {Math.abs(token.change)}%
                </p>
                
                <div className="mt-4 flex space-x-2">
                  <button className="pixel-btn bg-[#6b46c1] text-white px-4 py-2 text-sm hover:bg-[#00ffff] transition-colors">
                    TRADE
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
