/**
 * Emotion Utilities
 * Client-side helper functions for emotion tracking and analysis
 */

// Emotion categories with metadata
export const EMOTION_CATEGORIES = {
  // Positive emotions
  peaceful: { label: 'Peaceful', emoji: '😌', valence: 'positive', intensity: 'low' },
  grateful: { label: 'Grateful', emoji: '🙏', valence: 'positive', intensity: 'medium' },
  strong: { label: 'Strong', emoji: '💪', valence: 'positive', intensity: 'high' },
  hopeful: { label: 'Hopeful', emoji: '🌟', valence: 'positive', intensity: 'medium' },
  confident: { label: 'Confident', emoji: '✨', valence: 'positive', intensity: 'high' },
  proud: { label: 'Proud', emoji: '🎉', valence: 'positive', intensity: 'high' },
  
  // Neutral/Mixed emotions
  uncertain: { label: 'Uncertain', emoji: '🤔', valence: 'neutral', intensity: 'low' },
  reflective: { label: 'Reflective', emoji: '💭', valence: 'neutral', intensity: 'low' },
  determined: { label: 'Determined', emoji: '🎯', valence: 'neutral', intensity: 'high' },
  
  // Challenging emotions
  challenged: { label: 'Challenged', emoji: '😓', valence: 'negative', intensity: 'medium' },
  overwhelmed: { label: 'Overwhelmed', emoji: '😰', valence: 'negative', intensity: 'high' },
  frustrated: { label: 'Frustrated', emoji: '😤', valence: 'negative', intensity: 'medium' },
  anxious: { label: 'Anxious', emoji: '😨', valence: 'negative', intensity: 'high' },
  sad: { label: 'Sad', emoji: '😔', valence: 'negative', intensity: 'medium' },
  angry: { label: 'Angry', emoji: '😠', valence: 'negative', intensity: 'high' }
};

// Get emotion metadata
export const getEmotionMetadata = (emotion) => {
  if (!emotion) return null;
  
  const normalized = emotion.toLowerCase().trim();
  return EMOTION_CATEGORIES[normalized] || null;
};

// Get emotion label
export const getEmotionLabel = (emotion) => {
  const metadata = getEmotionMetadata(emotion);
  return metadata ? metadata.label : emotion;
};

// Get emotion emoji
export const getEmotionEmoji = (emotion) => {
  const metadata = getEmotionMetadata(emotion);
  return metadata ? metadata.emoji : '💭';
};

// Calculate emotion valence score (-100 to 100)
export const calculateEmotionValence = (emotion) => {
  const metadata = getEmotionMetadata(emotion);
  if (!metadata) return 0;

  const valenceMap = {
    'positive': { low: 60, medium: 75, high: 90 },
    'neutral': { low: 45, medium: 50, high: 55 },
    'negative': { low: -60, medium: -75, high: -90 }
  };

  return valenceMap[metadata.valence]?.[metadata.intensity] || 0;
};

// Analyze emotion pattern over time
export const analyzeEmotionPattern = (emotions) => {
  if (!emotions || !Array.isArray(emotions) || emotions.length === 0) {
    return {
      mostCommon: null,
      leastCommon: null,
      averageValence: 0,
      trend: 'neutral',
      diversity: 0
    };
  }

  // Count emotion frequencies
  const counts = emotions.reduce((acc, emotion) => {
    const normalized = emotion.toLowerCase().trim();
    acc[normalized] = (acc[normalized] || 0) + 1;
    return acc;
  }, {});

  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const mostCommon = sorted[0]?.[0] || null;
  const leastCommon = sorted[sorted.length - 1]?.[0] || null;

  // Calculate average valence
  const valences = emotions.map(e => calculateEmotionValence(e));
  const averageValence = valences.reduce((a, b) => a + b, 0) / valences.length;

  // Determine trend (compare first half to second half)
  const midpoint = Math.floor(emotions.length / 2);
  const firstHalfValence = emotions.slice(0, midpoint)
    .reduce((sum, e) => sum + calculateEmotionValence(e), 0) / midpoint;
  const secondHalfValence = emotions.slice(midpoint)
    .reduce((sum, e) => sum + calculateEmotionValence(e), 0) / (emotions.length - midpoint);

  let trend = 'stable';
  if (secondHalfValence - firstHalfValence > 15) trend = 'improving';
  if (secondHalfValence - firstHalfValence < -15) trend = 'declining';

  // Calculate diversity (unique emotions / total)
  const diversity = Math.round((Object.keys(counts).length / emotions.length) * 100);

  return {
    mostCommon,
    leastCommon,
    averageValence: Math.round(averageValence),
    trend,
    diversity
  };
};

// Get emotion distribution
export const getEmotionDistribution = (emotions) => {
  if (!emotions || !Array.isArray(emotions)) return {};

  return emotions.reduce((acc, emotion) => {
    const normalized = emotion.toLowerCase().trim();
    acc[normalized] = (acc[normalized] || 0) + 1;
    return acc;
  }, {});
};

