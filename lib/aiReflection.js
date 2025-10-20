/**
 * AI-Guided Reflection System
 * Provides intelligent prompts and insights based on user's journey
 */

import { callOpenAI } from './openai';

/**
 * VOW Theory principles for AI guidance
 */
const VOW_PRINCIPLES = {
  pacification: {
    focus: 'Observation without judgment',
    guidingQuestions: [
      'What behavior or pattern are you noticing today?',
      'Can you observe this without labeling it as good or bad?',
      'How does it feel to simply sit with this awareness?'
    ],
    avoidLanguage: ['fight', 'battle', 'overcome', 'defeat']
  },
  confrontation: {
    focus: 'Understanding origins with compassion',
    guidingQuestions: [
      'When did this pattern first begin?',
      'What was happening in your life at that time?',
      'What was this behavior protecting you from?'
    ],
    avoidLanguage: ['weak', 'broken', 'damaged', 'failure']
  },
  integration: {
    focus: 'Merging past and present self',
    guidingQuestions: [
      'Who were you before this pattern formed?',
      'How have you changed through this awareness?',
      'Can both versions of you exist as one?'
    ],
    avoidLanguage: ['fixed', 'cured', 'healed completely']
  }
};

/**
 * Generate personalized reflection prompt
 */
export async function generateReflectionPrompt(userData, recentReflections = []) {
  const lastReflection = recentReflections[0];
  const stage = lastReflection?.stage || 'pacification';
  const principle = VOW_PRINCIPLES[stage];
  
  const systemPrompt = `You are a compassionate AI healing guide trained in VOW Theory. Your role is to help people remember who they are through gentle, non-judgmental reflection prompts.

Key principles:
- Use observation language, never combat language
- Be curious, not prescriptive
- Honor the user's pace and readiness
- Encourage self-discovery, not advice-giving

Current stage focus: ${principle.focus}`;

  const userPrompt = `Create a brief reflection prompt (1-2 sentences) for someone in the ${stage} stage.

${lastReflection ? `Their last reflection touched on: "${lastReflection.text.substring(0, 150)}..."` : 'This is their first reflection.'}

The prompt should:
- Be open-ended and gentle
- Encourage awareness without pressure
- Avoid words like: ${principle.avoidLanguage.join(', ')}`;

  const result = await callOpenAI([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt }
  ], { maxTokens: 150, temperature: 0.8 });

  if (result.success) {
    return {
      prompt: result.content,
      stage,
      generatedAt: new Date().toISOString()
    };
  }

  // Fallback to static prompts if AI fails
  return {
    prompt: principle.guidingQuestions[Math.floor(Math.random() * principle.guidingQuestions.length)],
    stage,
    generatedAt: new Date().toISOString(),
    fallback: true
  };
}

/**
 * Analyze reflection and provide insight
 */
export async function analyzeReflectionWithAI(reflection, userContext = {}) {
  const systemPrompt = `You are a compassionate AI trained in VOW Theory and trauma-informed care. You help people understand their patterns with gentleness and without judgment.

Your insights should:
- Be brief (2-3 sentences)
- Acknowledge what they're noticing
- Gently point toward growth without forcing it
- Never diagnose or give medical advice`;

  const userPrompt = `Analyze this reflection:

"${reflection.text}"

Stage: ${reflection.stage}
${reflection.emotion ? `Emotion: ${reflection.emotion}` : ''}
${userContext.streakDays ? `Streak: ${userContext.streakDays} days` : ''}

Provide a compassionate insight that:
1. Acknowledges their awareness
2. Highlights one pattern or theme
3. Suggests (don't demand) a next step or question

Keep it under 80 words.`;

  const result = await callOpenAI([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt }
  ], { maxTokens: 200, temperature: 0.7 });

  if (result.success) {
    return {
      insight: result.content,
      confidence: 'high',
      source: 'ai'
    };
  }

  return {
    insight: 'Your awareness is growth. Keep observing without judgment.',
    confidence: 'fallback',
    source: 'default'
  };
}

/**
 * Detect stage from reflection content
 */
export async function detectReflectionStage(text) {
  const systemPrompt = `You are an expert in VOW Theory's three stages:

1. Pacification - Observing patterns without judgment, accepting what exists
2. Confrontation - Understanding origins, facing the "why" with compassion  
3. Integration - Merging who they were before with who they've become

Analyze the text and identify which stage it represents.`;

  const userPrompt = `Which stage does this reflection represent?

"${text}"

Respond with ONLY one word: pacification, confrontation, or integration`;

  const result = await callOpenAI([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt }
  ], { maxTokens: 10, temperature: 0.3 });

  if (result.success) {
    const stage = result.content.toLowerCase().trim();
    if (['pacification', 'confrontation', 'integration'].includes(stage)) {
      return stage;
    }
  }

  // Fallback to keyword analysis
  return detectStageByKeywords(text);
}

