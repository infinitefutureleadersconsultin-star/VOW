/**
 * OpenAI Helper with Multilingual Support
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

const LANGUAGE_NAMES = {
  en: 'English',
  es: 'Spanish (Español)',
  fr: 'French (Français)',
  hi: 'Hindi (हिन्दी)',
  zh: 'Chinese (中文)',
  pt: 'Portuguese (Português)'
};

function getLanguageInstruction(language) {
  if (!language || language === 'en') return '';
  return `IMPORTANT: Respond entirely in ${LANGUAGE_NAMES[language] || language}. Do not use English.`;
}

export async function generateVowInsight(vow, language = 'en') {
  const languageInstruction = getLanguageInstruction(language);
  
  const prompt = `You are a compassionate healing guide based on VOW Theory. A user created this vow:

"${vow.statement}"

Category: ${vow.category}
Duration: ${vow.duration} days
Why it matters: ${vow.whyMatters || 'Not specified'}

Provide a brief, compassionate insight (2-3 sentences) about:
1. What this vow reveals about their self-awareness
2. One strength they're claiming by making this vow

Keep it encouraging, non-judgmental, and aligned with the Law of Daily Remembrance.

${languageInstruction}`;

  const messages = [
    { 
      role: 'system', 
      content: `You are a compassionate healing guide who helps people integrate their authentic selves through daily remembrance. ${languageInstruction}`
    },
    { role: 'user', content: prompt }
  ];

  return await callOpenAI(messages, { maxTokens: 200 });
}

export async function generateReflectionPrompt(stage, context = {}, language = 'en') {
  const languageInstruction = getLanguageInstruction(language);
  
  const stageDescriptions = {
    pacification: 'accepting and observing without judgment',
    confrontation: 'understanding the origins of patterns',
    integration: 'merging healed and original self'
  };

  const prompt = `Create a brief, gentle reflection prompt (1-2 sentences) for someone in the ${stage} stage of healing (${stageDescriptions[stage]}).

${context.recentReflection ? `Their recent reflection mentioned: "${context.recentReflection.substring(0, 100)}..."` : ''}

The prompt should encourage self-awareness without pressure.

${languageInstruction}`;

  const messages = [
    { 
      role: 'system', 
      content: `You are a compassionate guide helping people reflect on their healing journey. ${languageInstruction}`
    },
    { role: 'user', content: prompt }
  ];

  return await callOpenAI(messages, { maxTokens: 100 });
}

export async function analyzeReflection(reflection, language = 'en') {
  const languageInstruction = getLanguageInstruction(language);
  
  const prompt = `Analyze this reflection and provide a brief, compassionate response (2-3 sentences):

"${reflection}"

Focus on:
1. Acknowledging their self-awareness
2. Highlighting any growth or insight shown

${languageInstruction}`;

  const messages = [
    { 
      role: 'system', 
      content: `You are a compassionate healing guide. ${languageInstruction}`
    },
    { role: 'user', content: prompt }
  ];

  return await callOpenAI(messages, { maxTokens: 150 });
}

export async function generateWeeklySummary(userData, vows, reflections, language = 'en') {
  const languageInstruction = getLanguageInstruction(language);
  
  const prompt = `Create a weekly progress summary for a user on their healing journey.

Vows created: ${vows.length}
Reflections: ${reflections.length}
Current alignment: ${userData.alignmentScore || 0}

Based on their activity, provide:
1. One key pattern or insight (1-2 sentences)
2. One encouragement for next week (1 sentence)

${languageInstruction}`;

  const messages = [
    { 
      role: 'system', 
      content: `You are a compassionate healing guide providing weekly insights. ${languageInstruction}`
    },
    { role: 'user', content: prompt }
  ];

  return await callOpenAI(messages, { maxTokens: 250 });
}

export async function analyzeTrigger(triggerData, language = 'en') {
  const languageInstruction = getLanguageInstruction(language);
  
  const prompt = `A user experienced a trigger:

Type: ${triggerData.type}
Intensity: ${triggerData.intensity}/10
Context: ${triggerData.context}
Response: ${triggerData.response}

Provide a brief, compassionate analysis (2-3 sentences) focusing on:
1. What this trigger reveals
2. One gentle suggestion for next time

${languageInstruction}`;

  const messages = [
    { 
      role: 'system', 
      content: `You are a compassionate trauma-informed guide. ${languageInstruction}`
    },
    { role: 'user', content: prompt }
  ];

  return await callOpenAI(messages, { maxTokens: 150 });
}
