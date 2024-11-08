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

        console.log('Fetching Sharks schedule...');
        const url = `/api/nhl-proxy/club-schedule-season/SJS/${season}`;
        console.log('Request URL:', url);

        const sharksResponse = await fetch(url);
        console.log('Response status:', sharksResponse.status);

        if (!sharksResponse.ok) {
          const errorText = await sharksResponse.text();
          console.error('Error response:', errorText);
          throw new Error(`HTTP error! status: ${sharksResponse.status}`);
        }

        const sharksData = await sharksResponse.json();
        console.log(
          'Sharks data received:',
          sharksData?.games?.length || 0,
          'games'
        );

        if (!sharksData?.games) {
          throw new Error('No games data in response');
        }

        setAllGames(sharksData.games);

        const opponentCodes = new Set();
        sharksData.games.forEach((game) => {
          if (game.homeTeam.abbrev !== 'SJS')
            opponentCodes.add(game.homeTeam.abbrev);
          if (game.awayTeam.abbrev !== 'SJS')
            opponentCodes.add(game.awayTeam.abbrev);
        });

        console.log('Found opponents:', Array.from(opponentCodes));

        const opponentArray = Array.from(opponentCodes);
        const BATCH_SIZE = 2;

        for (let i = 0; i < opponentArray.length; i += BATCH_SIZE) {
          const batch = opponentArray.slice(i, i + BATCH_SIZE);
          const batchPromises = batch.map((teamCode) => {
            const url = `/api/nhl-proxy/club-schedule-season/${teamCode}/${season}`;
            return fetch(url)
              .then((response) => (response.ok ? response.json() : null))
              .catch((error) => {
                console.warn(
                  `Failed to fetch schedule for ${teamCode}:`,
                  error
                );
                return null;
              });
          });

          try {
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

            await new Promise((resolve) => setTimeout(resolve, 1000));
          } catch (error) {
            console.error('Batch processing error:', error);
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
