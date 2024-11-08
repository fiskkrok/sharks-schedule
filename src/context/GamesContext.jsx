import React, { createContext, useContext, useState, useEffect } from 'react';

const GamesContext = createContext([]);

<<<<<<< HEAD
const API_PROXY = 'https://nhl-api-proxy.symc6ztyp5.workers.dev/api';
=======
const API_PROXY = 'https://nhl-api-proxy.symc6ztyp5.workers.dev';
>>>>>>> 6d213234124b0ccee05a732b64d02238eac8de57
const INITIAL_BATCH_SIZE = 3;
const ADDITIONAL_BATCH_SIZE = 3;

export const GamesProvider = ({ children }) => {
  const [allGames, setAllGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [currentOpponentIndex, setCurrentOpponentIndex] = useState(0);
  const [opponents, setOpponents] = useState([]);

  // Load initial Sharks games
  useEffect(() => {
    const fetchInitialGames = async () => {
      try {
        setLoading(true);
        const currentDate = new Date();
        const year =
          currentDate.getMonth() < 7
            ? currentDate.getFullYear() - 1
            : currentDate.getFullYear();
        const season = `${year}${year + 1}`;

        console.log('Fetching initial Sharks games...');
        const url = `${API_PROXY}/club-schedule-season/SJS/${season}`;

        const sharksResponse = await fetch(url);
        if (!sharksResponse.ok) {
          throw new Error(`HTTP error! status: ${sharksResponse.status}`);
        }

        const sharksData = await sharksResponse.json();
        if (!sharksData?.games) {
          throw new Error('No games data in response');
        }

        // Set initial games
        setAllGames(sharksData.games);

        // Collect unique opponents
        const opponentCodes = new Set();
        sharksData.games.forEach((game) => {
          if (game.homeTeam.abbrev !== 'SJS')
            opponentCodes.add(game.homeTeam.abbrev);
          if (game.awayTeam.abbrev !== 'SJS')
            opponentCodes.add(game.awayTeam.abbrev);
        });

        setOpponents(Array.from(opponentCodes));
        setCurrentOpponentIndex(0);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching initial games:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchInitialGames();
  }, []);

  // Function to load more games
  const loadMoreGames = async () => {
    if (loadingMore || !hasMore) return;

    try {
      setLoadingMore(true);
      const currentDate = new Date();
      const year =
        currentDate.getMonth() < 7
          ? currentDate.getFullYear() - 1
          : currentDate.getFullYear();
      const season = `${year}${year + 1}`;

      const batchOpponents = opponents.slice(
        currentOpponentIndex,
        currentOpponentIndex + ADDITIONAL_BATCH_SIZE
      );

      if (batchOpponents.length === 0) {
        setHasMore(false);
        setLoadingMore(false);
        return;
      }

      const batchPromises = batchOpponents.map((teamCode) => {
        const url = `${API_PROXY}/club-schedule-season/${teamCode}/${season}`;
        return fetch(url)
          .then((response) => (response.ok ? response.json() : null))
          .catch((error) => {
            console.warn(`Failed to fetch schedule for ${teamCode}:`, error);
            return null;
          });
      });

      const batchResults = await Promise.all(batchPromises);

      setAllGames((prevGames) => {
        const newGames = batchResults
          .filter(Boolean)
          .flatMap((schedule) => schedule?.games || []);

        const combinedGames = [...prevGames, ...newGames];
        return Array.from(
          new Map(combinedGames.map((game) => [game.id, game])).values()
        );
      });

      setCurrentOpponentIndex((prev) => prev + ADDITIONAL_BATCH_SIZE);
      setHasMore(
        currentOpponentIndex + ADDITIONAL_BATCH_SIZE < opponents.length
      );
      setLoadingMore(false);
    } catch (error) {
      console.error('Error loading more games:', error);
      setLoadingMore(false);
    }
  };

  const value = {
    allGames,
    loading,
    loadingMore,
    error,
    hasMore,
    loadMoreGames,
  };

  return (
    <GamesContext.Provider value={value}>{children}</GamesContext.Provider>
  );
};

export const useGames = () => {
  const context = useContext(GamesContext);
  if (context === undefined) {
    throw new Error('useGames must be used within a GamesProvider');
  }
  return context;
};
