/**
 * OpenAI Helper
 * Server-side wrapper for AI features
 */

/**
 * NOTE: This requires OpenAI API key in environment variables
 * Add to .env: OPENAI_API_KEY=your_key_here
 */

/**
 * Call OpenAI API
 */
export async function callOpenAI(messages, options = {}) {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: options.model || 'gpt-4o-mini',
        messages,
        temperature: options.temperature || 0.7,
        max_tokens: options.maxTokens || 500,
        ...options
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    return {
      success: true,
      content: data.choices[0].message.content,
      usage: data.usage
    };
  } catch (error) {
    console.error('[OpenAI Error]', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Generate AI insight for vow
 */
export async function generateVowInsight(vow) {
  const prompt = `You are a compassionate healing guide based on VOW Theory. A user created this vow:

"${vow.statement}"

Category: ${vow.category}
Duration: ${vow.duration} days
Why it matters: ${vow.whyMatters || 'Not specified'}

Provide a brief, compassionate insight (2-3 sentences) about:
1. What this vow reveals about their self-awareness
2. One strength they're claiming by making this vow

Keep it encouraging, non-judgmental, and aligned with the Law of Daily Remembrance.`;

  const messages = [
    { role: 'system', content: 'You are a compassionate healing guide who helps people integrate their authentic selves through daily remembrance.' },
    { role: 'user', content: prompt }
  ];

  return await callOpenAI(messages, { maxTokens: 200 });
}

/**
 * Generate reflection prompt
 */
export async function generateReflectionPrompt(stage, context = {}) {
  const stageDescriptions = {
    pacification: 'accepting and observing without judgment',
    confrontation: 'understanding the origins of patterns',
    integration: 'merging healed and original self'
  };

  const prompt = `Create a brief, gentle reflection prompt (1-2 sentences) for someone in the ${stage} stage of healing (${stageDescriptions[stage]}).

${context.recentReflection ? `Their recent reflection mentioned: "${context.recentReflection.substring(0, 100)}..."` : ''}

The prompt should encourage self-awareness without pressure.`;

  const messages = [
    { role: 'system', content: 'You are a compassionate guide helping people reflect on their healing journey.' },
    { role: 'user', content: prompt }
  ];

  return await callOpenAI(messages, { maxTokens: 100 });
}

/**
 * Analyze reflection for patterns
 */
export async function analyzeReflection(reflection) {
  const prompt = `Analyze this personal reflection for patterns and insights:

"${reflection.text}"

Stage: ${reflection.stage}
${reflection.emotion ? `Emotion: ${reflection.emotion}` : ''}

Provide:
1. One key pattern or theme you notice
2. One gentle, compassionate insight
3. Suggested stage for next reflection (pacification, confrontation, or integration)

Keep response under 100 words, non-judgmental, and encouraging.`;

  const messages = [
    { role: 'system', content: 'You are an AI healing assistant trained in VOW Theory and trauma integration.' },
    { role: 'user', content: prompt }
  ];

  return await callOpenAI(messages, { maxTokens: 250 });
}

/**
 * Generate weekly summary
 */
export async function generateWeeklySummary(reflections, triggers, vow) {
  const reflectionTexts = reflections.map(r => r.text).join('\n\n');
  const triggerCount = triggers.length;

  const prompt = `Create a compassionate weekly summary for someone on their healing journey.

Their vow: "${vow.statement}"

This week:
- ${reflections.length} reflections logged
- ${triggerCount} triggers tracked

Sample reflections:
${reflectionTexts.substring(0, 500)}...

Provide:
1. Key patterns observed (1-2 sentences)
2. Growth noticed (1-2 sentences)
3. Gentle guidance for next week (1-2 sentences)

Total: 5-6 sentences maximum. Be warm, non-judgmental, and encouraging.`;

  const messages = [
    { role: 'system', content: 'You are a compassionate healing mentor who recognizes growth and gently guides transformation.' },
    { role: 'user', content: prompt }
  ];

  return await callOpenAI(messages, { maxTokens: 300 });
}

/**
 * Detect combat language (for reframing)
 */
export async function detectCombatLanguage(text) {
  const prompt = `Does this text contain "combat language" (fighting, battling, war metaphors against self)?

"${text}"

Respond with:
1. YES or NO
2. If YES, list the combat words/phrases
3. Suggest gentler alternatives

Keep response brief (3-4 sentences).`;

  const messages = [
    { role: 'system', content: 'You help people move from combat language to acceptance language in healing.' },
    { role: 'user', content: prompt }
  ];

  return await callOpenAI(messages, { maxTokens: 150 });
}

/**
 * Reframe vow without combat language
 */
export async function reframeVow(originalVow, reason = '') {
  const prompt = `Reframe this vow to remove combat language while keeping the same intention:

Original: "${originalVow}"
${reason ? `Reason for reframing: ${reason}` : ''}

Provide a reframed version that:
- Uses observation language, not fighting language
- Maintains the person's boundary and intention
- Follows format: "I'm the type of person that [identity]; therefore, I will [boundary]."

Give only the reframed vow, no explanation.`;

  const messages = [
    { role: 'system', content: 'You help people reframe vows from combat to awareness language.' },
    { role: 'user', content: prompt }
  ];

  return await callOpenAI(messages, { maxTokens: 100 });
}

/**
 * Generate motivation message
 */
export async function generateMotivation(context) {
  const prompt = `Generate a brief motivational message (2 sentences) for someone on their healing journey.

Context:
- Current streak: ${context.streak} days
- Vow progress: ${context.progress}%
- Recent challenges: ${context.challenges || 'none specified'}

Be warm, encouraging, and specific to their progress.`;

  const messages = [
    { role: 'system', content: 'You are a compassionate mentor celebrating growth and encouraging consistency.' },
    { role: 'user', content: prompt }
  ];

  return await callOpenAI(messages, { maxTokens: 100 });
}

/**
 * Check if OpenAI is configured
 */
export function isOpenAIConfigured() {
  return !!process.env.OPENAI_API_KEY;
}

/**
 * Get AI usage stats
 */
export function getAIUsageInfo(usage) {
  if (!usage) return null;
  
  const costPer1kTokens = {
    'gpt-4o-mini': { input: 0.00015, output: 0.0006 },
    'gpt-4o': { input: 0.0025, output: 0.01 }
  };
  
  const model = 'gpt-4o-mini';
  const rates = costPer1kTokens[model];
  
  const inputCost = (usage.prompt_tokens / 1000) * rates.input;
  const outputCost = (usage.completion_tokens / 1000) * rates.output;
  const totalCost = inputCost + outputCost;
  
  return {
    promptTokens: usage.prompt_tokens,
    completionTokens: usage.completion_tokens,
    totalTokens: usage.total_tokens,
    estimatedCost: totalCost.toFixed(6)
  };
}
