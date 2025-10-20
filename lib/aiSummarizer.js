/**
 * AI Summarizer
 * Generate weekly/monthly summaries of reflections and progress
 */

import { callOpenAI } from './openai';
import { analyzeTriggerPatterns, analyzeReflectionPatterns } from './patterns';
import { formatDate } from '../utils/dateUtils';

/**
 * Generate weekly summary
 */
export async function generateWeeklySummary(data) {
  const { reflections, triggers, vows, stats, dateRange } = data;
  
  // Analyze patterns
  const triggerPatterns = analyzeTriggerPatterns(triggers || []);
  const reflectionPatterns = analyzeReflectionPatterns(reflections || []);
  
  // Build context for AI
  const context = buildSummaryContext({
    reflections,
    triggers,
    vows,
    stats,
    triggerPatterns,
    reflectionPatterns,
    dateRange
  });
  
  const systemPrompt = `You are a compassionate healing mentor who creates weekly summaries for people on their VOW Theory journey. Your summaries should:
- Celebrate progress authentically
- Acknowledge patterns with compassion
- Provide gentle guidance
- Be brief (150-200 words)
- Feel warm and personal`;

  const userPrompt = `Create a weekly summary for this person's healing journey:

${context}

Include:
1. Key patterns observed (2-3 sentences)
2. Growth noticed (1-2 sentences)
3. Gentle encouragement for the week ahead (1-2 sentences)

Be specific, compassionate, and encouraging.`;

  const result = await callOpenAI([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt }
  ], { maxTokens: 400, temperature: 0.7 });

  if (result.success) {
    return {
      success: true,
      summary: result.content,
      stats: {
        reflections: reflections?.length || 0,
        triggers: triggers?.length || 0,
        activeVows: vows?.filter(v => v.status === 'active').length || 0,
        dominantEmotion: reflectionPatterns.dominantEmotion,
        dominantStage: reflectionPatterns.dominantStage
      },
      generatedAt: new Date().toISOString()
    };
  }

  // Fallback to template-based summary
  return generateTemplateSummary(data);
}

/**
 * Generate monthly summary
 */
export async function generateMonthlySummary(data) {
  const { reflections, triggers, vows, stats, achievements } = data;
  
  const systemPrompt = `You are a healing mentor creating a monthly reflection summary. Focus on transformation, patterns, and growth over 30 days. Be celebratory but honest.`;

  const userPrompt = `Create a monthly summary (200-250 words):

Reflections: ${reflections?.length || 0}
Triggers logged: ${triggers?.length || 0}
Active vows: ${vows?.length || 0}
Completed vows: ${stats?.completedVows || 0}
Current streak: ${stats?.currentStreak || 0} days
Longest streak: ${stats?.longestStreak || 0} days

${achievements?.length > 0 ? `Achievements unlocked: ${achievements.map(a => a.name).join(', ')}` : ''}

Sample reflections:
${reflections?.slice(0, 3).map(r => `- ${r.text.substring(0, 100)}...`).join('\n') || 'None'}

Include:
1. Month overview (2-3 sentences)
2. Major patterns or breakthroughs (2-3 sentences)
3. What this month revealed about their journey (2 sentences)
4. Looking ahead with encouragement (2 sentences)`;

  const result = await callOpenAI([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt }
  ], { maxTokens: 500, temperature: 0.7 });

  if (result.success) {
    return {
      success: true,
      summary: result.content,
      monthStats: {
        totalReflections: reflections?.length || 0,
        totalTriggers: triggers?.length || 0,
        vowsCompleted: stats?.completedVows || 0,
        longestStreak: stats?.longestStreak || 0,
        achievementsEarned: achievements?.length || 0
      },
      generatedAt: new Date().toISOString()
    };
  }

  return generateTemplateMonthSummary(data);
}

/**
 * Build context for AI summary
 */
function buildSummaryContext(data) {
  const { reflections, triggers, stats, triggerPatterns, reflectionPatterns, dateRange } = data;
  
  let context = `Week: ${formatDate(dateRange?.start)} to ${formatDate(dateRange?.end)}\n\n`;
  
  context += `Activity:\n`;
  context += `- ${reflections?.length || 0} reflections logged\n`;
  context += `- ${triggers?.length || 0} triggers tracked\n`;
  context += `- Current streak: ${stats?.currentStreak || 0} days\n\n`;
  
  if (reflectionPatterns.dominantStage) {
    context += `Reflection stage: Mostly ${reflectionPatterns.dominantStage}\n`;
  }
  
  if (reflectionPatterns.dominantEmotion) {
    context += `Dominant emotion: ${reflectionPatterns.dominantEmotion}\n`;
  }
  
  if (triggerPatterns.mostCommonCategory) {
    context += `Trigger pattern: ${triggerPatterns.mostCommonCategory}\n`;
  }
  
  context += `\nSample reflections:\n`;
  reflections?.slice(0, 3).forEach((r, i) => {
    context += `${i + 1}. "${r.text.substring(0, 120)}..."\n`;
  });
  
  return context;
}

