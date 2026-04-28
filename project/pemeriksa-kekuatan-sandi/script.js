// DOM elements
const passwordInput = document.getElementById('passwordInput');
const meterFill = document.getElementById('meterFill');
const strengthText = document.getElementById('strengthText');
const toggleBtn = document.getElementById('toggleVisibility');
const toggleIcon = document.getElementById('toggleIcon');
const infoTextEl = document.getElementById('infoText');

// Kriteria elements mapping
const criteriaMap = {
    length: document.querySelector('[data-criteria="length"]'),
    uppercase: document.querySelector('[data-criteria="uppercase"]'),
    lowercase: document.querySelector('[data-criteria="lowercase"]'),
    number: document.querySelector('[data-criteria="number"]'),
    special: document.querySelector('[data-criteria="special"]')
};

// Status kriteria
const criteriaStatus = {
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
};

// Fungsi untuk cek password dan update semua
function checkPasswordStrength(password) {
    if (!password) {
        resetAll();
        return {
            score: 0,
            level: 'empty',
            message: 'Belum ada password'
        };
    }

    // Update kriteria validasi
    const lengthValid = password.length >= 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);

    criteriaStatus.length = lengthValid;
    criteriaStatus.uppercase = hasUpper;
    criteriaStatus.lowercase = hasLower;
    criteriaStatus.number = hasNumber;
    criteriaStatus.special = hasSpecial;

    // Update tampilan checklist
    updateCriteriaUI();

    // Hitung skor (maks 5 kriteria = 100)
    let validCount = 0;
    if (lengthValid) validCount++;
    if (hasUpper) validCount++;
    if (hasLower) validCount++;
    if (hasNumber) validCount++;
    if (hasSpecial) validCount++;

    const score = (validCount / 5) * 100;

    // Tentukan level kekuatan
    let strengthLevel = '';
    let strengthMessage = '';
    let meterColor = '';
    let suggestion = '';

    if (score === 0) {
        strengthLevel = 'very-weak';
        strengthMessage = '⚠️ Sangat Lemah';
        meterColor = '#ef4444';
        suggestion = 'Password terlalu pendek dan tidak memiliki variasi karakter.';
    } else if (score < 30) {
        strengthLevel = 'weak';
        strengthMessage = '🔴 Lemah';
        meterColor = '#f97316';
        suggestion = 'Tambahkan minimal 8 karakter, campur huruf besar, kecil, dan angka.';
    } else if (score < 60) {
        strengthLevel = 'medium';
        strengthMessage = '🟠 Sedang';
        meterColor = '#eab308';
        suggestion = 'Cukup baik, tapi tambahkan karakter khusus (!@#$%) untuk membuatnya lebih kuat.';
    } else if (score < 80) {
        strengthLevel = 'strong';
        strengthMessage = '🟢 Kuat';
        meterColor = '#22c55e';
        suggestion = 'Password kuat! Pastikan tidak menggunakan kata yang umum.';
    } else {
        strengthLevel = 'very-strong';
        strengthMessage = '💪 Sangat Kuat';
        meterColor = '#059669';
        suggestion = 'Password sangat aman! Tetap jaga kerahasiaannya.';
    }

    // Update meter bar dan teks
    meterFill.style.width = `${score}%`;
    meterFill.style.backgroundColor = meterColor;
    strengthText.innerHTML = `${strengthMessage} (${validCount}/5 kriteria)`;
    
    // Update info panel berdasarkan saran
    if (score < 80 && validCount > 0) {
        infoTextEl.innerHTML = `💡 ${suggestion}`;
    } else if (score === 0) {
        infoTextEl.innerHTML = `📝 Mulai ketik password untuk menilai kekuatannya. ${suggestion}`;
    } else if (score >= 80) {
        infoTextEl.innerHTML = `✅ ${suggestion} Password Anda memenuhi semua kriteria keamanan.`;
    } else {
        infoTextEl.innerHTML = `🔒 ${suggestion}`;
    }

    return {
        score,
        level: strengthLevel,
        message: strengthMessage,
        validCount
    };
}

// Update tampilan checklist dengan ikon Font Awesome
function updateCriteriaUI() {
    updateSingleCriteria('length', criteriaStatus.length, 'fas fa-check-circle', 'far fa-circle');
    updateSingleCriteria('uppercase', criteriaStatus.uppercase, 'fas fa-check-circle', 'far fa-circle');
    updateSingleCriteria('lowercase', criteriaStatus.lowercase, 'fas fa-check-circle', 'far fa-circle');
    updateSingleCriteria('number', criteriaStatus.number, 'fas fa-check-circle', 'far fa-circle');
    updateSingleCriteria('special', criteriaStatus.special, 'fas fa-check-circle', 'far fa-circle');
}

function updateSingleCriteria(key, isValid, validIcon, invalidIcon) {
    const element = criteriaMap[key];
    if (!element) return;
    
    const iconSpan = element.querySelector('.criteria-icon i');
    if (!iconSpan) return;
    
    if (isValid) {
        // Hapus kelas ikon lama, tambahkan yang baru
        iconSpan.className = validIcon;
        element.classList.add('valid');
    } else {
        iconSpan.className = invalidIcon;
        element.classList.remove('valid');
    }
}

// Reset semua saat password kosong
function resetAll() {
    meterFill.style.width = '0%';
    meterFill.style.backgroundColor = '#cbd5e1';
    strengthText.innerHTML = 'Belum ada password';
    infoTextEl.innerHTML = 'Password yang kuat membantu melindungi akun Anda dari peretasan.';
    
    // Reset semua criteria status ke false & UI
    criteriaStatus.length = false;
    criteriaStatus.uppercase = false;
    criteriaStatus.lowercase = false;
    criteriaStatus.number = false;
    criteriaStatus.special = false;
    
    for (let key in criteriaMap) {
        const element = criteriaMap[key];
        if (element) {
            const iconSpan = element.querySelector('.criteria-icon i');
            if (iconSpan) {
                iconSpan.className = 'far fa-circle';
                element.classList.remove('valid');
            }
        }
    }
}

// Toggle visibility password dengan ikon Font Awesome
function togglePasswordVisibility() {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    
    // Ganti ikon antara eye dan eye-slash
    if (type === 'text') {
        toggleIcon.className = 'fas fa-eye-slash';
        toggleBtn.setAttribute('aria-label', 'Sembunyikan password');
    } else {
        toggleIcon.className = 'far fa-eye';
        toggleBtn.setAttribute('aria-label', 'Tampilkan password');
    }
}

// Event listener untuk input password
function handlePasswordInput(e) {
    const password = e.target.value;
    if (password === '') {
        resetAll();
    } else {
        checkPasswordStrength(password);
    }
}

// Inisialisasi event dan auto-check kosong
function init() {
    passwordInput.addEventListener('input', handlePasswordInput);
    toggleBtn.addEventListener('click', togglePasswordVisibility);
    
    // Reset awal
    resetAll();
    
    // Mencegah submit form jika ada form
    passwordInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const pwd = passwordInput.value;
            if (pwd) checkPasswordStrength(pwd);
        }
    });
    
    meterFill.style.transition = 'width 0.35s ease';
}

// Jalankan init saat DOM siap
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Update strength jika ada paste otomatis
passwordInput.addEventListener('paste', function() {
    setTimeout(() => {
        const val = passwordInput.value;
        if (val === '') resetAll();
        else checkPasswordStrength(val);
    }, 10);
});