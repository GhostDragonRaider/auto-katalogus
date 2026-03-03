import React, { createContext, useContext, useState, useEffect } from 'react';

const FAVORITES_KEY = 'nd_favorites';
const COMPARE_KEY = 'nd_compare';
const MAX_COMPARE = 3;

type FavoritesContextType = {
  favorites: string[];
  compare: string[];
  addFavorite: (id: string) => void;
  removeFavorite: (id: string) => void;
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  addCompare: (id: string) => void;
  removeCompare: (id: string) => void;
  isInCompare: (id: string) => boolean;
  clearCompare: () => void;
};

const FavoritesContext = createContext<FavoritesContextType | null>(null);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const s = localStorage.getItem(FAVORITES_KEY);
      return s ? JSON.parse(s) : [];
    } catch {
      return [];
    }
  });
  const [compare, setCompare] = useState<string[]>(() => {
    try {
      const s = localStorage.getItem(COMPARE_KEY);
      return s ? JSON.parse(s) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem(COMPARE_KEY, JSON.stringify(compare));
  }, [compare]);

  const addFavorite = (id: string) => {
    setFavorites((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const removeFavorite = (id: string) => {
    setFavorites((prev) => prev.filter((x) => x !== id));
    setCompare((prev) => prev.filter((x) => x !== id));
  };

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const isFavorite = (id: string) => favorites.includes(id);

  const addCompare = (id: string) => {
    setCompare((prev) => {
      if (prev.includes(id)) return prev;
      if (prev.length >= MAX_COMPARE) return prev;
      return [...prev, id];
    });
  };

  const removeCompare = (id: string) => {
    setCompare((prev) => prev.filter((x) => x !== id));
  };

  const isInCompare = (id: string) => compare.includes(id);

  const clearCompare = () => setCompare([]);

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        compare,
        addFavorite,
        removeFavorite,
        toggleFavorite,
        isFavorite,
        addCompare,
        removeCompare,
        isInCompare,
        clearCompare,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites must be used within FavoritesProvider');
  return ctx;
};
