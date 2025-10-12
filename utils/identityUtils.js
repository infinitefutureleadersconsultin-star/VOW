// Identity utilities for VOW Theory - "Who I Was" vs "Who I Am Becoming"

const logError = (error, context) => {
  console.error('[IDENTITY_UTILS_ERROR]', {
    timestamp: new Date().toISOString(),
    context,
    message: error.message,
    stack: error.stack,
  });
};

// Calculate alignment score based on vow adherence
export const calculateAlignmentScore = (vowData) => {
  try {
    const {
      totalDays = 0,
      daysKept = 0,
      daysBreached = 0,
      reflectionCount = 0,
      triggerLogCount = 0,
    } = vowData;

    if (totalDays === 0) return 0;

    // Base score from adherence (0-60 points)
    const adherenceScore = (daysKept / totalDays) * 60;

    // Reflection engagement (0-20 points)
    const reflectionScore = Math.min((reflectionCount / totalDays) * 20, 20);

    // Self-awareness through trigger logging (0-20 points)
    const awarenessScore = Math.min((triggerLogCount / totalDays) * 20, 20);

    // Calculate total (0-100)
    const totalScore = adherenceScore + reflectionScore + awarenessScore;

    return Math.round(totalScore);
  } catch (error) {
    logError(error, 'CALCULATE_ALIGNMENT_SCORE');
    return 0;
  }
};

// Generate identity profile based on vow history
export const generateIdentityProfile = (userData, vowHistory) => {
  try {
    const profile = {
      beforeSelf: {
        traits: [],
        patterns: [],
        triggerPoints: [],
      },
      becomingSelf: {
        strengths: [],
        growth: [],
        alignmentScore: 0,
      },
      journey: {
        startDate: null,
        daysActive: 0,
        transformationMilestones: [],
      },
    };

    if (!vowHistory || vowHistory.length === 0) {
      return profile;
    }

    // Analyze "before self" from initial reflections
    const earlyReflections = vowHistory
      .filter(v => v.reflections && v.reflections.length > 0)
      .slice(0, 5)
      .flatMap(v => v.reflections);

    profile.beforeSelf.traits = extractTraitsFromReflections(earlyReflections, 'before');

    // Analyze trigger patterns
    const allTriggers = vowHistory
      .flatMap(v => v.triggerLogs || []);
    
    profile.beforeSelf.triggerPoints = analyzeTriggerPatterns(allTriggers);
    profile.beforeSelf.patterns = identifyBehavioralPatterns(allTriggers);

    // Analyze "becoming self" from recent data
    const recentReflections = vowHistory
      .filter(v => v.reflections && v.reflections.length > 0)
      .slice(-5)
      .flatMap(v => v.reflections);

    profile.becomingSelf.strengths = extractStrengthsFromReflections(recentReflections);
    profile.becomingSelf.growth = calculateGrowthMetrics(vowHistory);
    profile.becomingSelf.alignmentScore = calculateAlignmentScore({
      totalDays: vowHistory.reduce((sum, v) => sum + (v.totalDays || 0), 0),
      daysKept: vowHistory.reduce((sum, v) => sum + (v.daysKept || 0), 0),
      daysBreached: vowHistory.reduce((sum, v) => sum + (v.daysBreached || 0), 0),
      reflectionCount: vowHistory.reduce((sum, v) => sum + (v.reflections?.length || 0), 0),
      triggerLogCount: vowHistory.reduce((sum, v) => sum + (v.triggerLogs?.length || 0), 0),
    });

    // Journey metadata
    const sortedVows = vowHistory.sort((a, b) => 
      new Date(a.createdAt) - new Date(b.createdAt)
    );
    
    profile.journey.startDate = sortedVows[0]?.createdAt;
    profile.journey.daysActive = calculateDaysActive(sortedVows);
    profile.journey.transformationMilestones = identifyMilestones(vowHistory);

    return profile;
  } catch (error) {
    logError(error, 'GENERATE_IDENTITY_PROFILE');
    return {
      beforeSelf: { traits: [], patterns: [], triggerPoints: [] },
      becomingSelf: { strengths: [], growth: [], alignmentScore: 0 },
      journey: { startDate: null, daysActive: 0, transformationMilestones: [] },
    };
  }
};

