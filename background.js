chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'pomodoro') {
    chrome.storage.local.get(['mode'], (data) => {
      const mode = data.mode || 'focus';
      const messages = {
        focus: '🌱 집중 완료! 휴식 시간이에요.',
        short: '☕ 짧은 휴식 끝! 다시 집중해볼까요?',
        long: '🌳 긴 휴식 끝! 새 세션을 시작해요.',
      };
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon128.png',
        title: '🌱 뽀모도로',
        message: messages[mode] || messages.focus,
        priority: 2,
      });
    });
  }
});
