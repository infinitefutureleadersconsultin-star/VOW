/**
 * Reflection Utilities
 * Client-side helper functions for reflection management
 */

// Validate reflection data
export const validateReflection = (reflection) => {
  const errors = [];

  if (!reflection.vowAlignment || reflection.vowAlignment.trim().length < 10) {
    errors.push('Vow alignment must be at least 10 characters');
  }

  if (!reflection.emotionalState) {
    errors.push('Emotional state is required');
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

// Get reflection prompt based on principle
export const getReflectionPrompt = (principle) => {
  const prompts = {
    'pacification': {
      title: 'Pacification: Accept Without Combat',
      questions: [
        'What urges or patterns did you observe today?',
        'How did you respond with acceptance rather than resistance?',
        'What emotions arose, and how did you name them?'
      ],
      guidance: 'Remember: Healing begins with peaceful observation, not battle.'
    },
    'confrontation': {
      title: 'Confrontation: Trace the Root',
      questions: [
        'What triggered this pattern or behavior?',
        'When did this pattern first begin in your life?',
        'What were you trying to protect yourself from?'
      ],
      guidance: 'Awareness before avoidance. Face the origin with compassion.'
    },
    'integration': {
      title: 'Integration: Becoming Whole',
      questions: [
        'How did you honor your vow today?',
        'What parts of your "before" and "becoming" self merged today?',
        'What progress did you notice in embodying your vow?'
      ],
      guidance: 'Integration happens naturally through remembrance and awareness.'
    }
  };

  return prompts[principle] || prompts['integration'];
};

// Calculate reflection streak
export const calculateReflectionStreak = (reflections) => {
  if (!reflections || !Array.isArray(reflections) || reflections.length === 0) {
    return 0;
  }

  // Sort by date descending
  const sorted = [...reflections].sort((a, b) => 
    new Date(b.date) - new Date(a.date)
  );

  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  for (const reflection of sorted) {
    const reflectionDate = new Date(reflection.date);
    reflectionDate.setHours(0, 0, 0, 0);

    const daysDiff = Math.floor((currentDate - reflectionDate) / (1000 * 60 * 60 * 24));

    if (daysDiff === streak) {
      streak++;
    } else if (daysDiff > streak) {
      break;
    }
  }

  return streak;
};

// Get reflection frequency (reflections per week)
export const getReflectionFrequency = (reflections, weeks = 4) => {
  if (!reflections || !Array.isArray(reflections)) return 0;

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - (weeks * 7));

  const recentReflections = reflections.filter(r => 
    new Date(r.timestamp) >= cutoffDate
  );

  return (recentReflections.length / weeks).toFixed(1);
};

// Analyze reflection sentiment
export const analyzeReflectionSentiment = (reflection) => {
  if (!reflection || !reflection.emotionalState) {
    return { sentiment: 'neutral', score: 50 };
  }

  const positiveEmotions = ['peaceful', 'strong', 'grateful', 'hopeful', 'confident', 'proud'];
  const negativeEmotions = ['challenged', 'uncertain', 'overwhelmed', 'frustrated', 'anxious', 'sad'];

  const emotion = reflection.emotionalState.toLowerCase();

  if (positiveEmotions.includes(emotion)) {
    return { sentiment: 'positive', score: 75 };
  }

  if (negativeEmotions.includes(emotion)) {
    return { sentiment: 'negative', score: 25 };
  }

  return { sentiment: 'neutral', score: 50 };
};

// Get reflection insights
export const getReflectionInsights = (reflections) => {
  if (!reflections || !Array.isArray(reflections) || reflections.length === 0) {
    return {
      total: 0,
      streak: 0,
      frequency: 0,
      avgSentiment: 50,
      mostCommonEmotion: null,
      growthIndicators: []
    };
  }

  const total = reflections.length;
  const streak = calculateReflectionStreak(reflections);
  const frequency = getReflectionFrequency(reflections);

  // Calculate average sentiment
  const sentiments = reflections.map(r => analyzeReflectionSentiment(r).score);
  const avgSentiment = sentiments.reduce((a, b) => a + b, 0) / sentiments.length;

  // Find most common emotion
  const emotionCounts = reflections.reduce((acc, r) => {
    const emotion = r.emotionalState;
    acc[emotion] = (acc[emotion] || 0) + 1;
    return acc;
  }, {});

  const mostCommonEmotion = Object.entries(emotionCounts)
    .sort((a, b) => b[1] - a[1])[0]?.[0] || null;

  // Detect growth indicators
  const growthIndicators = [];
  
  if (streak >= 7) {
    growthIndicators.push('Consistent reflection practice');
  }
  
  if (frequency >= 5) {
    growthIndicators.push('High reflection frequency');
  }
  
  if (avgSentiment > 60) {
    growthIndicators.push('Positive emotional trajectory');
  }

  return {
    total,
    streak,
    frequency: parseFloat(frequency),
    avgSentiment: Math.round(avgSentiment),
    mostCommonEmotion,
    growthIndicators
  };
};

// Format reflection for display
export const formatReflection = (reflection) => {
  if (!reflection) return null;

  return {
    id: reflection.id,
    date: reflection.date,
    vowAlignment: reflection.vowAlignment,
    emotionalState: reflection.emotionalState,
    challenges: reflection.challenges || '',
    insights: reflection.insights || '',
    gratitude: reflection.gratitude || '',
    tomorrowCommitment: reflection.tomorrowCommitment || '',
    sentiment: analyzeReflectionSentiment(reflection),
    timestamp: reflection.timestamp
  };
};

// Get reflection summary
export const getReflectionSummary = (reflection) => {
  if (!reflection) return 'No reflection data';

  const sentiment = analyzeReflectionSentiment(reflection);
  const wordCount = (reflection.vowAlignment || '').split(' ').length;

  return {
    date: reflection.date,
    emotion: reflection.emotionalState,
    sentiment: sentiment.sentiment,
    sentimentScore: sentiment.score,
    wordCount,
    hasChallenges: !!reflection.challenges,
    hasInsights: !!reflection.insights,
    hasGratitude: !!reflection.gratitude,
    hasTomorrowPlan: !!reflection.tomorrowCommitment
  };
};

// Check if reflection is complete
export const isReflectionComplete = (reflection) => {
  if (!reflection) return false;

  return !!(
    reflection.vowAlignment &&
    reflection.emotionalState &&
    reflection.vowAlignment.trim().length >= 10
  );
};

// Get reflection completeness percentage
export const getReflectionCompleteness = (reflection) => {
  if (!reflection) return 0;

  const fields = [
    reflection.vowAlignment,
    reflection.emotionalState,
    reflection.challenges,
    reflection.insights,
    reflection.gratitude,
    reflection.tomorrowCommitment
  ];

  const completed = fields.filter(f => f && f.trim().length > 0).length;
  return Math.round((completed / fields.length) * 100);
};

// Sort reflections by date
export const sortReflectionsByDate = (reflections, order = 'desc') => {
  if (!reflections || !Array.isArray(reflections)) return [];

  return [...reflections].sort((a, b) => {
    const dateA = new Date(a.timestamp || a.date);
    const dateB = new Date(b.timestamp || b.date);

    return order === 'desc' ? dateB - dateA : dateA - dateB;
  });
};

// Filter reflections by date range
export const filterReflectionsByDateRange = (reflections, startDate, endDate) => {
  if (!reflections || !Array.isArray(reflections)) return [];

  const start = new Date(startDate);
  const end = new Date(endDate);

  return reflections.filter(r => {
    const reflectionDate = new Date(r.date || r.timestamp);
    return reflectionDate >= start && reflectionDate <= end;
  });
};

// Get reflection trends (last 30 days)
export const getReflectionTrends = (reflections) => {
  if (!reflections || !Array.isArray(reflections)) {
    return { trend: 'stable', change: 0, message: 'No data available' };
  }

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const recent = reflections.filter(r => 
    new Date(r.timestamp) >= thirtyDaysAgo
  );

  if (recent.length < 2) {
    return { trend: 'insufficient', change: 0, message: 'Need more reflections to show trend' };
  }

  // Split into two halves
  const midpoint = Math.floor(recent.length / 2);
  const firstHalf = recent.slice(0, midpoint);
  const secondHalf = recent.slice(midpoint);

  // Calculate average sentiment for each half
  const firstAvg = firstHalf.reduce((sum, r) => 
    sum + analyzeReflectionSentiment(r).score, 0
  ) / firstHalf.length;

  const secondAvg = secondHalf.reduce((sum, r) => 
    sum + analyzeReflectionSentiment(r).score, 0
  ) / secondHalf.length;

  const change = secondAvg - firstAvg;

  let trend = 'stable';
  let message = 'Your emotional state is steady';

  if (change > 10) {
    trend = 'improving';
    message = 'Your emotional state is improving! 📈';
  } else if (change < -10) {
    trend = 'declining';
    message = 'Consider reaching out for support';
  }

  return { trend, change: Math.round(change), message };
};

// Export all functions
export default {
  validateReflection,
  getReflectionPrompt,
  calculateReflectionStreak,
  getReflectionFrequency,
  analyzeReflectionSentiment,
  getReflectionInsights,
  formatReflection,
  getReflectionSummary,
  isReflectionComplete,
  getReflectionCompleteness,
  sortReflectionsByDate,
  filterReflectionsByDateRange,
  getReflectionTrends
};
