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
        const url = `/api/v1/club-schedule-season/SJS/${season}`;
        console.log('Request URL:', url);

        const sharksResponse = await fetch(url);
        console.log('Response status:', sharksResponse.status);

        if (!sharksResponse.ok) {
          const text = await sharksResponse.text();
          console.error('Response text:', text);
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
          console.log(`Processing batch ${i / BATCH_SIZE + 1}`);

          const batch = opponentArray.slice(i, i + BATCH_SIZE);
          const batchPromises = batch.map((teamCode) => {
            const url = `/api/v1/club-schedule-season/${teamCode}/${season}`;
            console.log('Fetching:', url);

            return fetch(url)
              .then(async (response) => {
                if (!response.ok) {
                  const text = await response.text();
                  console.error(`Error fetching ${teamCode}:`, text);
                  return null;
                }
                return response.json();
              })
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

              console.log('Adding games:', newGames.length);

              const combinedGames = [...prevGames, ...newGames];
              return Array.from(
                new Map(combinedGames.map((game) => [game.id, game])).values()
              );
            });

            // Add delay between batches
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