/**
 * Template-based summary (fallback)
 */
function generateTemplateSummary(data) {
  const { reflections, triggers, stats, reflectionPatterns, triggerPatterns } = data;
  
  let summary = `This week, you logged ${reflections?.length || 0} reflections and tracked ${triggers?.length || 0} triggers. `;
  
  if (stats?.currentStreak > 7) {
    summary += `Your ${stats.currentStreak}-day streak shows consistent dedication to remembering who you are. `;
  }
  
  if (reflectionPatterns.dominantStage === 'integration') {
    summary += `Your reflections show you're integrating—merging awareness with action. This is powerful growth. `;
  } else if (reflectionPatterns.dominantStage === 'confrontation') {
    summary += `You're facing difficult truths this week. This takes courage. `;
  } else {
    summary += `You're observing patterns with increasing awareness. `;
  }
  
  if (triggerPatterns.total > 0) {
    summary += `You noticed ${triggerPatterns.total} triggers, which means you're paying attention. `;
  }
  
  summary += `Continue this practice. Every day of remembrance matters.`;
  
  return {
    success: true,
    summary,
    fallback: true,
    generatedAt: new Date().toISOString()
  };
}

/**
 * Template-based monthly summary (fallback)
 */
function generateTemplateMonthSummary(data) {
  const { reflections, triggers, stats } = data;
  
  let summary = `This month, you created ${reflections?.length || 0} reflections and logged ${triggers?.length || 0} triggers. `;
  
  if (stats?.completedVows > 0) {
    summary += `You completed ${stats.completedVows} ${stats.completedVows === 1 ? 'vow' : 'vows'}—proof that commitment creates change. `;
  }
  
  if (stats?.longestStreak >= 30) {
    summary += `Your ${stats.longestStreak}-day streak this month shows transformation happening. `;
  }
  
  summary += `Thirty days of remembrance rewires neural pathways. You're not the same person you were at the start of this month. `;
  summary += `Keep going. Integration is happening.`;
  
  return {
    success: true,
    summary,
    fallback: true,
    generatedAt: new Date().toISOString()
  };
}

/**
 * Generate progress comparison
 */
export function compareProgress(oldPeriod, newPeriod) {
  return {
    reflections: {
      old: oldPeriod.reflectionCount,
      new: newPeriod.reflectionCount,
      change: newPeriod.reflectionCount - oldPeriod.reflectionCount,
      improved: newPeriod.reflectionCount > oldPeriod.reflectionCount
    },
    triggers: {
      old: oldPeriod.triggerCount,
      new: newPeriod.triggerCount,
      change: newPeriod.triggerCount - oldPeriod.triggerCount,
      improved: newPeriod.triggerCount < oldPeriod.triggerCount // Less is better
    },
    streak: {
      old: oldPeriod.longestStreak,
      new: newPeriod.longestStreak,
      change: newPeriod.longestStreak - oldPeriod.longestStreak,
      improved: newPeriod.longestStreak > oldPeriod.longestStreak
    }
  };
}

/**
 * Get summary insights
 */
export function getSummaryInsights(summary, comparison) {
  const insights = [];
  
  if (comparison.reflections.improved) {
    insights.push({
      type: 'positive',
      message: `Reflection activity increased by ${comparison.reflections.change}`,
      icon: '📈'
    });
  }
  
  if (comparison.triggers.improved) {
    insights.push({
      type: 'positive',
      message: `Triggers decreased by ${Math.abs(comparison.triggers.change)}`,
      icon: '✨'
    });
  }
  
  if (comparison.streak.improved) {
    insights.push({
      type: 'positive',
      message: `Streak improved by ${comparison.streak.change} days`,
      icon: '🔥'
    });
  }
  
  return insights;
}

/**
 * Format summary for email
 */
export function formatSummaryForEmail(summary, userName) {
  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #C6A664 0%, #5FD3A5 100%); color: white; padding: 30px; text-align: center; border-radius: 10px; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 10px; margin: 20px 0; }
    .stats { display: flex; justify-content: space-around; margin: 20px 0; }
    .stat { text-align: center; }
    .stat-number { font-size: 32px; font-weight: bold; color: #C6A664; }
    .footer { text-align: center; color: #666; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Your Weekly VOW Summary</h1>
      <p>${userName}, here's your journey this week</p>
    </div>
    
    <div class="content">
      <p>${summary.summary}</p>
      
      <div class="stats">
        <div class="stat">
          <div class="stat-number">${summary.stats.reflections}</div>
          <div>Reflections</div>
        </div>
        <div class="stat">
          <div class="stat-number">${summary.stats.triggers}</div>
          <div>Triggers</div>
        </div>
        <div class="stat">
          <div class="stat-number">${summary.stats.activeVows}</div>
          <div>Active Vows</div>
        </div>
      </div>
    </div>
    
    <div class="footer">
      <p>Keep remembering. Every day matters.</p>
      <p><a href="${process.env.NEXT_PUBLIC_BASE_URL}/dashboard">View Dashboard</a></p>
    </div>
  </div>
</body>
</html>
  `;
}
