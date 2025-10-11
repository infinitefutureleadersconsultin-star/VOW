// pages/api/triggerLogging.js
// Trigger Logging & Analytics API
// Captures urges, patterns, emotions, and generates anticipatory insights

import { verifyToken } from '../../utils/apiClient';
import { z } from 'zod';

// ============================================
// VALIDATION SCHEMAS
// ============================================

const logTriggerSchema = z.object({
  vowId: z.string().min(1, 'Vow ID required'),
  timestamp: z.number().optional(),
  location: z.string().optional(),
  emotions: z.array(z.string()).optional(),
  intensity: z.number().min(1).max(10).optional(),
  context: z.string().max(1000).optional(),
  voiceNote: z.string().optional(), // Base64 or URL
  resisted: z.boolean().optional(),
});

const getTriggerAnalyticsSchema = z.object({
  vowId: z.string().optional(),
  startDate: z.number().optional(),
  endDate: z.number().optional(),
  limit: z.number().min(1).max(100).default(50),
});

// ============================================
// MOCK DATABASE (Replace with Firebase)
// ============================================

const triggerLogs = new Map(); // userId -> [logs]
const analytics = new Map(); // userId -> analytics object

// ============================================
// HELPER FUNCTIONS
// ============================================

function generateTriggerId() {
  return `trigger_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function calculateTriggerFingerprint(logs) {
  // Analyze patterns: time of day, emotions, locations
  const timePatterns = {};
  const emotionCounts = {};
  const locationCounts = {};
  let totalIntensity = 0;
  let resistedCount = 0;

  logs.forEach(log => {
    // Time of day analysis
    const hour = new Date(log.timestamp).getHours();
    const timeSlot = getTimeSlot(hour);
    timePatterns[timeSlot] = (timePatterns[timeSlot] || 0) + 1;

    // Emotion tracking
    (log.emotions || []).forEach(emotion => {
      emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
    });

    // Location tracking
    if (log.location) {
      locationCounts[log.location] = (locationCounts[log.location] || 0) + 1;
    }

    // Intensity & resistance
    totalIntensity += log.intensity || 5;
    if (log.resisted) resistedCount++;
  });

  const avgIntensity = logs.length > 0 ? totalIntensity / logs.length : 0;
  const resistanceRate = logs.length > 0 ? (resistedCount / logs.length) * 100 : 0;

  // Identify high-risk windows
  const highRiskTimes = Object.entries(timePatterns)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([time]) => time);

  // Most common emotions
  const topEmotions = Object.entries(emotionCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([emotion]) => emotion);

  // Most common locations
  const topLocations = Object.entries(locationCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([location]) => location);

  return {
    totalTriggers: logs.length,
    avgIntensity: Math.round(avgIntensity * 10) / 10,
    resistanceRate: Math.round(resistanceRate),
    highRiskTimes,
    topEmotions,
    topLocations,
    lastTriggered: logs.length > 0 ? logs[logs.length - 1].timestamp : null,
  };
}

function getTimeSlot(hour) {
  if (hour >= 5 && hour < 12) return 'Morning (5am-12pm)';
  if (hour >= 12 && hour < 17) return 'Afternoon (12pm-5pm)';
  if (hour >= 17 && hour < 21) return 'Evening (5pm-9pm)';
  return 'Night (9pm-5am)';
}

function generateAnticipatorySuggestion(fingerprint, currentHour) {
  const suggestions = [];
  const currentTimeSlot = getTimeSlot(currentHour);

  // Check if current time is high-risk
  if (fingerprint.highRiskTimes.includes(currentTimeSlot)) {
    suggestions.push({
      type: 'time_based',
      priority: 'high',
      message: `You tend to notice urges around this time (${currentTimeSlot.toLowerCase()}). A 5-minute grounding exercise may help.`,
    });
  }

  // Suggest based on resistance rate
  if (fingerprint.resistanceRate < 50) {
    suggestions.push({
      type: 'encouragement',
      priority: 'medium',
      message: 'Your resistance is building. Each observation strengthens your awareness.',
    });
  } else if (fingerprint.resistanceRate >= 75) {
    suggestions.push({
      type: 'celebration',
      priority: 'low',
      message: `${fingerprint.resistanceRate}% resistance rate - you're remembering your vow with strength.`,
    });
  }

  // Intensity-based suggestions
  if (fingerprint.avgIntensity > 7) {
    suggestions.push({
      type: 'intensity_alert',
      priority: 'high',
      message: 'Your triggers have been intense lately. Consider reaching out to your accountability partner.',
    });
  }

  // Emotion-based suggestions
  if (fingerprint.topEmotions.length > 0) {
    const emotionStr = fingerprint.topEmotions.slice(0, 2).join(' and ');
    suggestions.push({
      type: 'emotional_insight',
      priority: 'medium',
      message: `${emotionStr} often precede your urges. Notice these feelings as early signals.`,
    });
  }

  return suggestions;
}

