export function canUseAI(userId, feature) {
  const today = new Date().toISOString().split('T')[0];
  const key = 'ai_' + userId + '_' + today;
  const usage = JSON.parse(localStorage.getItem(key) || '{}');
  const limits = { reflection: 3, vow: 1 };
  return (usage[feature] || 0) < limits[feature];
}

export function trackAIUsage(userId, feature) {
  const today = new Date().toISOString().split('T')[0];
  const key = 'ai_' + userId + '_' + today;
  const usage = JSON.parse(localStorage.getItem(key) || '{}');
  usage[feature] = (usage[feature] || 0) + 1;
  localStorage.setItem(key, JSON.stringify(usage));
  return usage[feature];
}

export function getAIUsageMessage(feature, remaining) {
  const messages = {
    reflection: remaining > 0 ? `${remaining} AI insights remaining today` : 'Daily AI limit reached. Beautiful work today! 🌙',
    vow: remaining > 0 ? 'AI guidance available' : 'Review yesterday\'s guidance anytime 📿'
  };
  return messages[feature] || '';
}
