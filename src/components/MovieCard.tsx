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
          ${isRanaSection ? 'border-3 border-pink-400/70' : 'border-3 border-blue-400/50'}
          ${isWatched ? 'border-3 border-green-500' : ''}
          shadow-lg hover:shadow-2xl
          bg-gray-800/80 backdrop-blur-sm
        `}
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.2 }}
      >
        <div 
          className="relative w-full h-[220px] rounded-lg overflow-hidden"
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
              <span className="text-white font-bold text-xl text-center px-2 py-1 bg-black/30 rounded">
                {title}
              </span>
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
              transition-colors duration-300
              ${isWatched ? 'bg-green-500 text-white' : 'bg-gray-200/80 text-gray-800'}
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