// Extract traits from reflection text
const extractTraitsFromReflections = (reflections, phase) => {
  try {
    if (!reflections || reflections.length === 0) return [];

    // Simple keyword extraction (can be enhanced with NLP)
    const keywords = {
      before: ['struggled', 'failed', 'weak', 'tempted', 'forgot', 'gave in', 'lost'],
      becoming: ['strong', 'remembered', 'overcame', 'aware', 'mindful', 'committed'],
    };

    const relevantKeywords = keywords[phase] || keywords.before;
    const traits = [];

    reflections.forEach(reflection => {
      const text = (reflection.reflection || '').toLowerCase();
      relevantKeywords.forEach(keyword => {
        if (text.includes(keyword)) {
          traits.push(keyword);
        }
      });
    });

    // Return unique traits
    return [...new Set(traits)].slice(0, 5);
  } catch (error) {
    logError(error, 'EXTRACT_TRAITS');
    return [];
  }
};

// Analyze trigger patterns
const analyzeTriggerPatterns = (triggers) => {
  try {
    if (!triggers || triggers.length === 0) return [];

    const patterns = {
      timeOfDay: {},
      emotions: {},
      locations: {},
    };

    triggers.forEach(trigger => {
      // Time patterns
      const hour = new Date(trigger.timestamp).getHours();
      const timeSlot = getTimeSlot(hour);
      patterns.timeOfDay[timeSlot] = (patterns.timeOfDay[timeSlot] || 0) + 1;

      // Emotion patterns
      (trigger.emotions || []).forEach(emotion => {
        patterns.emotions[emotion] = (patterns.emotions[emotion] || 0) + 1;
      });

      // Location patterns
      if (trigger.location) {
        patterns.locations[trigger.location] = (patterns.locations[trigger.location] || 0) + 1;
      }
    });

    // Get top patterns
    const topPatterns = [];

    // Top time
    const topTime = Object.entries(patterns.timeOfDay)
      .sort((a, b) => b[1] - a[1])[0];
    if (topTime) {
      topPatterns.push({ type: 'time', value: topTime[0], count: topTime[1] });
    }

    // Top emotions (top 3)
    Object.entries(patterns.emotions)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .forEach(([emotion, count]) => {
        topPatterns.push({ type: 'emotion', value: emotion, count });
      });

    return topPatterns;
  } catch (error) {
    logError(error, 'ANALYZE_TRIGGER_PATTERNS');
    return [];
  }
};

// Get time slot from hour
const getTimeSlot = (hour) => {
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
};

// Identify behavioral patterns
const identifyBehavioralPatterns = (triggers) => {
  try {
    if (!triggers || triggers.length < 3) return [];

    const patterns = [];

    // Check for recurring time patterns
    const hourCounts = {};
    triggers.forEach(t => {
      const hour = new Date(t.timestamp).getHours();
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });

    const recurringHours = Object.entries(hourCounts)
      .filter(([, count]) => count >= 3)
      .map(([hour]) => hour);

    if (recurringHours.length > 0) {
      patterns.push({
        type: 'recurring_time',
        description: `Urges often occur around ${recurringHours.join(', ')}:00`,
      });
    }

    // Check for emotional escalation
    const recentTriggers = triggers.slice(-5);
    const avgIntensity = recentTriggers.reduce((sum, t) => sum + (t.urgeIntensity || 0), 0) / recentTriggers.length;
    
    if (avgIntensity > 7) {
      patterns.push({
        type: 'high_intensity',
        description: 'Recent urges have been particularly intense',
      });
    }

    return patterns;
  } catch (error) {
    logError(error, 'IDENTIFY_BEHAVIORAL_PATTERNS');
    return [];
  }
};

