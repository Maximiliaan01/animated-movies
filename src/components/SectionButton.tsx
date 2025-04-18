'use client';

import { motion } from 'framer-motion';

interface SectionButtonProps {
  title: string;
  onClick: () => void;
  isActive: boolean;
  color: 'orange' | 'amber' | 'purple' | 'pink';
}

// Renk şeması güncellendi - Lacivert ve Turuncu temalarına göre
const colors = {
  orange: 'from-orange-500 to-orange-600 shadow-orange-500/50 hover:shadow-orange-500/70',
  amber: 'from-amber-400 to-amber-500 shadow-amber-400/50 hover:shadow-amber-400/70',
  purple: 'from-indigo-600 to-blue-700 shadow-blue-600/50 hover:shadow-blue-600/70',
  pink: 'from-pink-400 to-pink-500 shadow-pink-400/50 hover:shadow-pink-400/70',
};

const glowAnimation = {
  animate: {
    boxShadow: [
      '0 0 15px rgba(236, 72, 153, 0.5)',
      '0 0 25px rgba(236, 72, 153, 0.3)',
      '0 0 15px rgba(236, 72, 153, 0.5)',
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

export default function SectionButton({ title, onClick, isActive, color }: SectionButtonProps) {
  const isPinkButton = color === 'pink';

  return (
    <motion.button
      onClick={onClick}
      className={`
        px-5 py-2 rounded-lg font-semibold text-white text-sm md:text-base
        bg-gradient-to-r ${colors[color]}
        transform transition-all duration-200
        shadow-lg hover:scale-105 border border-transparent
        ${isActive ? 'scale-105 shadow-xl border-white/20' : ''}
        ${isPinkButton ? 'border-pink-300/30' : ''}
      `}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.95 }}
      {...(isPinkButton && glowAnimation)}
    >
      {title}
    </motion.button>
  );
} 