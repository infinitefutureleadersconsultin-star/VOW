/**
 * Vow of the Day Quotes & Wisdom
 * Motivational quotes aligned with VOW Theory
 */

/**
 * VOW Theory quotes organized by principle
 */
export const QUOTES = {
  pacification: [
    { text: "Observe without judgment. Acceptance is not surrender—it's awareness.", author: "VOW Theory" },
    { text: "The pattern existed before you saw it. Seeing it is the first step to freedom.", author: "VOW Theory" },
    { text: "You cannot fight what you refuse to acknowledge.", author: "The Pacification Paradox™" },
    { text: "Peace comes from sitting with truth, not battling it.", author: "VOW Theory" },
    { text: "The behavior protected you once. Now awareness will guide you.", author: "VOW Theory" }
  ],
  
  confrontation: [
    { text: "The why lives beneath the what. Find it without fear.", author: "The Confrontational Model™" },
    { text: "You are not your trauma. You are who you became to survive it.", author: "VOW Theory" },
    { text: "Face the origin, not to relive it, but to understand it.", author: "VOW Theory" },
    { text: "What hurt you once cannot hurt you again—unless you refuse to see it.", author: "The Confrontational Model™" },
    { text: "The truth about your pattern will set you free.", author: "VOW Theory" }
  ],
  
  integration: [
    { text: "You were whole before. You are becoming whole again.", author: "The Integration Cycle™" },
    { text: "Remembering who you were means becoming who you are.", author: "VOW Theory" },
    { text: "The healed self and the original self are one.", author: "The Integration Cycle™" },
    { text: "Integration is not forgetting—it's unifying.", author: "VOW Theory" },
    { text: "Who you were + who you became = who you truly are.", author: "VOW Theory" }
  ],
  
  remembrance: [
    { text: "Daily remembrance creates permanent change.", author: "The Law of Daily Remembrance™" },
    { text: "Your vow is not a rule. It's a reminder of who you are.", author: "VOW Theory" },
    { text: "Consistency, not perfection, is the path to liberation.", author: "VOW Theory" },
    { text: "Every day you remember is a day you return to yourself.", author: "The Law of Daily Remembrance™" },
    { text: "The vow you keep is the self you reclaim.", author: "VOW Theory" }
  ],
  
  general: [
    { text: "Awareness without action is observation. Action without awareness is reaction.", author: "VOW Theory" },
    { text: "You are not broken. You adapted. Now you can transform.", author: "VOW Theory" },
    { text: "Every trigger is a teacher if you choose to listen.", author: "VOW Theory" },
    { text: "Your identity is not your behavior. Remember this daily.", author: "VOW Theory" },
    { text: "The person you're becoming has always existed within you.", author: "VOW Theory" }
  ]
};

/**
 * Get random quote from a category
 */
export function getRandomQuote(category = 'general') {
  const categoryQuotes = QUOTES[category] || QUOTES.general;
  return categoryQuotes[Math.floor(Math.random() * categoryQuotes.length)];
}

/**
 * Get quote of the day (consistent for each day)
 */
export function getQuoteOfTheDay() {
  // Use date as seed for consistent daily quote
  const today = new Date().toDateString();
  const seed = today.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  const allQuotes = Object.values(QUOTES).flat();
  const index = seed % allQuotes.length;
  
  return allQuotes[index];
}

/**
 * Get quote by stage
 */
export function getQuoteByStage(stage) {
  const stageMap = {
    pacification: 'pacification',
    confrontation: 'confrontation',
    integration: 'integration'
  };
  
  const category = stageMap[stage] || 'general';
  return getRandomQuote(category);
}

/**
 * Get motivational quote for streak milestone
 */
