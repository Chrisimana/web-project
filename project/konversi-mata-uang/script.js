(function() {
    // DOM Elements
    const amountInput = document.getElementById('amount');
    const fromCurrencySelect = document.getElementById('fromCurrency');
    const toCurrencySelect = document.getElementById('toCurrency');
    const swapBtn = document.getElementById('swapBtn');
    const convertBtn = document.getElementById('convertBtn');
    const resultValueEl = document.getElementById('resultValue');
    const resultRateEl = document.getElementById('resultRate');
    const updateTimeEl = document.getElementById('updateTime');
    const rateChips = document.getElementById('rateChips');
    
    // State
    let exchangeRates = {};
    let isFetching = false;
    
    const currencySymbols = {
        USD: '$', EUR: '€', GBP: '£', JPY: '¥', IDR: 'Rp', SGD: 'S$', 
        MYR: 'RM', THB: '฿', CNY: '¥', INR: '₹', AUD: 'A$', CAD: 'C$', 
        CHF: 'CHF', KRW: '₩', SAR: '﷼', AED: 'د.إ'
    };
    
    function formatNumber(num, decimals = 2) {
        if (num === undefined || num === null || isNaN(num)) return '--';
        if (num === 0) return '0';
        return Number(num).toLocaleString('id-ID', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        });
    }
    
    // ✅ HANYA menggunakan API yang 100% GRATIS UNLIMITED
    // Sumber: https://github.com/fawazahmed0/exchange-api
    async function fetchExchangeRates(baseCurrency = 'USD') {
        if (isFetching) return;
        
        isFetching = true;
        resultValueEl.innerHTML = '🔄 Memuat kurs...';
        resultRateEl.innerHTML = 'Mengambil data dari server...';
        
        try {
            // API ini GRATIS 100%, UPDATE HARIAN, TIDAK PERLU API KEY, TIDAK ADA LIMIT
            const response = await fetch(`https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${baseCurrency.toLowerCase()}.json`);
            
            if (!response.ok) throw new Error('Gagal memuat data');
            
            const data = await response.json();
            const rates = data[baseCurrency.toLowerCase()];
            
            // Konversi ke format standar
            exchangeRates = {};
            for (const [curr, rate] of Object.entries(rates)) {
                exchangeRates[curr.toUpperCase()] = rate;
            }
            exchangeRates[baseCurrency.toUpperCase()] = 1;
            
            // Update waktu
            const today = new Date();
            updateTimeEl.textContent = today.toLocaleDateString('id-ID', {
                day: 'numeric', month: 'long', year: 'numeric'
            });
            
            // Update popular rates
            await updatePopularRates();
            
            // Konversi
            performConversion();
            
        } catch (error) {
            console.error('Error:', error);
            resultValueEl.innerHTML = '❌ Gagal memuat kurs';
            resultRateEl.innerHTML = 'Cek koneksi internet, lalu refresh halaman';
            useOfflineFallback(baseCurrency);
        } finally {
            isFetching = false;
        }
    }
    
    // Data offline jika tidak ada internet
    function useOfflineFallback(baseCurrency) {
        const offlineRates = {
            usd: 1, eur: 0.92, gbp: 0.79, jpy: 151.5, idr: 15650,
            sgd: 1.35, myr: 4.73, thb: 36.5, cny: 7.24, inr: 83.5,
            aud: 1.53, cad: 1.37, chf: 0.91, krw: 1370, sar: 3.75, aed: 3.67
        };
        
        const base = baseCurrency.toLowerCase();
        const baseRate = offlineRates[base] || 1;
        
        exchangeRates = {};
        for (const [curr, rate] of Object.entries(offlineRates)) {
            exchangeRates[curr.toUpperCase()] = rate / baseRate;
        }
        exchangeRates[baseCurrency.toUpperCase()] = 1;
        
        updateTimeEl.textContent = `${new Date().toLocaleDateString('id-ID')} (data offline)`;
        updatePopularRatesOffline();
        performConversion();
    }
    
    async function updatePopularRates() {
        try {
            const response = await fetch(`https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json`);
            if (response.ok) {
                const data = await response.json();
                const rates = data.usd;
                
                const usdToIdr = rates.idr ? rates.idr.toFixed(0) : '--';
                const eurToIdr = rates.eur && rates.idr ? (rates.idr / rates.eur).toFixed(0) : '--';
                const sgdToIdr = rates.sgd && rates.idr ? (rates.idr / rates.sgd).toFixed(0) : '--';
                
                rateChips.innerHTML = `
                    <span>1 USD → IDR: ${formatNumber(usdToIdr, 0)}</span>
                    <span>1 EUR → IDR: ${formatNumber(eurToIdr, 0)}</span>
                    <span>1 SGD → IDR: ${formatNumber(sgdToIdr, 0)}</span>
                `;
            }
        } catch (e) {
            updatePopularRatesOffline();
        }
    }
    
    function updatePopularRatesOffline() {
        rateChips.innerHTML = `
            <span>1 USD → IDR: 15,650</span>
            <span>1 EUR → IDR: 17,010</span>
            <span>1 SGD → IDR: 11,590</span>
        `;
    }
    
    function getExchangeRate(from, to) {
        if (Object.keys(exchangeRates).length === 0) return null;
        if (from === to) return 1;
        
        const fromRate = exchangeRates[from];
        const toRate = exchangeRates[to];
        
        if (fromRate && toRate) {
            return toRate / fromRate;
        }
        return null;
    }
    
    function performConversion() {
        const amount = parseFloat(amountInput.value);
        const fromCurrency = fromCurrencySelect.value;
        const toCurrency = toCurrencySelect.value;
        
        if (isNaN(amount)) {
            resultValueEl.innerHTML = 'Masukkan angka';
            resultRateEl.innerHTML = 'Jumlah tidak valid';
            return;
        }
        
        if (amount <= 0) {
            resultValueEl.innerHTML = '0';
            resultRateEl.innerHTML = `1 ${fromCurrency} = -- ${toCurrency}`;
            return;
        }
        
        if (Object.keys(exchangeRates).length === 0) {
            resultValueEl.innerHTML = '🔄 Memuat kurs...';
            return;
        }
        
        const rate = getExchangeRate(fromCurrency, toCurrency);
        
        if (rate === null || isNaN(rate)) {
            resultValueEl.innerHTML = '❌ Kurs tidak tersedia';
            return;
        }
        
        const convertedAmount = amount * rate;
        const decimals = (toCurrency === 'IDR' || fromCurrency === 'IDR') ? 0 : 2;
        const symbol = currencySymbols[toCurrency] || toCurrency;
        
        resultValueEl.innerHTML = `${symbol} ${formatNumber(convertedAmount, decimals)}`;
        resultRateEl.innerHTML = `1 ${fromCurrency} = ${formatNumber(rate, 4)} ${toCurrency}`;
        
        resultValueEl.style.transform = 'scale(1.02)';
        setTimeout(() => {
            if (resultValueEl) resultValueEl.style.transform = '';
        }, 200);
    }
    
    let debounceTimer;
    function autoConvert() {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => performConversion(), 300);
    }
    
    function swapCurrencies() {
        const fromVal = fromCurrencySelect.value;
        const toVal = toCurrencySelect.value;
        fromCurrencySelect.value = toVal;
        toCurrencySelect.value = fromVal;
        fetchExchangeRates(fromCurrencySelect.value);
    }
    
    function initEventListeners() {
        convertBtn.addEventListener('click', () => fetchExchangeRates(fromCurrencySelect.value));
        swapBtn.addEventListener('click', swapCurrencies);
        amountInput.addEventListener('input', autoConvert);
        fromCurrencySelect.addEventListener('change', () => fetchExchangeRates(fromCurrencySelect.value));
        toCurrencySelect.addEventListener('change', performConversion);
    }
    
    function addButtonAnimations() {
        document.querySelectorAll('button, .swap-icon').forEach(btn => {
            btn.addEventListener('mousedown', () => {
                btn.style.transform = 'scale(0.96)';
                setTimeout(() => btn.style.transform = '', 120);
            });
        });
    }
    
    function startAutoRefresh() {
        setInterval(() => {
            if (!isFetching) fetchExchangeRates(fromCurrencySelect.value);
        }, 3600000);
    }
    
    function init() {
        initEventListeners();
        addButtonAnimations();
        fromCurrencySelect.value = 'IDR';
        toCurrencySelect.value = 'USD';
        amountInput.value = '100';
        fetchExchangeRates('IDR');
        startAutoRefresh();
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    console.log('✅ Konverter Mata Uang | API: fawazahmed0/currency-api (100% GRATIS, UNLIMITED, update harian, tanpa login/trial/premium)');
})();