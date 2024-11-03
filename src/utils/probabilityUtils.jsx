// probabilityUtils.js

const WEIGHTS = {
  SEASON_RECORD: 0.3,
  HEAD_TO_HEAD: 0.25,
  RECENT_FORM: 0.25,
  GOAL_DIFFERENTIAL: 0.2,
};

const calculateRecentForm = (games, teamAbbrev) => {
  if (!games || games.length === 0) return { probability: 0.5, trend: 0 };

  const lastGames = games
    .filter(
      (game) =>
        game.homeTeam.abbrev === teamAbbrev ||
        game.awayTeam.abbrev === teamAbbrev
    )
    .slice(-10);

  if (lastGames.length === 0) return { probability: 0.5, trend: 0 };

  let wins = 0;
  let last5Wins = 0;
  let previous5Wins = 0;

  lastGames.forEach((game, index) => {
    const isHome = game.homeTeam.abbrev === teamAbbrev;
    const teamScore = isHome ? game.homeTeam.score : game.awayTeam.score;
    const opponentScore = isHome ? game.awayTeam.score : game.homeTeam.score;
    if (teamScore > opponentScore) {
      wins++;
      if (index >= 5) {
        last5Wins++;
      } else {
        previous5Wins++;
      }
    }
  });

  const trend = (last5Wins / 5 - previous5Wins / 5) * 100;
  return {
    probability: wins / lastGames.length,
    trend,
  };
};

const calculateHeadToHead = (games, teamAbbrev, opposingTeamAbbrev) => {
  if (!games || games.length === 0) return { probability: 0.5, trend: 0 };

  const matchups = games.filter(
    (game) =>
      (game.homeTeam.abbrev === teamAbbrev &&
        game.awayTeam.abbrev === opposingTeamAbbrev) ||
      (game.awayTeam.abbrev === teamAbbrev &&
        game.homeTeam.abbrev === opposingTeamAbbrev)
  );

  if (matchups.length === 0) return { probability: 0.5, trend: 0 };

  let wins = 0;
  let recentWin = false;

  matchups.forEach((game, index) => {
    const isHome = game.homeTeam.abbrev === teamAbbrev;
    const teamScore = isHome ? game.homeTeam.score : game.awayTeam.score;
    const opponentScore = isHome ? game.awayTeam.score : game.homeTeam.score;
    if (teamScore > opponentScore) {
      wins++;
      if (index === matchups.length - 1) recentWin = true;
    }
  });

  const trend = recentWin ? 10 : -10; // Simple trend based on most recent matchup
  return {
    probability: wins / matchups.length,
    trend,
  };
};

const calculateGoalDifferential = (games, teamAbbrev) => {
  if (!games || games.length === 0) return { probability: 0.5, trend: 0 };

  let totalGames = 0;
  let goalDiff = 0;
  let recentGoalDiff = 0;
  let previousGoalDiff = 0;

  const relevantGames = games
    .filter(
      (game) =>
        game.homeTeam.abbrev === teamAbbrev ||
        game.awayTeam.abbrev === teamAbbrev
    )
    .slice(-10);

  relevantGames.forEach((game, index) => {
    const isHome = game.homeTeam.abbrev === teamAbbrev;
    const teamScore = isHome ? game.homeTeam.score : game.awayTeam.score;
    const opponentScore = isHome ? game.awayTeam.score : game.homeTeam.score;

    if (typeof teamScore === 'number' && typeof opponentScore === 'number') {
      const diff = teamScore - opponentScore;
      goalDiff += diff;

      if (index >= 5) {
        recentGoalDiff += diff;
      } else {
        previousGoalDiff += diff;
      }

      totalGames++;
    }
  });

  if (totalGames === 0) return { probability: 0.5, trend: 0 };

  const avgGoalDiff = goalDiff / totalGames;
  const trend = recentGoalDiff - previousGoalDiff;

  return {
    probability: 1 / (1 + Math.exp(-avgGoalDiff)),
    trend,
  };
};

export const calculateAdvancedWinProbability = (game, allGames, isHome) => {
  const team = isHome ? game.homeTeam : game.awayTeam;
  const opponent = isHome ? game.awayTeam : game.homeTeam;

  // Base season record probability
  const seasonRecordProb = team.pointPct || 0.5;

  // Calculate all components with trends
  const headToHead = calculateHeadToHead(
    allGames,
    team.abbrev,
    opponent.abbrev
  );
  const recentForm = calculateRecentForm(allGames, team.abbrev);
  const goalDiff = calculateGoalDifferential(allGames, team.abbrev);

  // Calculate weighted probability
  const weightedProb =
    seasonRecordProb * WEIGHTS.SEASON_RECORD +
    headToHead.probability * WEIGHTS.HEAD_TO_HEAD +
    recentForm.probability * WEIGHTS.RECENT_FORM +
    goalDiff.probability * WEIGHTS.GOAL_DIFFERENTIAL;

  // Calculate overall trend
  const overallTrend =
    (headToHead.trend * WEIGHTS.HEAD_TO_HEAD +
      recentForm.trend * WEIGHTS.RECENT_FORM +
      goalDiff.trend * WEIGHTS.GOAL_DIFFERENTIAL) /
    (WEIGHTS.HEAD_TO_HEAD + WEIGHTS.RECENT_FORM + WEIGHTS.GOAL_DIFFERENTIAL);

  // Add home ice advantage
  const homeIceAdjustment = isHome ? 0.05 : -0.05;
  const finalProb = Math.max(0, Math.min(1, weightedProb + homeIceAdjustment));

  return {
    probability: finalProb,
    trend: overallTrend,
  };
};

export const getWinProbabilityDetails = (game, allGames, isHome) => {
  const team = isHome ? game.homeTeam : game.awayTeam;
  const opponent = isHome ? game.awayTeam : game.homeTeam;

  const seasonRecordProb = team.pointPct || 0.5;
  const headToHead = calculateHeadToHead(
    allGames,
    team.abbrev,
    opponent.abbrev
  );
  const recentForm = calculateRecentForm(allGames, team.abbrev);
  const goalDiff = calculateGoalDifferential(allGames, team.abbrev);

  return {
    seasonRecord: {
      probability: seasonRecordProb,
      weight: WEIGHTS.SEASON_RECORD,
      label: 'Season Record',
      trend: 0, // Season record doesn't have a trend
    },
    headToHead: {
      probability: headToHead.probability,
      weight: WEIGHTS.HEAD_TO_HEAD,
      label: 'Head-to-Head',
      trend: headToHead.trend,
    },
    recentForm: {
      probability: recentForm.probability,
      weight: WEIGHTS.RECENT_FORM,
      label: 'Recent Form',
      trend: recentForm.trend,
    },
    goalDifferential: {
      probability: goalDiff.probability,
      weight: WEIGHTS.GOAL_DIFFERENTIAL,
      label: 'Goal Differential',
      trend: goalDiff.trend,
    },
  };
};
