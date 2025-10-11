// pages/api/memoryRecall.js
// Memory Linking & Trauma Detection API
// Links current triggers to past memories, identifies trauma markers

import { verifyToken } from '../../utils/apiClient';
import { z } from 'zod';

// ============================================
// VALIDATION SCHEMAS
// ============================================

const linkMemorySchema = z.object({
  triggerId: z.string().min(1, 'Trigger ID required'),
  memoryText: z.string().min(10, 'Memory description too short').max(2000),
  timeframe: z.enum(['childhood', 'adolescence', 'young_adult', 'recent', 'unknown']).optional(),
  emotionalIntensity: z.number().min(1).max(10).optional(),
  isTraumatic: z.boolean().optional(),
});

const analyzeMemorySchema = z.object({
  memoryText: z.string().min(10).max(2000),
  context: z.string().max(500).optional(),
});

const getLinkedMemoriesSchema = z.object({
  vowId: z.string().optional(),
  triggerId: z.string().optional(),
  includeTraumaMarkers: z.boolean().optional(),
  limit: z.number().min(1).max(50).default(20),
});

// ============================================
// TRAUMA MARKERS & DETECTION
// ============================================

const TRAUMA_INDICATORS = {
  language: [
    'abuse', 'hurt', 'pain', 'scared', 'afraid', 'terrified', 'helpless',
    'trapped', 'violated', 'ashamed', 'guilty', 'worthless', 'abandoned',
    'betrayed', 'rejected', 'humiliated', 'powerless', 'unsafe', 'threatened'
  ],
  patterns: [
    /couldn'?t (stop|protect|defend|escape)/i,
    /no one (helped|believed|listened|cared)/i,
    /(always|never) felt safe/i,
    /it was my fault/i,
    /should have (done|said|been)/i,
    /if only i (had|hadn'?t)/i,
  ],
  timeIndicators: [
    /when i was (\d+|young|little|a child)/i,
    /growing up/i,
    /as a (kid|child|teenager)/i,
    /back then/i,
  ],
};

const DISSOCIATION_MARKERS = [
  'numb', 'detached', 'disconnected', 'unreal', 'fog', 'haze', 'blank',
  'empty', 'watching myself', 'not really there', 'floated away',
];

const AVOIDANCE_PATTERNS = [
  'try not to think about', 'avoid thinking', 'push it away', 'bury it',
  'pretend it never happened', 'block it out', 'shut it down',
];

function detectTraumaMarkers(text) {
  const lowerText = text.toLowerCase();
  const markers = {
    traumaLanguage: [],
    traumaPatterns: [],
    dissociationMarkers: [],
    avoidancePatterns: [],
    timeIndicators: [],
  };

  // Language indicators
  TRAUMA_INDICATORS.language.forEach(word => {
    if (lowerText.includes(word)) {
      markers.traumaLanguage.push(word);
    }
  });

  // Pattern matching
  TRAUMA_INDICATORS.patterns.forEach(pattern => {
    if (pattern.test(text)) {
      markers.traumaPatterns.push(pattern.source);
    }
  });

  // Time indicators
  TRAUMA_INDICATORS.timeIndicators.forEach(pattern => {
    if (pattern.test(text)) {
      markers.timeIndicators.push(pattern.source);
    }
  });

  // Dissociation markers
  DISSOCIATION_MARKERS.forEach(marker => {
    if (lowerText.includes(marker)) {
      markers.dissociationMarkers.push(marker);
    }
  });

  // Avoidance patterns
  AVOIDANCE_PATTERNS.forEach(pattern => {
    if (lowerText.includes(pattern)) {
      markers.avoidancePatterns.push(pattern);
    }
  });

  const totalMarkers = 
    markers.traumaLanguage.length +
    markers.traumaPatterns.length +
    markers.dissociationMarkers.length +
    markers.avoidancePatterns.length +
    markers.timeIndicators.length;

  const traumaLikelihood = totalMarkers >= 5 ? 'high' :
                           totalMarkers >= 3 ? 'medium' :
                           totalMarkers >= 1 ? 'low' : 'none';

  return {
    markers,
    totalMarkers,
    traumaLikelihood,
    requiresProfessionalSupport: traumaLikelihood === 'high' || totalMarkers >= 4,
  };
}

// ============================================
// MEMORY PATTERN ANALYSIS
// ============================================

function analyzeMemoryPatterns(memories) {
  const patterns = {
    commonThemes: {},
    emotionalTrends: [],
    timeframeClusters: {},
    traumaFrequency: 0,
  };

  memories.forEach(memory => {
    // Time clustering
    const timeframe = memory.timeframe || 'unknown';
    patterns.timeframeClusters[timeframe] = (patterns.timeframeClusters[timeframe] || 0) + 1;

    // Trauma counting
    if (memory.traumaAnalysis?.requiresProfessionalSupport) {
      patterns.traumaFrequency++;
    }

    // Extract themes from memory text (simplified)
    const words = memory.memoryText.toLowerCase().split(/\s+/);
    words.forEach(word => {
      if (word.length > 4) { // Only meaningful words
        patterns.commonThemes[word] = (patterns.commonThemes[word] || 0) + 1;
      }
    });
  });

  // Get top themes
  const topThemes = Object.entries(patterns.commonThemes)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([theme]) => theme);

  return {
    ...patterns,
    topThemes,
    mostCommonTimeframe: Object.entries(patterns.timeframeClusters)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || 'unknown',
  };
}

