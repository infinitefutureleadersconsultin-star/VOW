// pages/api/vowAnalysis.js
// AI-Powered Vow Analysis & Suggestions API
// Detects combat language, suggests reframing, provides compassionate coaching

import { verifyToken } from '../../utils/apiClient';
import { z } from 'zod';

// ============================================
// VALIDATION SCHEMAS
// ============================================

const analyzeVowSchema = z.object({
  vowText: z.string().min(5, 'Vow must be at least 5 characters').max(500, 'Vow too long'),
  vowType: z.enum(['addiction', 'health', 'relationship', 'focus', 'character', 'custom']).optional(),
  context: z.string().max(1000).optional(),
});

const getSuggestionsSchema = z.object({
  vowId: z.string().min(1, 'Vow ID required'),
  recentTriggers: z.number().min(0).max(50).optional(),
  includeReframe: z.boolean().optional(),
});

const reframeVowSchema = z.object({
  originalVow: z.string().min(5).max(500),
  reason: z.string().max(200).optional(),
});

// ============================================
// COMBAT LANGUAGE DETECTION
// ============================================

const COMBAT_WORDS = [
  'fight', 'battle', 'war', 'attack', 'defeat', 'destroy', 'kill', 'crush',
  'conquer', 'beat', 'overcome', 'resist', 'struggle', 'combat', 'enemy',
  'weapon', 'armor', 'defend', 'guard', 'warrior', 'soldier', 'fighting'
];

const REMEMBRANCE_WORDS = [
  'remember', 'observe', 'notice', 'aware', 'conscious', 'mindful', 'present',
  'return', 'rebuild', 'restore', 'repair', 'renew', 'align', 'integrate',
  'become', 'embody', 'honor', 'respect', 'commit', 'promise', 'vow'
];

function detectCombatLanguage(text) {
  const lowerText = text.toLowerCase();
  const foundCombatWords = COMBAT_WORDS.filter(word => 
    lowerText.includes(word)
  );
  
  const hasCombatLanguage = foundCombatWords.length > 0;
  const severity = foundCombatWords.length >= 3 ? 'high' : 
                   foundCombatWords.length >= 2 ? 'medium' : 'low';

  return {
    hasCombatLanguage,
    severity,
    foundWords: foundCombatWords,
    wordCount: foundCombatWords.length,
  };
}

function detectRemembranceLanguage(text) {
  const lowerText = text.toLowerCase();
  const foundWords = REMEMBRANCE_WORDS.filter(word => 
    lowerText.includes(word)
  );
  
  return {
    hasRemembrance: foundWords.length > 0,
    foundWords,
    wordCount: foundWords.length,
  };
}

// ============================================
// VOW STRUCTURE ANALYSIS
// ============================================

function analyzeVowStructure(text) {
  // Check for "I am the type of person" structure
  const hasIdentityStatement = /i am (the )?type of person/i.test(text);
  const hasTherefore = /therefore/i.test(text);
  const hasNeverAlways = /(never|always)/i.test(text);
  const hasAgain = /again/i.test(text);

  const isProperStructure = hasIdentityStatement && hasTherefore && 
                            (hasNeverAlways || hasAgain);

  return {
    isProperStructure,
    hasIdentityStatement,
    hasTherefore,
    hasNeverAlways,
    hasAgain,
    structureScore: [
      hasIdentityStatement,
      hasTherefore,
      hasNeverAlways || hasAgain
    ].filter(Boolean).length,
  };
}

// ============================================
// REFRAMING SUGGESTIONS
// ============================================

function generateReframeSuggestions(vow, combatAnalysis) {
  const suggestions = [];

  if (combatAnalysis.hasCombatLanguage) {
    // Create reframe suggestions for each combat word
    combatAnalysis.foundWords.forEach(word => {
      const replacement = getCombatReplacement(word);
      if (replacement) {
        suggestions.push({
          type: 'word_replacement',
          original: word,
          suggested: replacement.word,
          reason: replacement.reason,
          example: vow.replace(new RegExp(word, 'gi'), replacement.word),
        });
      }
    });

    // Add general reframe suggestion
    suggestions.push({
      type: 'general_reframe',
      message: 'Consider shifting from resistance to remembrance. Instead of fighting the urge, observe it and return to your vow.',
      principle: 'Healing is not warfare; it is restoration of identity through conscious remembrance.',
    });
  }

  return suggestions;
}