// Get emotion by valence category
export const groupEmotionsByValence = (emotions) => {
  if (!emotions || !Array.isArray(emotions)) {
    return { positive: [], neutral: [], negative: [] };
  }

  return emotions.reduce((acc, emotion) => {
    const metadata = getEmotionMetadata(emotion);
    if (metadata) {
      acc[metadata.valence].push(emotion);
    }
    return acc;
  }, { positive: [], neutral: [], negative: [] });
};

// Get emotional balance score (0-100)
export const calculateEmotionalBalance = (emotions) => {
  if (!emotions || !Array.isArray(emotions) || emotions.length === 0) return 50;

  const grouped = groupEmotionsByValence(emotions);
  const positiveCount = grouped.positive.length;
  const negativeCount = grouped.negative.length;
  const total = emotions.length;

  // More positive = higher score
  const ratio = (positiveCount / total) * 100;
  
  // Adjust for diversity (having some negative is healthy)
  if (ratio === 100 || ratio === 0) {
    return 50; // All one type = imbalanced
  }

  return Math.round(ratio);
};

// Get emotion insights
export const getEmotionInsights = (emotions) => {
  if (!emotions || !Array.isArray(emotions) || emotions.length === 0) {
    return {
      summary: 'No emotion data available',
      recommendation: 'Start tracking your emotions to gain insights',
      healthScore: 50
    };
  }

  const pattern = analyzeEmotionPattern(emotions);
  const balance = calculateEmotionalBalance(emotions);
  const grouped = groupEmotionsByValence(emotions);

  let summary = '';
  let recommendation = '';
  let healthScore = 50;

  // Generate summary
  if (pattern.trend === 'improving') {
    summary = 'Your emotional state is improving over time. 📈';
    healthScore += 20;
  } else if (pattern.trend === 'declining') {
    summary = 'Your emotional state shows a declining trend. Consider reaching out for support.';
    healthScore -= 20;
  } else {
    summary = 'Your emotional state is relatively stable.';
  }

  // Generate recommendation
  if (grouped.negative.length > grouped.positive.length * 2) {
    recommendation = 'You\'re experiencing more challenging emotions. Practice self-compassion and consider talking to someone.';
    healthScore -= 10;
  } else if (grouped.positive.length > grouped.negative.length * 2) {
    recommendation = 'You\'re experiencing mostly positive emotions. Keep honoring your vow!';
    healthScore += 10;
  } else {
    recommendation = 'You\'re experiencing a healthy mix of emotions. This is normal and human.';
  }

  // Adjust for diversity
  if (pattern.diversity > 60) {
    healthScore += 10;
    recommendation += ' Your emotional diversity shows self-awareness.';
  }

  healthScore = Math.max(0, Math.min(100, balance + healthScore - 50));

  return {
    summary,
    recommendation,
    healthScore: Math.round(healthScore),
    pattern,
    balance
  };
};

// Validate emotion input
export const validateEmotion = (emotion) => {
  if (!emotion || typeof emotion !== 'string') {
    return { valid: false, error: 'Emotion is required' };
  }

  const normalized = emotion.toLowerCase().trim();
  
  if (normalized.length < 2) {
    return { valid: false, error: 'Emotion name too short' };
  }

  if (normalized.length > 50) {
    return { valid: false, error: 'Emotion name too long' };
  }

  return { valid: true, value: normalized };
};

// Get emotion color
export const getEmotionColor = (emotion) => {
  const metadata = getEmotionMetadata(emotion);
  if (!metadata) return 'gray';

  const colorMap = {
    'positive': 'green',
    'neutral': 'blue',
    'negative': 'red'
  };

  return colorMap[metadata.valence] || 'gray';
};

// Get emotion color class (for Tailwind)
export const getEmotionColorClass = (emotion, type = 'bg') => {
  const color = getEmotionColor(emotion);
  
  const classMap = {
    bg: {
      green: 'bg-green-100 text-green-700',
      blue: 'bg-blue-100 text-blue-700',
      red: 'bg-red-100 text-red-700',
      gray: 'bg-gray-100 text-gray-700'
    },
    border: {
      green: 'border-green-300',
      blue: 'border-blue-300',
      red: 'border-red-300',
      gray: 'border-gray-300'
    },
    text: {
      green: 'text-green-700',
      blue: 'text-blue-700',
      red: 'text-red-700',
      gray: 'text-gray-700'
    }
  };

  return classMap[type]?.[color] || classMap[type]?.gray;
};

// Format emotion for display
export const formatEmotionDisplay = (emotion) => {
  if (!emotion) return { label: 'Unknown', emoji: '💭', color: 'gray' };

  return {
    label: getEmotionLabel(emotion),
    emoji: getEmotionEmoji(emotion),
    color: getEmotionColor(emotion),
    colorClass: getEmotionColorClass(emotion),
    valence: calculateEmotionValence(emotion)
  };
};

// Export all functions
export default {
  EMOTION_CATEGORIES,
  getEmotionMetadata,
  getEmotionLabel,
  getEmotionEmoji,
  calculateEmotionValence,
  analyzeEmotionPattern,
  getEmotionDistribution,
  groupEmotionsByValence,
  calculateEmotionalBalance,
  getEmotionInsights,
  validateEmotion,
  getEmotionColor,
  getEmotionColorClass,
  formatEmotionDisplay
};
