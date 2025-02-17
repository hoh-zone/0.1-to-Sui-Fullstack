"use client";

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function DataDashboard() {
  const [volume, setVolume] = useState("42,690,371");
  const [projects, setProjects] = useState(1337);

  useEffect(() => {
    const interval = setInterval(() => {
      setVolume((prev) => {
        const num = parseInt(prev.replace(/,/g, ''));
        return (num + Math.floor(Math.random() * 1000)).toLocaleString();
      });
      setProjects((prev) => prev + Math.floor(Math.random() * 3));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full py-16 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div 
          className="cyber-panel p-6 bg-[#2d3748] rounded-lg border border-[#6b46c1] relative overflow-hidden"
          whileHover={{ scale: 1.02 }}
        >
          <div className="relative z-10">
            <h3 className="text-[#00ffff] text-xl mb-2">24H Volume</h3>
            <p className="text-4xl font-segment7 rgb-text pulse-glow">
              ${volume}▲
            </p>
          </div>
          <div className="scanlines"></div>
        </motion.div>

        <motion.div 
          className="cyber-panel p-6 bg-[#2d3748] rounded-lg border border-[#6b46c1] relative overflow-hidden"
          whileHover={{ scale: 1.02 }}
        >
          <div className="relative z-10">
            <h3 className="text-[#00ffff] text-xl mb-2">Live Projects</h3>
            <p className="text-4xl font-segment7 rgb-text pulse-glow">
              {projects}
            </p>
          </div>
          <div className="scanlines"></div>
        </motion.div>
      </div>
    </div>
  );
}