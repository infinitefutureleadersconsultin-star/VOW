/**
 * Reflection utility functions
 * Maps stages to prompts and principles (VOW Theory)
 */

/**
 * VOW Theory Stages
 */
export const STAGES = {
  pacification: {
    name: 'Pacification',
    title: 'Accept Without Fighting',
    description: 'The first step is accepting what exists without battling it.',
    color: '#90EE90',
    icon: '🕊️',
    principle: 'The Pacification Paradox™'
  },
  confrontation: {
    name: 'Confrontation',
    title: 'Face the Truth',
    description: 'Now you stand before the why - not to fight, but to understand.',
    color: '#C6A664',
    icon: '🔍',
    principle: 'The Confrontational Model™'
  },
  integration: {
    name: 'Integration',
    title: 'Become Whole',
    description: 'Merge who you were before with who you\'ve become through awareness.',
    color: '#5FD3A5',
    icon: '✨',
    principle: 'The Integration Cycle™'
  }
};

/**
 * Get stage prompts
 */
export function getStagePrompts(stage) {
  const prompts = {
    pacification: [
      'What behavior or pattern are you observing today?',
      'Can you accept that this existed without judging yourself?',
      'What would it feel like to sit with this without fighting it?',
      'How has avoiding this pattern kept you safe until now?'
    ],
    confrontation: [
      'When did this pattern first begin?',
      'What emotion or experience created this coping mechanism?',
      'Can you see the difference between the pattern and your true self?',
      'What was this behavior protecting you from?'
    ],
    integration: [
      'Who were you before this pattern took hold?',
      'Who have you become through this awareness?',
      'How can these two versions of you exist as one?',
      'What truth about yourself can you now remember?'
    ]
  };

  return prompts[stage] || [];
}

/**
 * Get random prompt for stage
 */
export function getRandomPrompt(stage) {
  const prompts = getStagePrompts(stage);
  return prompts[Math.floor(Math.random() * prompts.length)];
}

/**
 * Get reflection template
 */
export function getReflectionTemplate(stage) {
  const templates = {
    pacification: {
      title: 'What am I observing today?',
      placeholder: 'Today I noticed...',
      guidingQuestion: 'Can you observe this without judgment?'
    },
    confrontation: {
      title: 'What is this teaching me?',
      placeholder: 'I realize that...',
      guidingQuestion: 'What is the truth behind this pattern?'
    },
    integration: {
      title: 'Who am I becoming?',
      placeholder: 'I am remembering...',
      guidingQuestion: 'How are you integrating this awareness?'
    }
  };

  return templates[stage] || templates.pacification;
}

/**
 * Analyze reflection text for stage alignment
 */
export function analyzeReflectionStage(text) {
  const lowerText = text.toLowerCase();

  // Keywords for each stage
  const pacificationWords = ['observe', 'notice', 'accept', 'without judgment', 'sitting with', 'acknowledge'];
  const confrontationWords = ['why', 'realize', 'understand', 'because', 'trauma', 'created', 'protecting'];
  const integrationWords = ['remember', 'becoming', 'whole', 'merge', 'was before', 'who i am', 'identity'];

  const pacificationScore = pacificationWords.filter(w => lowerText.includes(w)).length;
  const confrontationScore = confrontationWords.filter(w => lowerText.includes(w)).length;
  const integrationScore = integrationWords.filter(w => lowerText.includes(w)).length;

  if (integrationScore >= confrontationScore && integrationScore >= pacificationScore) {
    return 'integration';
  }
  if (confrontationScore >= pacificationScore) {
    return 'confrontation';
  }
  return 'pacification';
}

/**
 * Get next suggested stage
 */
export function getNextStage(currentStage) {
  const sequence = ['pacification', 'confrontation', 'integration'];
  const currentIndex = sequence.indexOf(currentStage);
  
  if (currentIndex === -1 || currentIndex === sequence.length - 1) {
    return 'pacification'; // Loop back
  }
  
  return sequence[currentIndex + 1];
}

/**
 * Get stage progress
 */
export function getStageProgress(reflections) {
  if (!reflections || reflections.length === 0) {
    return { current: 'pacification', percentage: 0 };
  }

  const stages = reflections.map(r => r.stage || 'pacification');
  const latestStage = stages[0];
  
  const stageOrder = { pacification: 1, confrontation: 2, integration: 3 };
  const progress = (stageOrder[latestStage] / 3) * 100;

  return {
    current: latestStage,
    percentage: Math.round(progress),
    reflectionsCount: reflections.length
  };
}

/**
 * Get stage insights
 */
export function getStageInsights(stage, reflectionCount) {
  const insights = {
    pacification: {
      beginner: 'You\'re learning to observe without judgment. This is the foundation.',
      intermediate: 'You\'re becoming comfortable with awareness. Keep observing.',
      advanced: 'You\'ve mastered acceptance. Ready to understand the why?'
    },
    confrontation: {
      beginner: 'Facing the truth takes courage. You\'re doing important work.',
      intermediate: 'You\'re connecting patterns to their origins. This is healing.',
      advanced: 'You understand the why. Now you can integrate.'
    },
    integration: {
      beginner: 'You\'re beginning to see yourself as whole. Keep remembering.',
      intermediate: 'You\'re merging awareness with identity. This is transformation.',
      advanced: 'You\'re living as your integrated self. This is mastery.'
    }
  };

  let level = 'beginner';
  if (reflectionCount > 20) level = 'advanced';
  else if (reflectionCount > 10) level = 'intermediate';

  return insights[stage]?.[level] || 'Keep reflecting. You\'re on the path.';
}

/**
 * Validate reflection
 */
export function validateReflection(reflection) {
  const errors = [];

  if (!reflection.text || reflection.text.length < 20) {
    errors.push('Reflection should be at least 20 characters');
  }

  if (!reflection.stage) {
    errors.push('Stage is required');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Get reflection statistics
 */
export function getReflectionStats(reflections) {
  if (!reflections || reflections.length === 0) {
    return { total: 0, byStage: {} };
  }

  const byStage = reflections.reduce((acc, r) => {
    const stage = r.stage || 'pacification';
    acc[stage] = (acc[stage] || 0) + 1;
    return acc;
  }, {});

  return {
    total: reflections.length,
    byStage,
    mostCommonStage: Object.keys(byStage).sort((a, b) => byStage[b] - byStage[a])[0]
  };
}