// ============================================
// API HANDLER
// ============================================

export default async function handler(req, res) {
  const { method } = req;

  try {
    // Authenticate user
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error('[triggerLogging] Missing or invalid auth header');
      return res.status(401).json({ error: 'Authentication required' });
    }

    const token = authHeader.substring(7);
    let userId;
    try {
      const decoded = verifyToken(token);
      userId = decoded.userId;
    } catch (error) {
      console.error('[triggerLogging] Token verification failed:', error.message);
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    // ============================================
    // POST: Log a new trigger
    // ============================================
    if (method === 'POST') {
      try {
        const validated = logTriggerSchema.parse(req.body);

        const trigger = {
          id: generateTriggerId(),
          userId,
          vowId: validated.vowId,
          timestamp: validated.timestamp || Date.now(),
          location: validated.location || null,
          emotions: validated.emotions || [],
          intensity: validated.intensity || 5,
          context: validated.context || '',
          voiceNote: validated.voiceNote || null,
          resisted: validated.resisted !== undefined ? validated.resisted : true,
          createdAt: Date.now(),
        };

        // Store trigger log
        if (!triggerLogs.has(userId)) {
          triggerLogs.set(userId, []);
        }
        const userLogs = triggerLogs.get(userId);
        userLogs.push(trigger);

        // Update analytics
        const fingerprint = calculateTriggerFingerprint(userLogs);
        analytics.set(userId, fingerprint);

        // Generate anticipatory suggestion
        const currentHour = new Date().getHours();
        const suggestions = generateAnticipatorySuggestion(fingerprint, currentHour);

        console.log(`[triggerLogging] Logged trigger for user ${userId}:`, {
          triggerId: trigger.id,
          vowId: trigger.vowId,
          intensity: trigger.intensity,
          resisted: trigger.resisted,
        });

        return res.status(201).json({
          success: true,
          trigger: {
            id: trigger.id,
            timestamp: trigger.timestamp,
            intensity: trigger.intensity,
            resisted: trigger.resisted,
          },
          suggestions,
          fingerprint: {
            totalTriggers: fingerprint.totalTriggers,
            resistanceRate: fingerprint.resistanceRate,
          },
        });
      } catch (error) {
        if (error instanceof z.ZodError) {
          console.error('[triggerLogging] Validation error:', error.errors);
          return res.status(400).json({
            error: 'Validation failed',
            details: error.errors,
          });
        }
        throw error;
      }
    }

    // ============================================
    // GET: Retrieve trigger analytics
    // ============================================
    if (method === 'GET') {
      try {
        const validated = getTriggerAnalyticsSchema.parse(req.query);

        const userLogs = triggerLogs.get(userId) || [];
        let filteredLogs = userLogs;

        // Filter by vow ID
        if (validated.vowId) {
          filteredLogs = filteredLogs.filter(log => log.vowId === validated.vowId);
        }

        // Filter by date range
        if (validated.startDate) {
          filteredLogs = filteredLogs.filter(log => log.timestamp >= validated.startDate);
        }
        if (validated.endDate) {
          filteredLogs = filteredLogs.filter(log => log.timestamp <= validated.endDate);
        }

        // Apply limit
        const recentLogs = filteredLogs
          .sort((a, b) => b.timestamp - a.timestamp)
          .slice(0, validated.limit)
          .map(log => ({
            id: log.id,
            vowId: log.vowId,
            timestamp: log.timestamp,
            emotions: log.emotions,
            intensity: log.intensity,
            location: log.location,
            resisted: log.resisted,
            context: log.context ? log.context.substring(0, 100) : null,
          }));

        // Get analytics
        const fingerprint = calculateTriggerFingerprint(filteredLogs);

        // Generate current suggestions
        const currentHour = new Date().getHours();
        const suggestions = generateAnticipatorySuggestion(fingerprint, currentHour);

        console.log(`[triggerLogging] Retrieved analytics for user ${userId}:`, {
          totalLogs: filteredLogs.length,
          returned: recentLogs.length,
        });

        return res.status(200).json({
          success: true,
          logs: recentLogs,
          analytics: fingerprint,
          suggestions,
        });
      } catch (error) {
        if (error instanceof z.ZodError) {
          console.error('[triggerLogging] Query validation error:', error.errors);
          return res.status(400).json({
            error: 'Invalid query parameters',
            details: error.errors,
          });
        }
        throw error;
      }
    }

    // Method not allowed
    res.setHeader('Allow', ['POST', 'GET']);
    console.error(`[triggerLogging] Method ${method} not allowed`);
    return res.status(405).json({ error: `Method ${method} not allowed` });

  } catch (error) {
    console.error('[triggerLogging] Unexpected error:', {
      message: error.message,
      stack: error.stack,
      method: req.method,
    });
    return res.status(500).json({
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}