// ============================================
// MEMORY LINKAGE
// ============================================

function calculateMemorySimilarity(memory1, memory2) {
  // Simple similarity based on shared words and emotional intensity
  const words1 = new Set(memory1.memoryText.toLowerCase().split(/\s+/));
  const words2 = new Set(memory2.memoryText.toLowerCase().split(/\s+/));
  
  const intersection = new Set([...words1].filter(x => words2.has(x)));
  const union = new Set([...words1, ...words2]);
  
  const wordSimilarity = intersection.size / union.size;
  
  const intensityDiff = Math.abs(
    (memory1.emotionalIntensity || 5) - (memory2.emotionalIntensity || 5)
  );
  const intensitySimilarity = 1 - (intensityDiff / 10);
  
  return (wordSimilarity * 0.7) + (intensitySimilarity * 0.3);
}

function findRelatedMemories(targetMemory, allMemories, threshold = 0.3) {
  return allMemories
    .filter(m => m.id !== targetMemory.id)
    .map(memory => ({
      memory,
      similarity: calculateMemorySimilarity(targetMemory, memory),
    }))
    .filter(({ similarity }) => similarity >= threshold)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, 5);
}

// ============================================
// PROFESSIONAL SUPPORT MESSAGING
// ============================================

function generateSupportMessage(traumaAnalysis) {
  if (!traumaAnalysis.requiresProfessionalSupport) {
    return null;
  }

  return {
    level: 'important',
    message: 'This memory contains markers that suggest unresolved trauma. Speaking with a professional therapist can help you process these experiences safely.',
    resources: [
      {
        name: 'SAMHSA National Helpline',
        contact: '1-800-662-4357',
        description: '24/7 treatment referral and information service',
      },
      {
        name: 'Crisis Text Line',
        contact: 'Text HOME to 741741',
        description: 'Free, 24/7 crisis support via text',
      },
      {
        name: 'Psychology Today Therapist Finder',
        url: 'https://www.psychologytoday.com/us/therapists',
        description: 'Find licensed therapists in your area',
      },
    ],
    note: 'VOW supports your journey, but cannot replace professional care for trauma processing.',
  };
}

// ============================================
// MOCK DATABASE
// ============================================

const memories = new Map(); // userId -> [memories]
const memoryLinks = new Map(); // memoryId -> [linkedMemoryIds]

