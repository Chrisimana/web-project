class StopwatchApp {
    constructor() {
        // State
        this.isRunning = false;
        this.isPaused = false;
        this.totalTime = 0; // in milliseconds
        this.laps = [];
        this.startTime = null;
        this.pausedTime = 0;
        this.intervalId = null;

        // DOM Elements
        this.minutesDisplay = document.getElementById('minutes');
        this.secondsDisplay = document.getElementById('seconds');
        this.millisecondsDisplay = document.getElementById('milliseconds');
        this.statusBadge = document.getElementById('statusBadge');
        this.statusDot = this.statusBadge.querySelector('.status-dot');
        this.statusText = this.statusBadge.querySelector('.status-text');
        
        this.startBtn = document.getElementById('startBtn');
        this.pauseBtn = document.getElementById('pauseBtn');
        this.lapBtn = document.getElementById('lapBtn');
        this.resetBtn = document.getElementById('resetBtn');
        
        this.lapCountDisplay = document.getElementById('lapCount');
        this.fastestLapDisplay = document.getElementById('fastestLap');
        this.avgLapTimeDisplay = document.getElementById('avgLapTime');
        
        this.lapsList = document.getElementById('lapsList');
        this.exportBtn = document.getElementById('exportBtn');
        this.clearLapsBtn = document.getElementById('clearLapsBtn');

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateDisplay();
    }

    setupEventListeners() {
        // Button Events
        this.startBtn.addEventListener('click', () => this.start());
        this.pauseBtn.addEventListener('click', () => this.pause());
        this.lapBtn.addEventListener('click', () => this.recordLap());
        this.resetBtn.addEventListener('click', () => this.reset());
        this.exportBtn.addEventListener('click', () => this.exportLaps());
        this.clearLapsBtn.addEventListener('click', () => this.clearLaps());

        // Keyboard Events
        document.addEventListener('keydown', (e) => {
            if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault();
                if (this.isRunning) {
                    this.pause();
                } else {
                    this.start();
                }
            } else if (e.key.toLowerCase() === 'l' && this.isRunning) {
                this.recordLap();
            } else if (e.key.toLowerCase() === 'r') {
                this.reset();
            }
        });
    }

    start() {
        if (this.isRunning) return;

        this.isRunning = true;
        this.isPaused = false;
        this.startTime = Date.now() - this.pausedTime;

        // Update UI
        this.startBtn.disabled = true;
        this.pauseBtn.disabled = false;
        this.lapBtn.disabled = false;
        this.startBtn.style.gridColumn = 'unset';
        
        this.updateStatusBadge('BERJALAN', 'running');

        // Start the interval
        this.intervalId = setInterval(() => this.updateDisplay(), 10);
    }

    pause() {
        if (!this.isRunning) return;

        this.isRunning = false;
        this.isPaused = true;
        this.pausedTime = this.totalTime;
        clearInterval(this.intervalId);

        // Update UI
        this.startBtn.disabled = false;
        this.pauseBtn.disabled = true;
        this.startBtn.style.gridColumn = 'unset';
        
        this.updateStatusBadge('DIJEDA', 'paused');
    }

    recordLap() {
        if (!this.isRunning && !this.isPaused) return;

        const lapTime = this.totalTime;
        
        const lap = {
            number: this.laps.length + 1,
            time: lapTime,
            timestamp: new Date()
        };

        // Calculate delta from previous lap
        if (this.laps.length > 0) {
            const prevLapTime = this.laps[this.laps.length - 1].time;
            lap.delta = lapTime - prevLapTime;
        } else {
            lap.delta = lapTime;
        }

        this.laps.push(lap);
        this.updateLapsDisplay();
        this.updateStats();
        this.clearLapsBtn.disabled = false;

        // Add visual feedback
        this.addLapAnimation();
    }

    reset() {
        clearInterval(this.intervalId);
        this.isRunning = false;
        this.isPaused = false;
        this.totalTime = 0;
        this.pausedTime = 0;
        this.startTime = null;

        // Update UI
        this.startBtn.disabled = false;
        this.pauseBtn.disabled = true;
        this.lapBtn.disabled = true;
        this.startBtn.style.gridColumn = 'unset';

        this.updateDisplay();
        this.updateStatusBadge('BERHENTI', 'stopped');
    }

    updateDisplay() {
        if (this.isRunning) {
            this.totalTime = Date.now() - this.startTime;
        }

        const { minutes, seconds, milliseconds } = this.formatTime(this.totalTime);

        this.minutesDisplay.textContent = this.pad(minutes, 2);
        this.secondsDisplay.textContent = this.pad(seconds, 2);
        this.millisecondsDisplay.textContent = this.pad(milliseconds, 2);
    }

    updateStatusBadge(text, state) {
        this.statusText.textContent = text;
        this.statusDot.className = `status-dot ${state}`;
    }

    updateLapsDisplay() {
        this.lapsList.innerHTML = '';

        if (this.laps.length === 0) {
            this.lapsList.innerHTML = '<div class="empty-state"><p>Tidak ada lap records. Mulai stopwatch dan tekan Lap! 🚀</p></div>';
            return;
        }

        // Find fastest and slowest laps
        const lapTimes = this.laps.map(lap => lap.delta || lap.time);
        const fastestTime = Math.min(...lapTimes);
        const slowestTime = Math.max(...lapTimes);

        // Display laps in reverse (newest first)
        [...this.laps].reverse().forEach((lap, index) => {
            const lapItem = this.createLapElement(lap, fastestTime, slowestTime);
            this.lapsList.appendChild(lapItem);
        });
    }

    createLapElement(lap, fastestTime, slowestTime) {
        const div = document.createElement('div');
        div.className = 'lap-item';

        const lapTimeToCompare = lap.delta || lap.time;
        if (lapTimeToCompare === fastestTime) {
            div.classList.add('fastest');
        } else if (lapTimeToCompare === slowestTime && this.laps.length > 1) {
            div.classList.add('slowest');
        }

        const { minutes: m, seconds: s, milliseconds: ms } = this.formatTime(lapTimeToCompare);
        const timeStr = `${this.pad(m, 2)}:${this.pad(s, 2)}.${this.pad(ms, 2)}`;

        let deltaStr = '';
        let deltaClass = '';
        if (lap.delta) {
            const { minutes: dm, seconds: ds, milliseconds: dms } = this.formatTime(lap.delta);
            deltaStr = `${this.pad(dm, 2)}:${this.pad(ds, 2)}.${this.pad(dms, 2)}`;
            
            if (this.laps.length > 1) {
                const prevLapTime = this.laps[this.laps.indexOf(lap) - 1]?.delta || 
                                   this.laps[this.laps.indexOf(lap) - 1]?.time ||
                                   lapTimeToCompare;
                if (lapTimeToCompare < prevLapTime) {
                    deltaClass = 'faster';
                    deltaStr += ' ⬆️';
                } else if (lapTimeToCompare > prevLapTime) {
                    deltaClass = 'slower';
                    deltaStr += ' ⬇️';
                }
            }
        }

        div.innerHTML = `
            <div class="lap-number">Lap #${lap.number}</div>
            <div class="lap-details">
                <span class="lap-time">${timeStr}</span>
                ${deltaStr ? `<span class="lap-delta ${deltaClass}">Δ ${deltaStr}</span>` : ''}
            </div>
            <button class="lap-remove" onclick="app.removeLap(${lap.number - 1})">Hapus</button>
        `;

        return div;
    }

    removeLap(index) {
        this.laps.splice(index, 1);
        // Renumber laps
        this.laps.forEach((lap, i) => {
            lap.number = i + 1;
        });
        this.updateLapsDisplay();
        this.updateStats();
        if (this.laps.length === 0) {
            this.clearLapsBtn.disabled = true;
        }
    }

    updateStats() {
        // Update lap count
        this.lapCountDisplay.textContent = this.laps.length;

        if (this.laps.length === 0) {
            this.fastestLapDisplay.textContent = '--:--:--';
            this.avgLapTimeDisplay.textContent = '--:--:--';
            return;
        }

        // Calculate fastest lap
        const lapTimes = this.laps.map(lap => lap.delta || lap.time);
        const fastestTime = Math.min(...lapTimes);
        const { minutes: fm, seconds: fs, milliseconds: fms } = this.formatTime(fastestTime);
        this.fastestLapDisplay.textContent = `${this.pad(fm, 2)}:${this.pad(fs, 2)}:${this.pad(fms, 2)}`;

        // Calculate average lap time
        const avgTime = lapTimes.reduce((a, b) => a + b, 0) / lapTimes.length;
        const { minutes: am, seconds: as, milliseconds: ams } = this.formatTime(avgTime);
        this.avgLapTimeDisplay.textContent = `${this.pad(am, 2)}:${this.pad(as, 2)}:${this.pad(ams, 2)}`;
    }

    clearLaps() {
        if (confirm('Apakah Anda yakin ingin menghapus semua lap records?')) {
            this.laps = [];
            this.updateLapsDisplay();
            this.updateStats();
            this.clearLapsBtn.disabled = true;
        }
    }

    exportLaps() {
        if (this.laps.length === 0) {
            alert('Tidak ada lap records untuk diexport!');
            return;
        }

        // Create CSV content
        let csvContent = 'Lap Number,Lap Time,Delta Time,Timestamp\n';
        
        this.laps.forEach(lap => {
            const lapTime = this.formatTimeToString(lap.delta || lap.time);
            const deltaTime = lap.delta ? this.formatTimeToString(lap.delta) : '-';
            const timestamp = lap.timestamp.toLocaleString();
            csvContent += `${lap.number},"${lapTime}","${deltaTime}","${timestamp}"\n`;
        });

        // Create blob and download
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `stopwatch-laps-${new Date().toISOString().slice(0, 10)}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        alert('Lap records berhasil diexport! 📥');
    }

    addLapAnimation() {
        const lapBtn = this.lapBtn;
        lapBtn.style.animation = 'none';
        setTimeout(() => {
            lapBtn.style.animation = 'pulse 0.5s ease-out';
        }, 10);
    }

    formatTime(ms) {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        const milliseconds = Math.floor((ms % 1000) / 10); // Convert to centiseconds (0-99)

        return { minutes, seconds, milliseconds };
    }

    formatTimeToString(ms) {
        const { minutes, seconds, milliseconds } = this.formatTime(ms);
        return `${this.pad(minutes, 2)}:${this.pad(seconds, 2)}.${this.pad(milliseconds, 2)}`;
    }

    pad(num, length = 2) {
        return String(num).padStart(length, '0');
    }
}

// Initialize app when DOM is ready
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new StopwatchApp();
});