export function getStreakQuote(days) {
  const milestoneQuotes = {
    1: { text: "One day at a time. You've started the journey.", author: "VOW Theory" },
    7: { text: "Seven days of remembrance. You're building momentum.", author: "VOW Theory" },
    30: { text: "Thirty days of consistency. Neural pathways are forming.", author: "VOW Theory" },
    90: { text: "Ninety days of transformation. You are not who you were.", author: "VOW Theory" },
    365: { text: "Three hundred sixty-five days of remembrance. You are liberated.", author: "VOW Theory" }
  };
  
  return milestoneQuotes[days] || { 
    text: `${days} days of remembrance. Keep going.`, 
    author: "VOW Theory" 
  };
}

/**
 * Get quote for first vow
 */
export function getFirstVowQuote() {
  return {
    text: "Your first vow is your declaration: I choose awareness over avoidance.",
    author: "VOW Theory"
  };
}

/**
 * Get quote for completing a vow
 */
export function getCompletionQuote() {
  const completionQuotes = [
    { text: "You kept your word to yourself. That is true power.", author: "VOW Theory" },
    { text: "Completion is not the end. It's evidence you've changed.", author: "VOW Theory" },
    { text: "You remembered who you are for every single day. This is mastery.", author: "VOW Theory" }
  ];
  
  return completionQuotes[Math.floor(Math.random() * completionQuotes.length)];
}

/**
 * Get quote for trigger moment
 */
export function getTriggerQuote() {
  const triggerQuotes = [
    { text: "This trigger is information, not failure. Observe it.", author: "VOW Theory" },
    { text: "You felt the pull and noticed it. That is progress.", author: "VOW Theory" },
    { text: "Every trigger you log is a pattern you're learning to break.", author: "VOW Theory" }
  ];
  
  return triggerQuotes[Math.floor(Math.random() * triggerQuotes.length)];
}

/**
 * Get quote for reflection
 */
export function getReflectionQuote(stage) {
  if (stage === 'pacification') {
    return { text: "Sit with what you observe. No judgment, only awareness.", author: "VOW Theory" };
  }
  if (stage === 'confrontation') {
    return { text: "Face the why with courage. Understanding heals.", author: "VOW Theory" };
  }
  if (stage === 'integration') {
    return { text: "You are remembering who you were and who you are becoming.", author: "VOW Theory" };
  }
  return getRandomQuote('general');
}

/**
 * Get quote for grace period
 */
export function getGraceQuote() {
  return {
    text: "Grace is not permission to forget. It's space to remember gently.",
    author: "VOW Theory"
  };
}

/**
 * Get all quotes for a category
 */
export function getAllQuotes(category = null) {
  if (category && QUOTES[category]) {
    return QUOTES[category];
  }
  return Object.values(QUOTES).flat();
}

/**
 * Search quotes by keyword
 */
export function searchQuotes(keyword) {
  const allQuotes = getAllQuotes();
  const lowerKeyword = keyword.toLowerCase();
  
  return allQuotes.filter(quote => 
    quote.text.toLowerCase().includes(lowerKeyword) ||
    quote.author.toLowerCase().includes(lowerKeyword)
  );
}

/**
 * Get formatted quote for display
 */
export function formatQuote(quote) {
  if (!quote) return '';
  return `"${quote.text}"\n— ${quote.author}`;
}

/**
 * Get quote for time of day
 */
export function getTimeBasedQuote() {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 12) {
    // Morning
    return { 
      text: "Begin your day with intention. Who will you remember to be today?", 
      author: "VOW Theory" 
    };
  } else if (hour >= 12 && hour < 17) {
    // Afternoon
    return { 
      text: "The day is not finished. Neither is your practice.", 
      author: "VOW Theory" 
    };
  } else if (hour >= 17 && hour < 21) {
    // Evening
    return { 
      text: "Reflect without judgment. What did today teach you?", 
      author: "VOW Theory" 
    };
  } else {
    // Night
    return { 
      text: "Rest is part of remembrance. Tomorrow you begin again.", 
      author: "VOW Theory" 
    };
  }
}

/**
 * Get inspirational quote for upgrade prompt
 */
export function getUpgradeQuote() {
  return {
    text: "Investment in your healing is investment in who you're becoming.",
    author: "VOW Theory"
  };
}