function getCombatReplacement(word) {
  const replacements = {
    'fight': { word: 'observe', reason: 'Observation creates awareness without conflict' },
    'battle': { word: 'remember', reason: 'Remembrance anchors you to your vow' },
    'war': { word: 'journey', reason: 'Your path is transformation, not combat' },
    'attack': { word: 'notice', reason: 'Notice the urge without engaging it' },
    'defeat': { word: 'return to', reason: 'Return to who you are becoming' },
    'destroy': { word: 'release', reason: 'Release what no longer serves you' },
    'beat': { word: 'honor', reason: 'Honor your commitment through awareness' },
    'overcome': { word: 'integrate', reason: 'Integrate the lesson without struggle' },
    'resist': { word: 'acknowledge', reason: 'Acknowledge the urge and choose differently' },
    'struggle': { word: 'practice', reason: 'Practice presence and conscious choice' },
    'enemy': { word: 'teacher', reason: 'Each urge teaches you about yourself' },
    'conquer': { word: 'embody', reason: 'Embody the identity you are becoming' },
  };

  return replacements[word.toLowerCase()];
}

// ============================================
// COMPASSIONATE COACHING
// ============================================

function generateCoachingResponse(vow, structure, combat, remembrance) {
  const responses = [];

  // Structure feedback
  if (structure.isProperStructure) {
    responses.push({
      type: 'structure',
      tone: 'positive',
      message: 'Your vow follows the proper structure: "I am the type of person that..., therefore I will..."',
    });
  } else {
    responses.push({
      type: 'structure',
      tone: 'guidance',
      message: 'Consider restructuring your vow: "I am the type of person that [identity], therefore I will [never/always] [behavior] again."',
      example: 'I am the type of person that values my health, therefore I will never smoke again.',
    });
  }

  // Combat language feedback
  if (combat.hasCombatLanguage) {
    responses.push({
      type: 'language',
      tone: 'gentle_correction',
      message: `I noticed ${combat.wordCount} word${combat.wordCount > 1 ? 's' : ''} that frame this as a battle: ${combat.foundWords.join(', ')}. Remember: healing is not warfare.`,
      suggestion: 'Consider language that emphasizes observation and remembrance instead of conflict.',
    });
  }

  // Remembrance language feedback
  if (remembrance.hasRemembrance) {
    responses.push({
      type: 'language',
      tone: 'positive',
      message: `Your vow uses remembrance language (${remembrance.foundWords.slice(0, 3).join(', ')}). This aligns with conscious awareness.`,
    });
  }

  // General encouragement
  responses.push({
    type: 'encouragement',
    tone: 'supportive',
    message: 'Every vow is a promise to yourself. Honor it through daily remembrance, not through struggle.',
  });

  return responses;
}

// ============================================
// MOCK DATABASE
// ============================================

const vowAnalyses = new Map(); // vowId -> analysis

// ============================================
// API HANDLER
// ============================================

