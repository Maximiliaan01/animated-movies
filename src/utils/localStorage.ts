// LocalStorage için yardımcı fonksiyonlar
const WATCHED_MOVIES_KEY = 'watched_movies';

// LocalStorage'den izlenen filmleri alma
export const getWatchedMovies = (): string[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const saved = localStorage.getItem(WATCHED_MOVIES_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('LocalStorage\'dan veri çekerken hata oluştu:', error);
    return [];
  }
};

// Filmi izlendi olarak işaretleme
export const toggleWatchedMovie = (movieTitle: string): boolean => {
  if (typeof window === 'undefined') return false;
  
  try {
    const watchedMovies = getWatchedMovies();
    const isAlreadyWatched = watchedMovies.includes(movieTitle);
    
    let newWatchedMovies;
    if (isAlreadyWatched) {
      // Filmler listesinden çıkar
      newWatchedMovies = watchedMovies.filter(title => title !== movieTitle);
    } else {
      // Filmler listesine ekle
      newWatchedMovies = [...watchedMovies, movieTitle];
    }
    
    localStorage.setItem(WATCHED_MOVIES_KEY, JSON.stringify(newWatchedMovies));
    return !isAlreadyWatched; // Yeni durumu döndür
  } catch (error) {
    console.error('LocalStorage\'a veri kaydederken hata oluştu:', error);
    return false;
  }
};

// Bir filmin izlenip izlenmediğini kontrol etme
export const isMovieWatched = (movieTitle: string): boolean => {
  if (typeof window === 'undefined') return false;
  
  try {
    const watchedMovies = getWatchedMovies();
    return watchedMovies.includes(movieTitle);
  } catch (error) {
    console.error('Film durumu kontrol edilirken hata oluştu:', error);
    return false;
  }
}; 