// Extract strengths from reflections
const extractStrengthsFromReflections = (reflections) => {
  try {
    if (!reflections || reflections.length === 0) return [];

    const strengthKeywords = [
      'overcame', 'resisted', 'strong', 'proud', 'aware', 
      'mindful', 'controlled', 'chose', 'remembered', 'honored'
    ];

    const strengths = [];

    reflections.forEach(reflection => {
      const text = (reflection.reflection || '').toLowerCase();
      strengthKeywords.forEach(keyword => {
        if (text.includes(keyword)) {
          strengths.push(keyword);
        }
      });
    });

    return [...new Set(strengths)].slice(0, 5);
  } catch (error) {
    logError(error, 'EXTRACT_STRENGTHS');
    return [];
  }
};

// Calculate growth metrics
const calculateGrowthMetrics = (vowHistory) => {
  try {
    if (!vowHistory || vowHistory.length === 0) return [];

    const metrics = [];

    // Calculate improvement in adherence over time
    const oldVows = vowHistory.slice(0, Math.ceil(vowHistory.length / 2));
    const recentVows = vowHistory.slice(Math.ceil(vowHistory.length / 2));

    const oldAdherence = oldVows.reduce((sum, v) => 
      sum + (v.daysKept || 0) / (v.totalDays || 1), 0) / oldVows.length;
    
    const recentAdherence = recentVows.reduce((sum, v) => 
      sum + (v.daysKept || 0) / (v.totalDays || 1), 0) / recentVows.length;

    const improvement = ((recentAdherence - oldAdherence) / oldAdherence) * 100;

    if (improvement > 10) {
      metrics.push({
        type: 'adherence_improvement',
        value: `${Math.round(improvement)}% improvement in vow adherence`,
      });
    }

    // Check streak improvements
    const longestStreak = Math.max(...vowHistory.map(v => v.longestStreak || 0));
    if (longestStreak > 7) {
      metrics.push({
        type: 'streak',
        value: `${longestStreak}-day streak achieved`,
      });
    }

    return metrics;
  } catch (error) {
    logError(error, 'CALCULATE_GROWTH_METRICS');
    return [];
  }
};

// Calculate days active
const calculateDaysActive = (vowHistory) => {
  try {
    if (!vowHistory || vowHistory.length === 0) return 0;

    const firstVow = new Date(vowHistory[0].createdAt);
    const now = new Date();
    const diffTime = Math.abs(now - firstVow);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  } catch (error) {
    logError(error, 'CALCULATE_DAYS_ACTIVE');
    return 0;
  }
};

// Identify transformation milestones
const identifyMilestones = (vowHistory) => {
  try {
    const milestones = [];

    // First vow
    if (vowHistory.length > 0) {
      milestones.push({
        type: 'first_vow',
        date: vowHistory[0].createdAt,
        description: 'Your journey began',
      });
    }

    // First 7-day streak
    const firstStreakVow = vowHistory.find(v => (v.longestStreak || 0) >= 7);
    if (firstStreakVow) {
      milestones.push({
        type: 'first_week',
        date: firstStreakVow.createdAt,
        description: 'First 7-day streak completed',
      });
    }

    // First 30-day streak
    const firstMonthVow = vowHistory.find(v => (v.longestStreak || 0) >= 30);
    if (firstMonthVow) {
      milestones.push({
        type: 'first_month',
        date: firstMonthVow.createdAt,
        description: 'First 30-day streak completed',
      });
    }

    return milestones;
  } catch (error) {
    logError(error, 'IDENTIFY_MILESTONES');
    return [];
  }
};

// Generate embodiment reminder based on alignment score
export const generateEmbodimentReminder = (alignmentScore) => {
  try {
    if (alignmentScore >= 90) {
      return 'You are your promise. The vow is no longer something you keep — it is who you are.';
    } else if (alignmentScore >= 70) {
      return 'You are becoming your vow. Each day of remembrance strengthens your identity.';
    } else if (alignmentScore >= 50) {
      return 'You are on the path. The journey of becoming requires patience and daily awareness.';
    } else if (alignmentScore >= 30) {
      return 'Remember: this is not about perfection, but about conscious presence. You are learning.';
    } else {
      return 'Every moment is a new beginning. The vow is not broken — your awareness is growing.';
    }
  } catch (error) {
    logError(error, 'GENERATE_EMBODIMENT_REMINDER');
    return 'Remember who you said you\'d be.';
  }
};
