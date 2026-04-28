document.addEventListener('DOMContentLoaded', function() {
    const startBtn = document.getElementById('start-btn');
    const targetDateInput = document.getElementById('target-date');
    const countdownElement = document.getElementById('countdown');
    const messageElement = document.getElementById('message');
    const daysElement = document.getElementById('days');
    const hoursElement = document.getElementById('hours');
    const minutesElement = document.getElementById('minutes');
    const secondsElement = document.getElementById('seconds');

    let countdownInterval;

    startBtn.addEventListener('click', function() {
        const targetDate = new Date(targetDateInput.value);
        if (isNaN(targetDate.getTime())) {
            messageElement.textContent = 'Please select a valid date and time.';
            return;
        }

        const now = new Date().getTime();
        if (targetDate.getTime() <= now) {
            messageElement.textContent = 'Please select a future date and time.';
            return;
        }

        messageElement.textContent = '';
        countdownElement.style.display = 'flex';

        if (countdownInterval) {
            clearInterval(countdownInterval);
        }

        countdownInterval = setInterval(function() {
            const now = new Date().getTime();
            const distance = targetDate.getTime() - now;

            if (distance < 0) {
                clearInterval(countdownInterval);
                messageElement.textContent = 'Countdown finished!';
                countdownElement.style.display = 'none';
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            daysElement.textContent = days.toString().padStart(2, '0');
            hoursElement.textContent = hours.toString().padStart(2, '0');
            minutesElement.textContent = minutes.toString().padStart(2, '0');
            secondsElement.textContent = seconds.toString().padStart(2, '0');
        }, 1000);
    });
});