/**
 * Keyword-based stage detection (fallback)
 */
function detectStageByKeywords(text) {
  const lower = text.toLowerCase();
  
  const integrationWords = ['remember', 'becoming', 'merge', 'whole', 'who i was', 'integration'];
  const confrontationWords = ['why', 'because', 'realize', 'understand', 'origin', 'started', 'protecting'];
  const pacificationWords = ['observe', 'notice', 'accept', 'without judgment', 'aware', 'pattern'];
  
  const integrationScore = integrationWords.filter(w => lower.includes(w)).length;
  const confrontationScore = confrontationWords.filter(w => lower.includes(w)).length;
  const pacificationScore = pacificationWords.filter(w => lower.includes(w)).length;
  
  if (integrationScore > confrontationScore && integrationScore > pacificationScore) {
    return 'integration';
  }
  if (confrontationScore > pacificationScore) {
    return 'confrontation';
  }
  return 'pacification';
}

/**
 * Generate follow-up question based on reflection
 */
export async function generateFollowUpQuestion(reflection) {
  const systemPrompt = `You are a curious, compassionate guide. Ask gentle follow-up questions that deepen self-awareness without being intrusive.`;

  const userPrompt = `Based on this reflection, ask ONE brief follow-up question (one sentence):

"${reflection.text}"

The question should:
- Be open-ended
- Invite deeper reflection
- Not assume anything about their experience`;

  const result = await callOpenAI([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt }
  ], { maxTokens: 50, temperature: 0.8 });

  return result.success ? result.content : null;
}

/**
 * Check for combat language and suggest reframe
 */
export async function checkForCombatLanguage(text) {
  const combatWords = [
    'fight', 'battle', 'war', 'combat', 'struggle', 'defeat', 
    'overcome', 'conquer', 'beat', 'destroy', 'attack', 'enemy'
  ];
  
  const lower = text.toLowerCase();
  const foundWords = combatWords.filter(word => lower.includes(word));
  
  if (foundWords.length === 0) {
    return { hasCombatLanguage: false };
  }
  
  const systemPrompt = `You help people reframe combat language into observation language. Be gentle and preserve their intention.`;
  
  const userPrompt = `This text contains combat language: "${text}"

Combat words found: ${foundWords.join(', ')}

Suggest a brief reframe (1-2 sentences) that:
- Preserves their intention
- Uses observation language instead
- Doesn't minimize their experience`;

  const result = await callOpenAI([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt }
  ], { maxTokens: 100, temperature: 0.7 });

  return {
    hasCombatLanguage: true,
    combatWords: foundWords,
    suggestion: result.success ? result.content : null
  };
}

/**
 * Generate encouragement based on progress
 */
export async function generateEncouragement(stats) {
  const systemPrompt = `You celebrate growth authentically. Be specific about what you notice, warm in tone, and brief.`;
  
  const userPrompt = `Generate a brief encouraging message (2 sentences) for someone with these stats:

- ${stats.totalReflections} reflections
- ${stats.currentStreak} day streak
- ${stats.totalVows} vows created

Be specific and genuine.`;

  const result = await callOpenAI([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt }
  ], { maxTokens: 100, temperature: 0.8 });

  return result.success ? result.content : 'You\'re building consistency. Every day of remembrance matters.';
}

/**
 * Suggest next stage based on readiness
 */
export function suggestNextStage(reflections, currentStage) {
  const stageOrder = ['pacification', 'confrontation', 'integration'];
  const currentIndex = stageOrder.indexOf(currentStage);
  
  // Count reflections in current stage
  const stageCount = reflections.filter(r => r.stage === currentStage).length;
  
  // Suggest moving forward after 3+ reflections in same stage
  if (stageCount >= 3 && currentIndex < stageOrder.length - 1) {
    return {
      ready: true,
      nextStage: stageOrder[currentIndex + 1],
      reason: `You've done ${stageCount} reflections in ${currentStage}. Consider exploring ${stageOrder[currentIndex + 1]}.`
    };
  }
  
  return {
    ready: false,
    currentStage,
    reason: `Continue building awareness in ${currentStage}.`
  };
}

/**
 * Get reflection quality score
 */
export function getReflectionQuality(reflection) {
  const wordCount = reflection.text.split(/\s+/).length;
  const hasEmotion = !!reflection.emotion;
  const hasStage = !!reflection.stage;
  
  let score = 0;
  let feedback = [];
  
  if (wordCount >= 50) {
    score += 40;
  } else if (wordCount >= 20) {
    score += 20;
    feedback.push('Consider writing more to deepen your reflection');
  }
  
  if (hasEmotion) {
    score += 30;
  } else {
    feedback.push('Tag an emotion to track your emotional patterns');
  }
  
  if (hasStage) {
    score += 30;
  }
  
  return {
    score,
    feedback,
    quality: score >= 80 ? 'high' : score >= 50 ? 'medium' : 'low'
  };
}
