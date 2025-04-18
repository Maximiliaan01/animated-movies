'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import MovieModal from './MovieModal';
import { isMovieWatched, toggleWatchedMovie } from '@/utils/localStorage';

interface MovieCardProps {
  title: string;
  imageUrl: string;
  description?: string;
  isRanaSection?: boolean;
  onWatchedStatusChange?: () => void;
}

export default function MovieCard({ 
  title, 
  imageUrl, 
  description, 
  isRanaSection,
  onWatchedStatusChange 
}: MovieCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isWatched, setIsWatched] = useState(false);
  const [imageError, setImageError] = useState(false);

  // LocalStorage'den izlendi durumunu yükle
  useEffect(() => {
    setIsWatched(isMovieWatched(title));
  }, [title]);

  const handleWatchedToggle = (e: React.MouseEvent) => {
    e.stopPropagation(); // Kart tıklamasını engelle
    const newWatchedStatus = toggleWatchedMovie(title);
    setIsWatched(newWatchedStatus);
    if (onWatchedStatusChange) {
      onWatchedStatusChange();
    }
  };
  
  // Film afişleri için düşük kaliteli kaynaklar kullanacağız
  // Hata olursa veya URL boşsa renkli placeholder göster
  const generatePlaceholder = () => {
    // Film adına göre sabit bir renk oluştur (hash benzeri)
    const charCode = title.charCodeAt(0) || 65;
    const hue = (charCode * 137) % 360; // 0-360 arası bir renk değeri
    
    return `hsla(${hue}, 70%, 50%, 1)`;
  };

  const bgColor = generatePlaceholder();
  
  // Görsel URL'si geçerli mi kontrol et
  const isValidImageUrl = imageUrl && imageUrl.startsWith('http') && !imageError;
  
  return (
    <>
      <motion.div
        className={`
          relative group cursor-pointer
          rounded-lg overflow-hidden transition-all duration-300
          ${isRanaSection ? 'border-3 border-pink-400/70 shadow-pink-500/20' : 'border-3 border-blue-400/50'}
          ${isWatched ? 'border-3 border-green-500' : ''}
          shadow-lg hover:shadow-2xl
          bg-gray-800/80 backdrop-blur-sm
        `}
        whileHover={{ scale: isRanaSection ? 1.02 : 1.05 }}
        transition={{ duration: 0.2 }}
      >
        <div 
          className={`
            relative w-full h-[220px] rounded-lg overflow-hidden
            ${isRanaSection ? 'grayscale' : ''}
          `}
          onClick={() => setIsModalOpen(true)}
        >
          {/* Görsel veya Placeholder */}
          {isValidImageUrl ? (
            <>
              <Image
                src={imageUrl}
                alt={title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                className="object-cover"
                onError={() => setImageError(true)}
                priority={false}
                quality={30} // Düşük kalite (10-40 arası) - siteyi kastırmaması için
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80 z-10" />
            </>
          ) : (
            <div 
              className="w-full h-full flex items-center justify-center p-2"
              style={{
                background: isRanaSection 
                  ? 'linear-gradient(135deg, #FF6B81, #FFB6C1)' 
                  : `linear-gradient(135deg, ${bgColor}, ${bgColor}90)`
              }}
            >
              <span className="text-white font-bold text-xl text-center px-4 py-2 bg-black/40 rounded-md backdrop-blur-sm border border-white/20 shadow-inner">
                {title}
              </span>
            </div>
          )}
          
          {/* Rana bölümü için kırık kalp efekti */}
          {isRanaSection && (
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center z-30 drop-shadow-lg">
              <div className="animate-pulse">
                <svg className="w-20 h-20 text-pink-500 mb-2 drop-shadow-md" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32c-5.15-4.67-8.55-7.75-8.55-11.53 0-3.08 2.42-5.5 5.5-5.5 1.74 0 3.41.81 4.5 2.09 1.09-1.28 2.76-2.09 4.5-2.09 0.81 0 1.59.18 2.3.51 0.13.06.29.17.45.31 0.15.14.32.3.52.5l-3.26 3.26c-.79.8-2.07.8-2.86 0l-1.42-1.42-.7.7 1.42 1.42c.57.57 1.32.85 2.07.85s1.49-.28 2.07-.85l2.15-2.15c.97 1.3 1.51 2.75 1.51 4.22 0 3.78-3.4 6.86-8.55 11.53l-1.44 1.3z"/>
                  <path d="M18.3 5.71a.996.996 0 0 0 0-1.41l-2.12-2.12a.996.996 0 1 0-1.41 1.41l2.12 2.12c.39.39 1.02.39 1.41 0z"/>
                </svg>
              </div>
              <p className="text-white font-bold text-center px-4 py-2 rounded-md bg-pink-900/70 border border-pink-700/50 shadow-inner">
                Kalbim Kırıldı 💔
              </p>
            </div>
          )}
          
          <div className="absolute bottom-0 left-0 right-0 p-3 z-20">
            <h3 className={`
              text-base font-bold text-white
              ${isRanaSection ? 'text-pink-100' : ''}
              bg-black/40 px-3 py-1 rounded-md inline-block backdrop-blur-sm
            `}>
              {title}
            </h3>
          </div>
          
          {/* İzlendi butonu */}
          <button
            onClick={handleWatchedToggle}
            className={`
              absolute top-2 right-2 z-20 p-2 rounded-full 
              transition-colors duration-300 border-2
              ${isWatched ? 'bg-green-500 text-white border-white' : 'bg-gray-200/90 text-gray-800 border-gray-400'}
              hover:scale-110 transform transition-transform
            `}
            aria-label={isWatched ? "İzlendi olarak işaretle" : "İzlendi işaretini kaldır"}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </motion.div>

      <MovieModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        movie={{ title, imageUrl, description }}
        isWatched={isWatched}
        onWatchedToggle={handleWatchedToggle}
      />
    </>
  );
} 