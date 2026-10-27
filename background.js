const DEFAULTS={reminders:false,reminderMinutes:60,encouragement:true,theme:'neon',resetOptions:['Breathe','Stretch','Music','Mindfulness','Affirmations','Outside'],preferredReset:'Breathe',focusMinutes:25,breakMinutes:5,priority:'easiest'};
async function syncReminders(){const {srSettings={}}=await chrome.storage.local.get('srSettings');const s={...DEFAULTS,...srSettings};await chrome.alarms.clear('studyResetBreak');if(s.reminders)chrome.alarms.create('studyResetBreak',{delayInMinutes:Math.max(1,Number(s.reminderMinutes)||60),periodInMinutes:Math.max(1,Number(s.reminderMinutes)||60)});}
chrome.runtime.onInstalled.addListener(syncReminders);
chrome.runtime.onStartup.addListener(syncReminders);
chrome.storage.onChanged.addListener((changes,area)=>{if(area==='local'&&changes.srSettings)syncReminders()});
chrome.alarms.onAlarm.addListener(async alarm=>{if(alarm.name!=='studyResetBreak')return;const {srSettings={}}=await chrome.storage.local.get('srSettings');if(!srSettings.reminders)return;await chrome.notifications.create('studyResetBreakNotice',{type:'basic',iconUrl:'icon.png',title:'Study Reset · Time for a check-in',message:'You’ve been working for a while. Want a quick reset?'});});
chrome.notifications.onClicked.addListener(id=>{if(id==='studyResetBreakNotice')chrome.action.openPopup().catch(()=>{});});
