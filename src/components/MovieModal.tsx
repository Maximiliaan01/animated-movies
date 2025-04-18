'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { MouseEvent, useState } from 'react';
import Image from 'next/image';

interface MovieModalProps {
  isOpen: boolean;
  onClose: () => void;
  movie: {
    title: string;
    imageUrl: string;
    description?: string;
  };
  isWatched: boolean;
  onWatchedToggle: (e: MouseEvent) => void;
}

export default function MovieModal({ 
  isOpen, 
  onClose, 
  movie, 
  isWatched, 
  onWatchedToggle 
}: MovieModalProps) {
  const [imageError, setImageError] = useState(false);

  // Film adına göre sabit bir renk oluştur
  const generateColor = () => {
    const charCode = movie.title.charCodeAt(0) || 65;
    const hue = (charCode * 137) % 360;
    return `hsla(${hue}, 70%, 50%, 1)`;
  };

  const bgColor = generateColor();
  
  // Görsel URL'si geçerli mi kontrol et
  const isValidImageUrl = movie.imageUrl && movie.imageUrl.startsWith('http') && !imageError;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Arka plan overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 z-40 backdrop-blur-sm"
          />

          {/* Modal içeriği - Sadeleştirilmiş tasarım */}
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed inset-x-0 bottom-0 z-50 bg-gradient-to-b from-blue-900 to-blue-950 rounded-t-3xl p-6 pb-8 max-h-[70vh] overflow-y-auto"
          >
            {/* Kapatma çizgisi */}
            <div className="w-12 h-1.5 bg-gray-300/20 rounded-full mx-auto mb-5" />

            <div className="space-y-5">
              {/* Film görseli - düşük kalitede ve yedek mekanizmalı */}
              {isValidImageUrl ? (
                <div className="relative w-full h-[200px] rounded-xl overflow-hidden">
                  <Image
                    src={movie.imageUrl}
                    alt={movie.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 800px"
                    className="object-cover"
                    onError={() => setImageError(true)}
                    quality={40}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 to-transparent" />
                </div>
              ) : (
                <div 
                  className="relative w-full h-[160px] rounded-xl overflow-hidden flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${bgColor}, ${bgColor}90)`
                  }}
                >
                  <span className="text-white font-bold text-2xl text-center px-4 py-2 bg-black/30 rounded">
                    {movie.title}
                  </span>
                </div>
              )}

              {/* Film başlığı ve izlendi durumu */}
              <div className="flex justify-between items-center">
                <h2 className="text-2xl md:text-3xl font-bold text-white">{movie.title}</h2>
                
                <button
                  onClick={onWatchedToggle}
                  className={`
                    p-2 rounded-full transition-colors duration-300 flex items-center
                    ${isWatched ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-300'}
                  `}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm">{isWatched ? 'İzledim' : 'İzlemedim'}</span>
                </button>
              </div>

              {/* Film açıklaması */}
              {movie.description && (
                <p className="text-gray-300 text-base">{movie.description}</p>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
} 