export default async function handler(req, res) {
  const { method } = req;

  try {
    // Authenticate user
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error('[vowAnalysis] Missing or invalid auth header');
      return res.status(401).json({ error: 'Authentication required' });
    }

    const token = authHeader.substring(7);
    let userId;
    try {
      const decoded = verifyToken(token);
      userId = decoded.userId;
    } catch (error) {
      console.error('[vowAnalysis] Token verification failed:', error.message);
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    // ============================================
    // POST: Analyze a vow
    // ============================================
    if (method === 'POST' && req.url.includes('/analyze')) {
      try {
        const validated = analyzeVowSchema.parse(req.body);

        // Perform analysis
        const combat = detectCombatLanguage(validated.vowText);
        const remembrance = detectRemembranceLanguage(validated.vowText);
        const structure = analyzeVowStructure(validated.vowText);
        const coaching = generateCoachingResponse(
          validated.vowText, 
          structure, 
          combat, 
          remembrance
        );
        const reframes = generateReframeSuggestions(validated.vowText, combat);

        // Calculate overall score
        const languageScore = remembrance.wordCount - combat.wordCount;
        const overallScore = Math.max(0, Math.min(100, 
          (structure.structureScore * 25) + 
          (languageScore * 10) + 
          50
        ));

        const analysis = {
          vowText: validated.vowText,
          timestamp: Date.now(),
          structure,
          combatLanguage: combat,
          remembranceLanguage: remembrance,
          overallScore: Math.round(overallScore),
          coaching,
          reframeSuggestions: reframes,
        };

        console.log(`[vowAnalysis] Analyzed vow for user ${userId}:`, {
          structureScore: structure.structureScore,
          combatWords: combat.wordCount,
          remembranceWords: remembrance.wordCount,
          overallScore: analysis.overallScore,
        });

        return res.status(200).json({
          success: true,
          analysis,
        });
      } catch (error) {
        if (error instanceof z.ZodError) {
          console.error('[vowAnalysis] Validation error:', error.errors);
          return res.status(400).json({
            error: 'Validation failed',
            details: error.errors,
          });
        }
        throw error;
      }
    }

    // ============================================
    // POST: Reframe a vow
    // ============================================
    if (method === 'POST' && req.url.includes('/reframe')) {
      try {
        const validated = reframeVowSchema.parse(req.body);

        const combat = detectCombatLanguage(validated.originalVow);
        let reframedVow = validated.originalVow;

        // Apply automatic reframing
        combat.foundWords.forEach(word => {
          const replacement = getCombatReplacement(word);
          if (replacement) {
            reframedVow = reframedVow.replace(
              new RegExp(`\\b${word}\\b`, 'gi'), 
              replacement.word
            );
          }
        });

        // Ensure proper structure
        const structure = analyzeVowStructure(reframedVow);
        if (!structure.isProperStructure) {
          // Suggest structure template
          reframedVow = `I am the type of person that [values/believes in...], therefore I will [never/always] [behavior] again.`;
        }

        console.log(`[vowAnalysis] Reframed vow for user ${userId}:`, {
          originalLength: validated.originalVow.length,
          reframedLength: reframedVow.length,
          combatWordsReplaced: combat.wordCount,
        });

        return res.status(200).json({
          success: true,
          original: validated.originalVow,
          reframed: reframedVow,
          changes: combat.foundWords.map(word => ({
            from: word,
            to: getCombatReplacement(word)?.word || word,
          })),
          reason: validated.reason || 'Reframed to emphasize remembrance over resistance',
        });
      } catch (error) {
        if (error instanceof z.ZodError) {
          console.error('[vowAnalysis] Validation error:', error.errors);
          return res.status(400).json({
            error: 'Validation failed',
            details: error.errors,
          });
        }
        throw error;
      }
    }

    // ============================================
    // GET: Get suggestions for a vow
    // ============================================
    if (method === 'GET') {
      try {
        const validated = getSuggestionsSchema.parse(req.query);

        // Generate contextual suggestions based on vow performance
        const suggestions = [
          {
            type: 'daily_practice',
            message: 'Read your vow aloud each morning. Hearing your own voice strengthens commitment.',
            priority: 'high',
          },
          {
            type: 'trigger_awareness',
            message: 'Log each urge without judgment. Awareness is the first step to transformation.',
            priority: 'medium',
          },
          {
            type: 'identity_alignment',
            message: 'When tempted, ask: "Is this who I am becoming?" Let identity guide behavior.',
            priority: 'medium',
          },
        ];

        console.log(`[vowAnalysis] Generated suggestions for vow ${validated.vowId}`);

        return res.status(200).json({
          success: true,
          vowId: validated.vowId,
          suggestions,
        });
      } catch (error) {
        if (error instanceof z.ZodError) {
          console.error('[vowAnalysis] Query validation error:', error.errors);
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
    console.error(`[vowAnalysis] Method ${method} not allowed`);
    return res.status(405).json({ error: `Method ${method} not allowed` });

  } catch (error) {
    console.error('[vowAnalysis] Unexpected error:', {
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
