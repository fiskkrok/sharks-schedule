import React, { useState, useEffect } from 'react';

const PlayerStats = ({ game }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`/api/v1/players/8478408/stats?gameId=${game.id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setStats(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching stats:', err);
        setError('Failed to load stats. Please try again later.');
        setLoading(false);
      }
    };

    fetchStats();
  }, [game.id]);

  if (loading) {
    return <div>Loading stats...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!game.hasStarted) {
    return <div>The game has not yet started.</div>;
  }

  return (
    <div>
      <h2>Timothy Liljegren's Stats for the Game</h2>
      <ul>
        <li>Goals: {stats.goals}</li>
        <li>Assists: {stats.assists}</li>
        <li>Points: {stats.points}</li>
        <li>Plus/Minus: {stats.plusMinus}</li>
        <li>Shots: {stats.shots}</li>
        <li>Hits: {stats.hits}</li>
        <li>Blocked Shots: {stats.blockedShots}</li>
      </ul>
    </div>
  );
};

export default PlayerStats;