function generateMemoryId() {
  return `mem_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
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
      console.error('[memoryRecall] Missing or invalid auth header');
      return res.status(401).json({ error: 'Authentication required' });
    }

    const token = authHeader.substring(7);
    let userId;
    try {
      const decoded = verifyToken(token);
      userId = decoded.userId;
    } catch (error) {
      console.error('[memoryRecall] Token verification failed:', error.message);
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    // ============================================
    // POST: Link a memory to a trigger
    // ============================================
    if (method === 'POST' && req.url.includes('/link')) {
      try {
        const validated = linkMemorySchema.parse(req.body);

        // Analyze for trauma markers
        const traumaAnalysis = detectTraumaMarkers(validated.memoryText);

        const memory = {
          id: generateMemoryId(),
          userId,
          triggerId: validated.triggerId,
          memoryText: validated.memoryText,
          timeframe: validated.timeframe || 'unknown',
          emotionalIntensity: validated.emotionalIntensity || 5,
          isTraumatic: validated.isTraumatic || traumaAnalysis.requiresProfessionalSupport,
          traumaAnalysis,
          createdAt: Date.now(),
        };

        // Store memory
        if (!memories.has(userId)) {
          memories.set(userId, []);
        }
        const userMemories = memories.get(userId);
        userMemories.push(memory);

        // Find related memories
        const related = findRelatedMemories(memory, userMemories);

        // Generate support message if needed
        const supportMessage = generateSupportMessage(traumaAnalysis);

        console.log(`[memoryRecall] Linked memory for user ${userId}:`, {
          memoryId: memory.id,
          triggerId: memory.triggerId,
          traumaLikelihood: traumaAnalysis.traumaLikelihood,
          relatedCount: related.length,
        });

        return res.status(201).json({
          success: true,
          memory: {
            id: memory.id,
            triggerId: memory.triggerId,
            timeframe: memory.timeframe,
            traumaLikelihood: traumaAnalysis.traumaLikelihood,
            requiresSupport: traumaAnalysis.requiresProfessionalSupport,
          },
          relatedMemories: related.map(r => ({
            id: r.memory.id,
            timeframe: r.memory.timeframe,
            similarity: Math.round(r.similarity * 100),
          })),
          supportMessage,
        });
      } catch (error) {
        if (error instanceof z.ZodError) {
          console.error('[memoryRecall] Validation error:', error.errors);
          return res.status(400).json({
            error: 'Validation failed',
            details: error.errors,
          });
        }
        throw error;
      }
    }

    // ============================================
    // POST: Analyze memory text
    // ============================================
    if (method === 'POST' && req.url.includes('/analyze')) {
      try {
        const validated = analyzeMemorySchema.parse(req.body);

        const traumaAnalysis = detectTraumaMarkers(validated.memoryText);
        const supportMessage = generateSupportMessage(traumaAnalysis);

        console.log(`[memoryRecall] Analyzed memory for user ${userId}:`, {
          traumaLikelihood: traumaAnalysis.traumaLikelihood,
          totalMarkers: traumaAnalysis.totalMarkers,
        });

        return res.status(200).json({
          success: true,
          analysis: {
            traumaLikelihood: traumaAnalysis.traumaLikelihood,
            totalMarkers: traumaAnalysis.totalMarkers,
            requiresProfessionalSupport: traumaAnalysis.requiresProfessionalSupport,
            markers: {
              traumaLanguageCount: traumaAnalysis.markers.traumaLanguage.length,
              dissociationMarkersCount: traumaAnalysis.markers.dissociationMarkers.length,
              avoidancePatternsCount: traumaAnalysis.markers.avoidancePatterns.length,
            },
          },
          supportMessage,
        });
      } catch (error) {
        if (error instanceof z.ZodError) {
          console.error('[memoryRecall] Validation error:', error.errors);
          return res.status(400).json({
            error: 'Validation failed',
            details: error.errors,
          });
        }
        throw error;
      }
    }

    // ============================================
    // GET: Retrieve linked memories
    // ============================================
    if (method === 'GET') {
      try {
        const validated = getLinkedMemoriesSchema.parse(req.query);

        const userMemories = memories.get(userId) || [];
        let filtered = userMemories;

        // Filter by trigger ID
        if (validated.triggerId) {
          filtered = filtered.filter(m => m.triggerId === validated.triggerId);
        }

        // Filter trauma markers if requested
        if (validated.includeTraumaMarkers) {
          filtered = filtered.filter(m => m.traumaAnalysis.requiresProfessionalSupport);
        }

        // Apply limit
        const recentMemories = filtered
          .sort((a, b) => b.createdAt - a.createdAt)
          .slice(0, validated.limit)
          .map(m => ({
            id: m.id,
            triggerId: m.triggerId,
            timeframe: m.timeframe,
            emotionalIntensity: m.emotionalIntensity,
            isTraumatic: m.isTraumatic,
            traumaLikelihood: m.traumaAnalysis.traumaLikelihood,
            createdAt: m.createdAt,
            preview: m.memoryText.substring(0, 100) + (m.memoryText.length > 100 ? '...' : ''),
          }));

        // Analyze patterns
        const patterns = analyzeMemoryPatterns(filtered);

        console.log(`[memoryRecall] Retrieved memories for user ${userId}:`, {
          total: filtered.length,
          returned: recentMemories.length,
          traumaCount: patterns.traumaFrequency,
        });

        return res.status(200).json({
          success: true,
          memories: recentMemories,
          patterns: {
            mostCommonTimeframe: patterns.mostCommonTimeframe,
            traumaFrequency: patterns.traumaFrequency,
            topThemes: patterns.topThemes,
          },
        });
      } catch (error) {
        if (error instanceof z.ZodError) {
          console.error('[memoryRecall] Query validation error:', error.errors);
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
    console.error(`[memoryRecall] Method ${method} not allowed`);
    return res.status(405).json({ error: `Method ${method} not allowed` });

  } catch (error) {
    console.error('[memoryRecall] Unexpected error:', {
      message: error.message,
      stack: error.stack,
      method: req.method,
      url: req.url,
    });
    return res.status(500).json({
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}
