export function canUseAI(u,f){const k="ai_"+u+"_"+new Date().toISOString().split("T")[0];const usage=JSON.parse(localStorage.getItem(k)||"{}");return(usage[f]||0)<3}
