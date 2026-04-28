(function() {
    // DOM Elements
    const billInput = document.getElementById('billAmount');
    const tipBtns = document.querySelectorAll('.tip-btn');
    const customTipInput = document.getElementById('customTip');
    const peopleCountInput = document.getElementById('peopleCount');
    const decrementBtn = document.getElementById('decrementPeople');
    const incrementBtn = document.getElementById('incrementPeople');
    const totalTipEl = document.getElementById('totalTip');
    const totalWithTipEl = document.getElementById('totalWithTip');
    const perPersonEl = document.getElementById('perPerson');

    // State
    let currentTipPercent = 15; // default 15%

    // Format Rupiah
    function formatRupiah(amount) {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    }

    // Calculate and update all displays
    function calculateAndUpdate() {
        // Get bill amount
        let bill = parseFloat(billInput.value);
        if (isNaN(bill) || bill < 0) bill = 0;
        
        // Get tip percentage
        let tipPercent = currentTipPercent;
        // Check custom tip input if exists and valid
        const customValue = parseFloat(customTipInput.value);
        if (customTipInput.value.trim() !== '' && !isNaN(customValue) && customValue >= 0) {
            tipPercent = customValue;
            // Update active state on buttons (remove active from all buttons)
            tipBtns.forEach(btn => btn.classList.remove('active'));
        } else {
            // Make sure the active button matches currentTipPercent
            tipBtns.forEach(btn => {
                const btnVal = parseFloat(btn.getAttribute('data-tip'));
                if (btnVal === currentTipPercent) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
        }
        
        // Get number of people
        let people = parseInt(peopleCountInput.value);
        if (isNaN(people) || people < 1) people = 1;
        
        // Calculations
        const tipAmount = bill * (tipPercent / 100);
        const totalBill = bill + tipAmount;
        const perPersonAmount = people > 0 ? totalBill / people : totalBill;
        
        // Update display
        totalTipEl.textContent = formatRupiah(tipAmount);
        totalWithTipEl.textContent = formatRupiah(totalBill);
        perPersonEl.textContent = formatRupiah(perPersonAmount);
    }

    // Set tip percentage from button
    function setTipPercentage(percent) {
        currentTipPercent = percent;
        // Clear custom tip input to avoid conflict
        customTipInput.value = '';
        // Update active class on buttons
        tipBtns.forEach(btn => {
            const btnVal = parseFloat(btn.getAttribute('data-tip'));
            if (btnVal === percent) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        calculateAndUpdate();
    }

    // Handle custom tip change
    function handleCustomTip() {
        let customValue = parseFloat(customTipInput.value);
        if (!isNaN(customValue) && customValue >= 0) {
            // Remove active class from all tip buttons
            tipBtns.forEach(btn => btn.classList.remove('active'));
            // No need to update currentTipPercent state since custom input overrides
            calculateAndUpdate();
        } else if (customTipInput.value === '') {
            // If custom input is empty, revert to currentTipPercent
            calculateAndUpdate();
        } else {
            // Invalid input, clear and recalc
            customTipInput.value = '';
            calculateAndUpdate();
        }
    }

    // Increment people
    function incrementPeople() {
        let currentVal = parseInt(peopleCountInput.value);
        if (isNaN(currentVal)) currentVal = 1;
        peopleCountInput.value = currentVal + 1;
        calculateAndUpdate();
    }
    
    // Decrement people
    function decrementPeople() {
        let currentVal = parseInt(peopleCountInput.value);
        if (isNaN(currentVal)) currentVal = 1;
        if (currentVal > 1) {
            peopleCountInput.value = currentVal - 1;
        } else {
            peopleCountInput.value = 1;
        }
        calculateAndUpdate();
    }

    // Validate bill input (no negative)
    function validateBill() {
        let val = parseFloat(billInput.value);
        if (isNaN(val) || val < 0) {
            billInput.value = 0;
        }
        calculateAndUpdate();
    }

    // Validate people count
    function validatePeople() {
        let val = parseInt(peopleCountInput.value);
        if (isNaN(val) || val < 1) {
            peopleCountInput.value = 1;
        }
        calculateAndUpdate();
    }

    // Event Listeners
    billInput.addEventListener('input', validateBill);
    billInput.addEventListener('change', validateBill);
    
    peopleCountInput.addEventListener('input', validatePeople);
    peopleCountInput.addEventListener('change', validatePeople);
    
    decrementBtn.addEventListener('click', decrementPeople);
    incrementBtn.addEventListener('click', incrementPeople);
    
    customTipInput.addEventListener('input', handleCustomTip);
    customTipInput.addEventListener('change', handleCustomTip);
    
    // Tip buttons event
    tipBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const tipValue = parseFloat(btn.getAttribute('data-tip'));
            if (!isNaN(tipValue)) {
                setTipPercentage(tipValue);
            }
        });
    });
    
    // Add keyboard support: Enter key recalc (already recalc on input, but for UX)
    const allInputs = [billInput, customTipInput, peopleCountInput];
    allInputs.forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                calculateAndUpdate();
            }
        });
    });
    
    // Initial calculation
    calculateAndUpdate();
    
    // Optional: Add animation effect on update
    function animateResult() {
        const resultItems = document.querySelectorAll('.result-value');
        resultItems.forEach(item => {
            item.style.transform = 'scale(1.02)';
            setTimeout(() => {
                item.style.transform = '';
            }, 150);
        });
    }
    
    // Override calculate to add animation
    const originalCalc = calculateAndUpdate;
    window.calculateAndUpdate = function() {
        originalCalc();
        animateResult();
    };
    calculateAndUpdate = function() {
        originalCalc();
        animateResult();
    };
    
    // Rebind calculate function
    const newCalc = function() {
        originalCalc();
        animateResult();
    };
    
    // Replace all event handlers to use animated version
    billInput.removeEventListener('input', validateBill);
    billInput.removeEventListener('change', validateBill);
    billInput.addEventListener('input', () => { validateBill(); newCalc(); });
    billInput.addEventListener('change', () => { validateBill(); newCalc(); });
    
    peopleCountInput.removeEventListener('input', validatePeople);
    peopleCountInput.removeEventListener('change', validatePeople);
    peopleCountInput.addEventListener('input', () => { validatePeople(); newCalc(); });
    peopleCountInput.addEventListener('change', () => { validatePeople(); newCalc(); });
    
    decrementBtn.removeEventListener('click', decrementPeople);
    decrementBtn.addEventListener('click', () => { decrementPeople(); newCalc(); });
    incrementBtn.removeEventListener('click', incrementPeople);
    incrementBtn.addEventListener('click', () => { incrementPeople(); newCalc(); });
    
    customTipInput.removeEventListener('input', handleCustomTip);
    customTipInput.removeEventListener('change', handleCustomTip);
    customTipInput.addEventListener('input', () => { handleCustomTip(); newCalc(); });
    customTipInput.addEventListener('change', () => { handleCustomTip(); newCalc(); });
    
    // Update tip buttons to use animation
    tipBtns.forEach(btn => {
        const oldClick = btn.onclick;
        btn.removeEventListener('click', btn.click);
        btn.addEventListener('click', (e) => {
            const tipValue = parseFloat(btn.getAttribute('data-tip'));
            if (!isNaN(tipValue)) {
                setTipPercentage(tipValue);
                newCalc();
            }
        });
    });
    
    // final initial call with animation
    newCalc();
    
    console.log('Tip Calculator siap digunakan | Hitung tip dan bagi rata dengan mudah');
})();