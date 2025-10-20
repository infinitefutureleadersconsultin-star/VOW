/**
 * Emotion utility functions
 * Handles emotion tagging, tracking, and aggregation
 */

/**
 * Predefined emotion categories aligned with VOW theory
 */
export const EMOTIONS = {
  // Pacification Stage - Accepting emotions
  peaceful: { label: 'Peaceful', color: '#90EE90', stage: 'pacification' },
  calm: { label: 'Calm', color: '#87CEEB', stage: 'pacification' },
  accepting: { label: 'Accepting', color: '#DDA0DD', stage: 'pacification' },
  neutral: { label: 'Neutral', color: '#D3D3D3', stage: 'pacification' },
  
  // Confrontation Stage - Processing emotions
  anxious: { label: 'Anxious', color: '#FFB6C1', stage: 'confrontation' },
  frustrated: { label: 'Frustrated', color: '#FF6347', stage: 'confrontation' },
  angry: { label: 'Angry', color: '#DC143C', stage: 'confrontation' },
  sad: { label: 'Sad', color: '#4682B4', stage: 'confrontation' },
  fearful: { label: 'Fearful', color: '#9370DB', stage: 'confrontation' },
  triggered: { label: 'Triggered', color: '#FF4500', stage: 'confrontation' },
  
  // Integration Stage - Healing emotions
  hopeful: { label: 'Hopeful', color: '#FFD700', stage: 'integration' },
  grateful: { label: 'Grateful', color: '#FF69B4', stage: 'integration' },
  proud: { label: 'Proud', color: '#8B4513', stage: 'integration' },
  joyful: { label: 'Joyful', color: '#FFA500', stage: 'integration' },
  empowered: { label: 'Empowered', color: '#C6A664', stage: 'integration' },
};

/**
 * Get emotion by key
 */
export function getEmotion(emotionKey) {
  return EMOTIONS[emotionKey] || null;
}

/**
 * Get emotions by stage
 */
export function getEmotionsByStage(stage) {
  return Object.entries(EMOTIONS)
    .filter(([_, emotion]) => emotion.stage === stage)
    .map(([key, emotion]) => ({ key, ...emotion }));
}

/**
 * Get all emotions as array
 */
export function getAllEmotions() {
  return Object.entries(EMOTIONS).map(([key, emotion]) => ({
    key,
    ...emotion
  }));
}

/**
 * Tag emotion to entry
 */
export function tagEmotion(entry, emotionKey) {
  return {
    ...entry,
    emotion: emotionKey,
    emotionTimestamp: new Date().toISOString()
  };
}

/**
 * Aggregate emotions from entries
 */
export function aggregateEmotions(entries) {
  if (!entries || entries.length === 0) {
    return { total: 0, breakdown: {} };
  }

  const breakdown = entries.reduce((acc, entry) => {
    if (entry.emotion) {
      acc[entry.emotion] = (acc[entry.emotion] || 0) + 1;
    }
    return acc;
  }, {});

  return {
    total: entries.length,
    breakdown,
    mostCommon: Object.keys(breakdown).sort((a, b) => breakdown[b] - breakdown[a])[0] || null
  };
}

/**
 * Get emotion trend (improving/declining)
 */
export function getEmotionTrend(entries, days = 7) {
  if (!entries || entries.length < 2) return 'stable';

  const recent = entries.slice(0, Math.ceil(entries.length / 2));
  const older = entries.slice(Math.ceil(entries.length / 2));

  const recentPositive = recent.filter(e => 
    ['hopeful', 'grateful', 'proud', 'joyful', 'empowered', 'peaceful', 'calm'].includes(e.emotion)
  ).length / recent.length;

  const olderPositive = older.filter(e => 
    ['hopeful', 'grateful', 'proud', 'joyful', 'empowered', 'peaceful', 'calm'].includes(e.emotion)
  ).length / older.length;

  if (recentPositive > olderPositive + 0.1) return 'improving';
  if (recentPositive < olderPositive - 0.1) return 'declining';
  return 'stable';
}

/**
 * Get dominant emotion stage
 */
export function getDominantStage(entries) {
  if (!entries || entries.length === 0) return null;

  const stageCounts = entries.reduce((acc, entry) => {
    if (entry.emotion) {
      const emotion = EMOTIONS[entry.emotion];
      if (emotion) {
        acc[emotion.stage] = (acc[emotion.stage] || 0) + 1;
      }
    }
    return acc;
  }, {});

  const dominant = Object.keys(stageCounts).sort((a, b) => 
    stageCounts[b] - stageCounts[a]
  )[0];

  return dominant || null;
}

/**
 * Get emotion insights
 */
export function getEmotionInsights(entries) {
  const aggregated = aggregateEmotions(entries);
  const trend = getEmotionTrend(entries);
  const dominantStage = getDominantStage(entries);

  let insight = '';

  if (dominantStage === 'pacification') {
    insight = 'You\'re in a peaceful, accepting state. Keep observing without judgment.';
  } else if (dominantStage === 'confrontation') {
    insight = 'You\'re processing difficult emotions. This is part of healing - stay aware.';
  } else if (dominantStage === 'integration') {
    insight = 'You\'re integrating your experiences. You\'re growing and becoming whole.';
  }

  return {
    trend,
    dominantStage,
    insight,
    ...aggregated
  };
}

/**
 * Format emotion for display
 */
export function formatEmotion(emotionKey) {
  const emotion = EMOTIONS[emotionKey];
  if (!emotion) return { label: 'Unknown', color: '#999' };
  return emotion;
}

/**
 * Get emotion color
 */
export function getEmotionColor(emotionKey) {
  const emotion = EMOTIONS[emotionKey];
  return emotion?.color || '#999';
}

/**
 * Check if emotion is positive
 */
export function isPositiveEmotion(emotionKey) {
  const positive = ['hopeful', 'grateful', 'proud', 'joyful', 'empowered', 'peaceful', 'calm', 'accepting'];
  return positive.includes(emotionKey);
}

/**
 * Get emotion recommendations
 */
export function getEmotionRecommendation(emotionKey) {
  const recommendations = {
    anxious: 'Try deep breathing. Remember your vow - you are observing, not fighting.',
    frustrated: 'This is awareness, not failure. What triggered this feeling?',
    angry: 'Acknowledge the anger. What is it teaching you about your boundary?',
    sad: 'Sadness is part of remembering. Allow yourself to feel without judgment.',
    triggered: 'This is a moment of awareness. Log what triggered you.',
    peaceful: 'You\'re aligned with your vow. Notice what created this peace.',
    empowered: 'You\'re integrating your identity. Celebrate this moment.',
    grateful: 'Gratitude strengthens remembrance. What are you grateful for today?',
  };

  return recommendations[emotionKey] || 'Observe this feeling without judgment.';
}
