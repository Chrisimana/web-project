(function() {
    // DOM Elements
    const clockTimeElement = document.getElementById('clockTime');
    const dateInfoElement = document.getElementById('dateInfo');
    const mode24Btn = document.getElementById('mode24Btn');
    const mode12Btn = document.getElementById('mode12Btn');
    const formatBadge = document.getElementById('formatBadge');

    // State
    let is24HourFormat = true;
    let intervalId = null;
    let lastSecond = -1;

    // Helper functions
    function formatTwoDigits(num) {
        return num < 10 ? '0' + num : num;
    }

    function get12HourTime(hours, minutes, seconds) {
        let period = hours >= 12 ? 'PM' : 'AM';
        let hour12 = hours % 12;
        if (hour12 === 0) hour12 = 12;
        const formattedHour = formatTwoDigits(hour12);
        const formattedMin = formatTwoDigits(minutes);
        const formattedSec = formatTwoDigits(seconds);
        return `${formattedHour}:${formattedMin}:${formattedSec} ${period}`;
    }

    function updateButtonsAndBadge() {
        if (is24HourFormat) {
            mode24Btn.classList.add('active');
            mode12Btn.classList.remove('active');
            formatBadge.innerHTML = '🕒 Mode: 24 Jam (24h)';
            formatBadge.style.color = '#9efff0';
        } else {
            mode12Btn.classList.add('active');
            mode24Btn.classList.remove('active');
            formatBadge.innerHTML = '🕛 Mode: 12 Jam (AM/PM)';
            formatBadge.style.color = '#f9d371';
        }
    }

    function updateDateInfo() {
        const now = new Date();
        const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
        
        const dayName = days[now.getDay()];
        const dayDate = now.getDate();
        const monthName = months[now.getMonth()];
        const year = now.getFullYear();
        
        dateInfoElement.innerHTML = `<span>📅 ${dayName}, ${dayDate} ${monthName} ${year}</span>`;
    }

    function updateTime() {
        const now = new Date();
        let hours = now.getHours();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();
        
        let timeString = '';
        if (is24HourFormat) {
            timeString = `${formatTwoDigits(hours)}:${formatTwoDigits(minutes)}:${formatTwoDigits(seconds)}`;
        } else {
            timeString = get12HourTime(hours, minutes, seconds);
        }
        
        clockTimeElement.textContent = timeString;
    }

    function addBlinkEffect() {
        const now = new Date();
        const sec = now.getSeconds();
        if (sec !== lastSecond) {
            lastSecond = sec;
            
            const displayDiv = document.querySelector('.digital-display');
            if (displayDiv) {
                displayDiv.style.transition = 'box-shadow 0.08s linear';
                displayDiv.style.boxShadow = 'inset 0 0 20px rgba(0, 255, 255, 0.6), 0 12px 28px rgba(0, 0, 0, 0.5)';
                setTimeout(() => {
                    if (displayDiv) {
                        displayDiv.style.boxShadow = 'inset 0 0 18px rgba(0, 255, 255, 0.2), 0 12px 28px rgba(0, 0, 0, 0.4)';
                    }
                }, 100);
            }
            
            const badge = document.querySelector('.format-indicator');
            if (badge) {
                badge.style.transform = 'scale(1.02)';
                setTimeout(() => { if(badge) badge.style.transform = ''; }, 100);
            }
        }
    }

    function updateClock() {
        updateTime();
        updateDateInfo();
        addBlinkEffect();
    }

    function set24HourMode() {
        if (!is24HourFormat) {
            is24HourFormat = true;
            updateButtonsAndBadge();
            updateClock();
        }
    }

    function set12HourMode() {
        if (is24HourFormat) {
            is24HourFormat = false;
            updateButtonsAndBadge();
            updateClock();
        }
    }

    function startClock() {
        if (intervalId) clearInterval(intervalId);
        updateClock();
        intervalId = setInterval(updateClock, 1000);
    }

    // Button click handlers with animation
    mode24Btn.addEventListener('click', set24HourMode);
    mode12Btn.addEventListener('click', set12HourMode);
    
    // Button press animation
    const allBtns = [mode24Btn, mode12Btn];
    allBtns.forEach(btn => {
        btn.addEventListener('mousedown', () => {
            btn.style.transform = 'scale(0.96)';
            setTimeout(() => {
                btn.style.transform = '';
            }, 120);
        });
    });

    // Initialize
    startClock();
    updateButtonsAndBadge();
    lastSecond = new Date().getSeconds();
    
    console.log('Digital Clock aktif | Mode 24/12 jam | Dengan animasi neon dan tanggal dinamis');
})();