const focusDurationInput = document.getElementById('focusDuration');
const shortBreakInput = document.getElementById('shortBreakDuration');
const longBreakInput = document.getElementById('longBreakDuration');
const cyclesUntilLongInput = document.getElementById('cyclesUntilLong');
const startPauseBtn = document.getElementById('startPauseBtn');
const resetBtn = document.getElementById('resetBtn');
const focusModeBtn = document.getElementById('focusModeBtn');
const cycleLabel = document.getElementById('cycleLabel');
const sessionCountLabel = document.getElementById('sessionCount');
const minutesLabel = document.getElementById('minutes');
const secondsLabel = document.getElementById('seconds');
const progressCircle = document.getElementById('progressCircle');
const totalSessionsLabel = document.getElementById('totalSessions');
const totalMinutesLabel = document.getElementById('totalMinutes');
const todayMinutesLabel = document.getElementById('todayMinutes');
const currentStreakLabel = document.getElementById('currentStreak');
const toast = document.getElementById('toast');

const RADIUS = 104;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
progressCircle.style.strokeDasharray = CIRCUMFERENCE;
progressCircle.style.strokeDashoffset = CIRCUMFERENCE;

const STORAGE_KEYS = {
  settings: 'focusflip-settings',
  stats: 'focusflip-stats'
};

const defaultSettings = {
  focus: 25,
  shortBreak: 5,
  longBreak: 20,
  cyclesUntilLong: 4
};

const defaultStats = {
  totalSessions: 0,
  totalMinutes: 0,
  todayMinutes: 0,
  currentStreak: 0,
  lastResetDate: new Date().toISOString().slice(0, 10)
};

const appState = {
  mode: 'focus',
  focusCyclesCompleted: 0,
  isRunning: false,
  remainingSeconds: defaultSettings.focus * 60,
  intervalId: null,
  stats: { ...defaultStats },
  settings: { ...defaultSettings }
};

function loadSettings() {
  const saved = localStorage.getItem(STORAGE_KEYS.settings);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      appState.settings = { ...defaultSettings, ...parsed };
    } catch (err) {
      console.warn('Invalid settings in storage', err);
    }
  }
}

function loadStats() {
  const saved = localStorage.getItem(STORAGE_KEYS.stats);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      const today = new Date().toISOString().slice(0, 10);
      appState.stats = { ...defaultStats, ...parsed };
      if (appState.stats.lastResetDate !== today) {
        appState.stats.todayMinutes = 0;
        appState.stats.lastResetDate = today;
        appState.stats.currentStreak = 0;
        saveStats();
      }
    } catch (err) {
      console.warn('Invalid stats in storage', err);
    }
  }
}

function saveSettings() {
  localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(appState.settings));
}

function saveStats() {
  localStorage.setItem(STORAGE_KEYS.stats, JSON.stringify(appState.stats));
}

function updateInputs() {
  focusDurationInput.value = appState.settings.focus;
  shortBreakInput.value = appState.settings.shortBreak;
  longBreakInput.value = appState.settings.longBreak;
  cyclesUntilLongInput.value = appState.settings.cyclesUntilLong;
}

function formatTime(totalSeconds) {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return {
    mins: String(mins).padStart(2, '0'),
    secs: String(secs).padStart(2, '0')
  };
}

function updateTimerDisplay() {
  const time = formatTime(appState.remainingSeconds);
  minutesLabel.textContent = time.mins;
  secondsLabel.textContent = time.secs;
}

function updateProgress() {
  const total = getCurrentDuration() * 60;
  const offset = CIRCUMFERENCE - (appState.remainingSeconds / total) * CIRCUMFERENCE;
  progressCircle.style.strokeDashoffset = offset;
  progressCircle.style.stroke = appState.mode === 'focus' ? '#7c5cff' : appState.mode === 'shortBreak' ? '#49d3f5' : '#6fcf97';
}

function updateStatsPanel() {
  totalSessionsLabel.textContent = appState.stats.totalSessions;
  totalMinutesLabel.textContent = appState.stats.totalMinutes;
  todayMinutesLabel.textContent = appState.stats.todayMinutes;
  currentStreakLabel.textContent = appState.stats.currentStreak;
}

function updateSessionLabel() {
  cycleLabel.textContent = appState.mode === 'focus' ? 'Fokus' : appState.mode === 'shortBreak' ? 'Istirahat Pendek' : 'Istirahat Panjang';
  sessionCountLabel.textContent = appState.focusCyclesCompleted + 1;
}

function getCurrentDuration() {
  if (appState.mode === 'focus') return appState.settings.focus;
  if (appState.mode === 'shortBreak') return appState.settings.shortBreak;
  return appState.settings.longBreak;
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('visible');
  clearTimeout(toast.hideTimer);
  toast.hideTimer = setTimeout(() => toast.classList.remove('visible'), 2800);
}

function requestNotificationPermission() {
  if (!('Notification' in window)) return;
  if (Notification.permission === 'default') {
    Notification.requestPermission();
  }
}

