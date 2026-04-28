(function() {
    // DOM Elements - Unit Toggle
    const metricBtn = document.getElementById('metricBtn');
    const imperialBtn = document.getElementById('imperialBtn');
    const metricInputs = document.getElementById('metricInputs');
    const imperialInputs = document.getElementById('imperialInputs');
    
    // Input Elements Metric
    const weightKgInput = document.getElementById('weightKg');
    const heightCmInput = document.getElementById('heightCm');
    
    // Input Elements Imperial
    const weightLbInput = document.getElementById('weightLb');
    const heightInInput = document.getElementById('heightIn');
    
    // Result Elements
    const resultSection = document.getElementById('resultSection');
    const bmiValueEl = document.getElementById('bmiValue');
    const bmiStatusEl = document.getElementById('bmiStatus');
    const scaleFill = document.getElementById('scaleFill');
    const bmiValueDetail = document.getElementById('bmiValueDetail');
    const categoryDetail = document.getElementById('categoryDetail');
    const idealWeightEl = document.getElementById('idealWeight');
    const recommendationText = document.getElementById('recommendationText');
    
    // State
    let isMetric = true; // default metrik
    
    // Constants untuk BMI kategori
    const BMI_CATEGORIES = {
        underweight: { min: 0, max: 18.5, label: 'Kurus', color: '#3498db', statusClass: 'underweight' },
        normal: { min: 18.5, max: 25, label: 'Normal', color: '#2ecc71', statusClass: 'normal' },
        overweight: { min: 25, max: 30, label: 'Berlebih', color: '#f39c12', statusClass: 'overweight' },
        obese: { min: 30, max: 100, label: 'Obesitas', color: '#e74c3c', statusClass: 'obese' }
    };
    
    // Fungsi untuk mendapatkan kategori BMI
    function getBMICategory(bmi) {
        if (bmi < 18.5) return BMI_CATEGORIES.underweight;
        if (bmi < 25) return BMI_CATEGORIES.normal;
        if (bmi < 30) return BMI_CATEGORIES.overweight;
        return BMI_CATEGORIES.obese;
    }
    
    // Fungsi menghitung range berat ideal (kg) berdasarkan tinggi (cm)
    function calculateIdealWeight(heightCm) {
        const heightM = heightCm / 100;
        const minIdeal = 18.5 * (heightM * heightM);
        const maxIdeal = 24.9 * (heightM * heightM);
        return { min: minIdeal.toFixed(1), max: maxIdeal.toFixed(1) };
    }
    
    // Fungsi untuk mendapatkan rekomendasi berdasarkan kategori
    function getRecommendation(category, bmi, idealWeightRange) {
        const recommendations = {
            underweight: {
                title: '💪 Kategori: Kurus',
                message: `BMI Anda ${bmi.toFixed(1)} (di bawah 18.5). Disarankan untuk menambah berat badan hingga kisaran ideal ${idealWeightRange.min} - ${idealWeightRange.max} kg. Konsumsi makanan bergizi tinggi protein dan karbohidrat kompleks, serta lakukan latihan kekuatan.`
            },
            normal: {
                title: '✅ Kategori: Normal (Sehat)',
                message: `BMI Anda ${bmi.toFixed(1)} (18.5 - 24.9). Berat badan Anda ideal! Pertahankan dengan pola makan seimbang dan olahraga teratur minimal 30 menit setiap hari.`
            },
            overweight: {
                title: '⚠️ Kategori: Berlebih',
                message: `BMI Anda ${bmi.toFixed(1)} (25 - 29.9). Mulai kurangi asupan gula dan lemak jenuh. Targetkan berat badan ideal ${idealWeightRange.min} - ${idealWeightRange.max} kg. Cobalah olahraga kardio 3-5 kali seminggu.`
            },
            obese: {
                title: '❗ Kategori: Obesitas',
                message: `BMI Anda ${bmi.toFixed(1)} (≥ 30). Konsultasikan dengan dokter atau ahli gizi. Target penurunan berat badan secara bertahap ke kisaran ${idealWeightRange.min} - ${idealWeightRange.max} kg. Mulai dengan perubahan gaya hidup kecil seperti berjalan kaki 30 menit/hari.`
            }
        };
        return recommendations[category];
    }
    
    // Update warna status berdasarkan kategori
    function updateStatusColor(category) {
        bmiStatusEl.style.background = `${category.color}20`;
        bmiStatusEl.style.color = category.color;
        scaleFill.style.background = category.color;
    }
    
    // Hitung BMI dari metrik
    function calculateMetric() {
        let weight = parseFloat(weightKgInput.value);
        let heightCm = parseFloat(heightCmInput.value);
        
        if (isNaN(weight) || weight <= 0) weight = 0;
        if (isNaN(heightCm) || heightCm <= 0) heightCm = 0;
        
        if (weight === 0 || heightCm === 0) {
            return null;
        }
        
        const heightM = heightCm / 100;
        const bmi = weight / (heightM * heightM);
        return { bmi, weight, heightCm };
    }
    
    // Hitung BMI dari imperial (lb, in)
    function calculateImperial() {
        let weightLb = parseFloat(weightLbInput.value);
        let heightIn = parseFloat(heightInInput.value);
        
        if (isNaN(weightLb) || weightLb <= 0) weightLb = 0;
        if (isNaN(heightIn) || heightIn <= 0) heightIn = 0;
        
        if (weightLb === 0 || heightIn === 0) {
            return null;
        }
        
        // Konversi imperial ke metrik untuk perhitungan
        // 1 lb = 0.453592 kg, 1 in = 0.0254 m
        const weightKg = weightLb * 0.453592;
        const heightM = heightIn * 0.0254;
        const bmi = weightKg / (heightM * heightM);
        const heightCm = heightM * 100;
        
        return { bmi, weight: weightKg, heightCm };
    }
    
    // Update progress bar (skala BMI 0-40)
    function updateScaleBar(bmi) {
        let percentage = (bmi / 40) * 100;
        if (percentage > 100) percentage = 100;
        if (percentage < 0) percentage = 0;
        scaleFill.style.width = `${percentage}%`;
    }
    
    // Update semua hasil
    function updateBMI() {
        let result;
        let weightForIdeal;
        let heightForIdeal;
        
        if (isMetric) {
            result = calculateMetric();
            if (result) {
                weightForIdeal = result.weight;
                heightForIdeal = result.heightCm;
            }
        } else {
            result = calculateImperial();
            if (result) {
                weightForIdeal = result.weight;
                heightForIdeal = result.heightCm;
            }
        }
        
        if (!result || result.bmi <= 0 || result.bmi > 100) {
            resultSection.classList.add('hidden');
            return;
        }
        
        const bmi = result.bmi;
        const category = getBMICategory(bmi);
        const idealWeightRange = calculateIdealWeight(heightForIdeal);
        const idealWeightText = `${idealWeightRange.min} - ${idealWeightRange.max} kg`;
        
        // Update display
        bmiValueEl.textContent = bmi.toFixed(1);
        bmiValueDetail.textContent = bmi.toFixed(1);
        bmiStatusEl.textContent = category.label;
        categoryDetail.textContent = category.label;
        idealWeightEl.textContent = idealWeightText;
        
        // Update rekomendasi
        let categoryKey;
        if (bmi < 18.5) categoryKey = 'underweight';
        else if (bmi < 25) categoryKey = 'normal';
        else if (bmi < 30) categoryKey = 'overweight';
        else categoryKey = 'obese';
        
        const recommendation = getRecommendation(categoryKey, bmi, idealWeightRange);
        recommendationText.innerHTML = `<strong>${recommendation.title}</strong><br><br>${recommendation.message}`;
        
        // Update warna
        updateStatusColor(category);
        
        // Update progress bar
        updateScaleBar(bmi);
        
        // Tampilkan result section
        resultSection.classList.remove('hidden');
    }
    
    // Toggle unit antara metric dan imperial
    function setUnit(isMetricUnit) {
        isMetric = isMetricUnit;
        
        if (isMetric) {
            metricBtn.classList.add('active');
            imperialBtn.classList.remove('active');
            metricInputs.classList.remove('hidden');
            imperialInputs.classList.add('hidden');
        } else {
            imperialBtn.classList.add('active');
            metricBtn.classList.remove('active');
            imperialInputs.classList.remove('hidden');
            metricInputs.classList.add('hidden');
        }
        
        // Hitung ulang setelah ganti unit dengan konversi nilai jika perlu
        syncValues();
        updateBMI();
    }
    
    // Sinkronisasi nilai antar unit (konversi otomatis)
    function syncValues() {
        if (isMetric) {
            // Saat di mode metric, ambil nilai dari imperial jika ada dan konversi
            const weightLb = parseFloat(weightLbInput.value);
            const heightIn = parseFloat(heightInInput.value);
            
            if (!isNaN(weightLb) && weightLb > 0 && weightKgInput.value === '70') {
                // Konversi lb ke kg (1 lb = 0.453592 kg)
                const convertedKg = weightLb * 0.453592;
                if (convertedKg > 0 && convertedKg < 500) {
                    weightKgInput.value = convertedKg.toFixed(1);
                }
            }
            
            if (!isNaN(heightIn) && heightIn > 0 && heightCmInput.value === '170') {
                // Konversi in ke cm (1 in = 2.54 cm)
                const convertedCm = heightIn * 2.54;
                if (convertedCm > 0 && convertedCm < 300) {
                    heightCmInput.value = convertedCm.toFixed(1);
                }
            }
        } else {
            // Saat di mode imperial, ambil dari metric
            const weightKg = parseFloat(weightKgInput.value);
            const heightCm = parseFloat(heightCmInput.value);
            
            if (!isNaN(weightKg) && weightKg > 0 && weightLbInput.value === '154') {
                const convertedLb = weightKg / 0.453592;
                if (convertedLb > 0 && convertedLb < 1000) {
                    weightLbInput.value = convertedLb.toFixed(1);
                }
            }
            
            if (!isNaN(heightCm) && heightCm > 0 && heightInInput.value === '67') {
                const convertedIn = heightCm / 2.54;
                if (convertedIn > 0 && convertedIn < 200) {
                    heightInInput.value = convertedIn.toFixed(1);
                }
            }
        }
    }
    
    // Event Listeners untuk input
    function attachInputEvents() {
        weightKgInput.addEventListener('input', () => {
            if (isMetric) updateBMI();
        });
        heightCmInput.addEventListener('input', () => {
            if (isMetric) updateBMI();
        });
        weightLbInput.addEventListener('input', () => {
            if (!isMetric) updateBMI();
        });
        heightInInput.addEventListener('input', () => {
            if (!isMetric) updateBMI();
        });
    }
    
    // Event untuk tombol unit
    metricBtn.addEventListener('click', () => setUnit(true));
    imperialBtn.addEventListener('click', () => setUnit(false));
    
    // Tombol hitung (manual)
    const calculateBtn = document.getElementById('calculateBtn');
    calculateBtn.addEventListener('click', updateBMI);
    
    // Tambahkan animasi pada tombol hitung
    calculateBtn.addEventListener('mousedown', () => {
        calculateBtn.style.transform = 'scale(0.98)';
        setTimeout(() => {
            calculateBtn.style.transform = '';
        }, 150);
    });
    
    // Inisialisasi
    attachInputEvents();
    
    // Set nilai default yang sudah ada
    // Default metric: 70kg, 170cm -> BMI sekitar 24.2 (normal)
    // Default imperial: 154lb, 67in -> BMI sekitar 24.1
    
    // Jalankan hitungan pertama
    setTimeout(() => {
        updateBMI();
    }, 100);
    
    // Keyboard support: Enter untuk hitung
    const allInputs = [weightKgInput, heightCmInput, weightLbInput, heightInInput];
    allInputs.forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                updateBMI();
            }
        });
    });
    
    console.log('Kalkulator BMI siap | Mendukung metrik dan imperial units');
})();