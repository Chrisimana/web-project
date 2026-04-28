(function() {
    // DOM Elements
    const birthDateInput = document.getElementById('birthDate');
    const targetDateInput = document.getElementById('targetDate');
    const calculateBtn = document.getElementById('calculateBtn');
    const resultSection = document.getElementById('resultSection');
    
    // Result elements
    const yearsEl = document.getElementById('years');
    const monthsEl = document.getElementById('months');
    const daysEl = document.getElementById('days');
    const totalDaysEl = document.getElementById('totalDays');
    const preciseAgeEl = document.getElementById('preciseAge');
    const nextBirthdayEl = document.getElementById('nextBirthday');
    const daysToBirthdayEl = document.getElementById('daysToBirthday');
    const liveAgeEl = document.getElementById('liveAge');
    
    let liveInterval = null;
    let currentBirthDate = null;
    let currentTargetDate = null;
    
    // Set default target date ke hari ini
    function setDefaultTargetDate() {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        targetDateInput.value = `${year}-${month}-${day}`;
    }
    
    // Validasi tanggal lahir tidak boleh lebih besar dari target
    function isValidDates(birthDate, targetDate) {
        if (birthDate > targetDate) {
            alert('Tanggal lahir tidak boleh lebih besar dari tanggal target!');
            return false;
        }
        return true;
    }
    
    // Menghitung perbedaan usia dalam tahun, bulan, hari
    function calculateAgeDifference(startDate, endDate) {
        let years = endDate.getFullYear() - startDate.getFullYear();
        let months = endDate.getMonth() - startDate.getMonth();
        let days = endDate.getDate() - startDate.getDate();
        
        if (days < 0) {
            months--;
            const lastMonth = new Date(endDate.getFullYear(), endDate.getMonth(), 0);
            days += lastMonth.getDate();
        }
        
        if (months < 0) {
            years--;
            months += 12;
        }
        
        return { years, months, days };
    }
    
    // Menghitung total hari antara dua tanggal
    function getTotalDays(startDate, endDate) {
        const diffTime = endDate - startDate;
        return Math.floor(diffTime / (1000 * 60 * 60 * 24));
    }
    
    // Mendapatkan tanggal ulang tahun berikutnya
    function getNextBirthday(birthDate, today) {
        const nextBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
        
        if (nextBirthday < today) {
            nextBirthday.setFullYear(today.getFullYear() + 1);
        }
        
        return nextBirthday;
    }
    
    // Menghitung hari menuju ulang tahun
    function getDaysToNextBirthday(birthDate, today) {
        const nextBirthday = getNextBirthday(birthDate, today);
        const diffTime = nextBirthday - today;
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
    
    // Format tanggal ke string lokal (Indonesia)
    function formatDate(date) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('id-ID', options);
    }
    
    // Update semua hasil perhitungan
    function updateCalculation(birthDate, targetDate) {
        if (!birthDate || !targetDate) return;
        
        if (!isValidDates(birthDate, targetDate)) return;
        
        // Hitung usia dasar
        const age = calculateAgeDifference(birthDate, targetDate);
        const totalDays = getTotalDays(birthDate, targetDate);
        
        // Update tampilan
        yearsEl.textContent = age.years;
        monthsEl.textContent = age.months;
        daysEl.textContent = age.days;
        totalDaysEl.textContent = totalDays.toLocaleString('id-ID');
        preciseAgeEl.textContent = `${age.years} tahun, ${age.months} bulan, ${age.days} hari`;
        
        // Hitung ulang tahun berikutnya
        const nextBirthday = getNextBirthday(birthDate, targetDate);
        const daysToBirthday = getDaysToNextBirthday(birthDate, targetDate);
        nextBirthdayEl.textContent = formatDate(nextBirthday);
        daysToBirthdayEl.textContent = `${daysToBirthday} hari lagi`;
        
        // Simpan untuk live counter
        currentBirthDate = new Date(birthDate);
        currentTargetDate = new Date(targetDate);
    }
    
    // Update live counter (real-time age)
    function updateLiveCounter() {
        if (!currentBirthDate) return;
        
        const now = new Date();
        const birthDate = currentBirthDate;
        
        // Hitung perbedaan dalam milidetik
        const diffMs = now - birthDate;
        
        if (diffMs < 0) {
            liveAgeEl.textContent = 'Belum lahir';
            return;
        }
        
        // Hitung tahun, bulan, hari, jam, menit, detik
        const totalSeconds = Math.floor(diffMs / 1000);
        const totalMinutes = Math.floor(totalSeconds / 60);
        const totalHours = Math.floor(totalMinutes / 60);
        const totalDays = Math.floor(totalHours / 24);
        
        const seconds = totalSeconds % 60;
        const minutes = totalMinutes % 60;
        const hours = totalHours % 24;
        
        // Hitung tahun, bulan, hari (akurat menggunakan metode tanggal)
        const nowDate = new Date(now);
        const birthDateObj = new Date(birthDate);
        
        let years = nowDate.getFullYear() - birthDateObj.getFullYear();
        let months = nowDate.getMonth() - birthDateObj.getMonth();
        let days = nowDate.getDate() - birthDateObj.getDate();
        
        if (days < 0) {
            months--;
            const lastMonth = new Date(nowDate.getFullYear(), nowDate.getMonth(), 0);
            days += lastMonth.getDate();
        }
        
        if (months < 0) {
            years--;
            months += 12;
        }
        
        liveAgeEl.innerHTML = `${years} tahun, ${months} bulan, ${days} hari, ${hours} jam, ${minutes} menit, ${seconds} detik`;
    }
    
    // Memulai live counter (update setiap detik)
    function startLiveCounter() {
        if (liveInterval) {
            clearInterval(liveInterval);
        }
        updateLiveCounter();
        liveInterval = setInterval(updateLiveCounter, 1000);
    }
    
    // Menghentikan live counter
    function stopLiveCounter() {
        if (liveInterval) {
            clearInterval(liveInterval);
            liveInterval = null;
        }
    }
    
    // Handler utama saat tombol hitung ditekan
    function calculateAge() {
        const birthDateStr = birthDateInput.value;
        let targetDateStr = targetDateInput.value;
        
        if (!birthDateStr) {
            alert('Silakan pilih tanggal lahir!');
            return;
        }
        
        // Jika target kosong, gunakan hari ini
        if (!targetDateStr) {
            const today = new Date();
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const day = String(today.getDate()).padStart(2, '0');
            targetDateStr = `${year}-${month}-${day}`;
            targetDateInput.value = targetDateStr;
        }
        
        const birthDate = new Date(birthDateStr);
        const targetDate = new Date(targetDateStr);
        
        // Reset waktu ke 00:00:00 untuk perbandingan yang akurat
        birthDate.setHours(0, 0, 0, 0);
        targetDate.setHours(0, 0, 0, 0);
        
        if (isNaN(birthDate.getTime())) {
            alert('Tanggal lahir tidak valid!');
            return;
        }
        
        if (isNaN(targetDate.getTime())) {
            alert('Tanggal target tidak valid!');
            return;
        }
        
        updateCalculation(birthDate, targetDate);
        startLiveCounter();
        
        // Tampilkan result section dengan animasi
        resultSection.style.opacity = '0';
        setTimeout(() => {
            resultSection.style.opacity = '1';
        }, 10);
    }
    
    // Reset live counter saat input berubah
    function resetOnInputChange() {
        // Tidak mereset total, tapi menghentikan live counter sampai hitung ulang
        stopLiveCounter();
    }
    
    // Event Listeners
    calculateBtn.addEventListener('click', calculateAge);
    birthDateInput.addEventListener('change', resetOnInputChange);
    targetDateInput.addEventListener('change', resetOnInputChange);
    
    // Inisialisasi default
    setDefaultTargetDate();
    
    // Set default birth date (2000-01-01)
    if (!birthDateInput.value) {
        birthDateInput.value = '2000-01-01';
    }
    
    // Jalankan perhitungan pertama kali
    calculateAge();
    
    // Keyboard support: tekan Enter untuk menghitung
    const inputs = [birthDateInput, targetDateInput];
    inputs.forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                calculateAge();
            }
        });
    });
    
    console.log('Kalkulator Usia siap | Perhitungan akurat termasuk tahun kabisat');
})();