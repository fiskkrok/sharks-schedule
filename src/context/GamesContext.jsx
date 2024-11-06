import React, { createContext, useContext, useState, useEffect } from 'react';

const GamesContext = createContext([]);

export const GamesProvider = ({ children }) => {
  const [allGames, setAllGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllGames = async () => {
      try {
        const currentDate = new Date();
        const year =
          currentDate.getMonth() < 7
            ? currentDate.getFullYear() - 1
            : currentDate.getFullYear();
        const season = `${year}${year + 1}`;

        // Fetch Sharks schedule
        const sharksResponse = await fetch(
          `/api/v1/club-schedule-season/SJS/${season}`,
          {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
          }
        );

        if (!sharksResponse.ok) {
          throw new Error(`HTTP error! status: ${sharksResponse.status}`);
        }

        const sharksData = await sharksResponse.json();

        // Set initial games to ensure we have Sharks games immediately
        setAllGames(sharksData.games || []);

        // Get unique opponent team codes
        const opponentCodes = new Set();
        sharksData.games.forEach((game) => {
          if (game.homeTeam.abbrev !== 'SJS')
            opponentCodes.add(game.homeTeam.abbrev);
          if (game.awayTeam.abbrev !== 'SJS')
            opponentCodes.add(game.awayTeam.abbrev);
        });

        // Fetch schedules for all opponents
        const opponentArray = Array.from(opponentCodes);
        const BATCH_SIZE = 3; // Reduced batch size to avoid rate limiting

        for (let i = 0; i < opponentArray.length; i += BATCH_SIZE) {
          const batch = opponentArray.slice(i, i + BATCH_SIZE);
          const batchPromises = batch.map((teamCode) =>
            fetch(`/api/v1/club-schedule-season/${teamCode}/${season}`, {
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
            })
              .then((response) => (response.ok ? response.json() : null))
              .catch((error) => {
                console.warn(
                  `Failed to fetch schedule for ${teamCode}:`,
                  error
                );
                return null;
              })
          );

          try {
            const batchResults = await Promise.all(batchPromises);

            setAllGames((prevGames) => {
              const newGames = batchResults
                .filter(Boolean)
                .flatMap((schedule) => schedule?.games || []);

              const combinedGames = [...prevGames, ...newGames];

              // Remove duplicates based on game ID
              return Array.from(
                new Map(combinedGames.map((game) => [game.id, game])).values()
              );
            });

            // Add a small delay between batches to avoid rate limiting
            await new Promise((resolve) => setTimeout(resolve, 1000));
          } catch (error) {
            console.warn('Error processing batch:', error);
          }
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching game data:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchAllGames();
  }, []);

  return (
    <GamesContext.Provider value={{ allGames, loading, error }}>
      {children}
    </GamesContext.Provider>
  );
};

export const useGames = () => {
  const context = useContext(GamesContext);
  if (context === undefined) {
    throw new Error('useGames must be used within a GamesProvider');
  }
  return context;
};