function sendNotification(title, body) {
  if (!('Notification' in window)) return;
  if (Notification.permission === 'granted') {
    new Notification(title, { body, badge: '', silent: true });
  }
}

function playFinishTone() {
  try {
    const context = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(880, context.currentTime);
    gain.gain.setValueAtTime(0.12, context.currentTime);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.12);
  } catch (error) {
    console.warn('Audio not supported', error);
  }
}

function switchCycle() {
  if (appState.mode === 'focus') {
    appState.focusCyclesCompleted += 1;
    appState.stats.totalSessions += 1;
    appState.stats.totalMinutes += appState.settings.focus;
    appState.stats.todayMinutes += appState.settings.focus;
    appState.stats.currentStreak += 1;
    const nextCycle = appState.focusCyclesCompleted % appState.settings.cyclesUntilLong === 0 ? 'longBreak' : 'shortBreak';
    appState.mode = nextCycle;
  } else {
    appState.mode = 'focus';
  }
  appState.remainingSeconds = getCurrentDuration() * 60;
  saveStats();
  updateSessionLabel();
  updateStatsPanel();
  updateTimerDisplay();
  updateProgress();
}

function finishCycle() {
  appState.isRunning = false;
  clearInterval(appState.intervalId);
  startPauseBtn.textContent = 'Mulai';
  const nextLabel = appState.mode === 'focus' ? 'Istirahat dimulai' : 'Waktunya fokus';
  const notificationLabel = appState.mode === 'focus' ? 'Fokus selesai!' : 'Istirahat selesai!';
  showToast(notificationLabel);
  sendNotification('FocusFlip', `${notificationLabel} ${nextLabel}.`);
  playFinishTone();
  switchCycle();
  autoStartNextCycle();
}

function autoStartNextCycle() {
  setTimeout(() => {
    if (appState.isRunning) return;
    startTimer();
  }, 800);
}

function tick() {
  if (appState.remainingSeconds <= 0) {
    finishCycle();
    return;
  }
  appState.remainingSeconds -= 1;
  updateTimerDisplay();
  updateProgress();
}

function startTimer() {
  if (appState.isRunning) return;
  appState.isRunning = true;
  startPauseBtn.textContent = 'Jeda';
  appState.intervalId = setInterval(tick, 1000);
}

function pauseTimer() {
  appState.isRunning = false;
  startPauseBtn.textContent = 'Lanjutkan';
  clearInterval(appState.intervalId);
}

function resetTimer() {
  appState.isRunning = false;
  clearInterval(appState.intervalId);
  appState.mode = 'focus';
  appState.focusCyclesCompleted = 0;
  appState.remainingSeconds = appState.settings.focus * 60;
  startPauseBtn.textContent = 'Mulai';
  updateSessionLabel();
  updateTimerDisplay();
  updateProgress();
  showToast('Timer direset.');
}

function onStartPause() {
  if (appState.isRunning) {
    pauseTimer();
    return;
  }
  startTimer();
}

function onSettingsChange() {
  appState.settings.focus = Math.max(1, Number(focusDurationInput.value) || defaultSettings.focus);
  appState.settings.shortBreak = Math.max(1, Number(shortBreakInput.value) || defaultSettings.shortBreak);
  appState.settings.longBreak = Math.max(1, Number(longBreakInput.value) || defaultSettings.longBreak);
  appState.settings.cyclesUntilLong = Math.max(2, Number(cyclesUntilLongInput.value) || defaultSettings.cyclesUntilLong);
  saveSettings();
  if (!appState.isRunning) {
    appState.remainingSeconds = getCurrentDuration() * 60;
    updateTimerDisplay();
    updateProgress();
  }
}

function toggleFocusMode() {
  const body = document.body;
  const isFullscreen = body.classList.toggle('fullscreen-focus');
  focusModeBtn.textContent = isFullscreen ? 'Keluar Fokus' : 'Mode Fokus';
  if (isFullscreen && document.documentElement.requestFullscreen) {
    document.documentElement.requestFullscreen().catch(() => {});
  }
  if (!isFullscreen && document.fullscreenElement) {
    document.exitFullscreen().catch(() => {});
  }
}

function init() {
  loadSettings();
  loadStats();
  updateInputs();
  appState.remainingSeconds = appState.settings.focus * 60;
  updateTimerDisplay();
  updateProgress();
  updateSessionLabel();
  updateStatsPanel();
  requestNotificationPermission();

  startPauseBtn.addEventListener('click', onStartPause);
  resetBtn.addEventListener('click', resetTimer);
  focusModeBtn.addEventListener('click', toggleFocusMode);
  [focusDurationInput, shortBreakInput, longBreakInput, cyclesUntilLongInput].forEach((input) => {
    input.addEventListener('change', onSettingsChange);
    input.addEventListener('input', onSettingsChange);
  });
  document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement) {
      document.body.classList.remove('fullscreen-focus');
      focusModeBtn.textContent = 'Mode Fokus';
    }
  });
}

init();
