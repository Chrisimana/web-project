const resultField = document.querySelector('#result');
let currentExpression = '';

function updateDisplay(value) {
  resultField.value = value || '';
}

function calculate(expression) {
  try {
    // Ganti operator tampilan ke operator JavaScript
    const safeExpr = expression
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/−/g, '-')
      .replace(/,/g, '.');
    
    // Hindari pembagian dengan nol
    if (safeExpr.includes('/0') && !safeExpr.includes('/0.')) {
      throw new Error('Tidak bisa membagi dengan nol');
    }
    
    // eslint-disable-next-line no-eval
    let result = eval(safeExpr);
    if (!Number.isFinite(result)) throw new Error('Tak terhingga');
    
    // Bulatkan jika desimal terlalu panjang
    return parseFloat(result.toFixed(8)).toString();
  } catch (error) {
    if (error.message === 'Tidak bisa membagi dengan nol') return 'Error: ÷0';
    return 'Error';
  }
}

function append(char) {
  if (currentExpression === 'Error' || currentExpression === 'Error: ÷0') {
    currentExpression = '';
  }
  
  // Cegah operator ganda berurutan
  const operators = ['+', '-', '*', '/', '%', '×', '÷', '−'];
  const lastChar = currentExpression.slice(-1);
  
  if (operators.includes(char) && operators.includes(lastChar)) {
    // Ganti operator terakhir
    currentExpression = currentExpression.slice(0, -1) + char;
  } else {
    currentExpression += char;
  }
  updateDisplay(currentExpression);
}

function clearAll() {
  currentExpression = '';
  updateDisplay('');
}

function backspace() {
  currentExpression = currentExpression.slice(0, -1);
  updateDisplay(currentExpression);
}

function doEquals() {
  if (!currentExpression.trim()) return;
  const output = calculate(currentExpression);
  currentExpression = output;
  updateDisplay(currentExpression);
}

// Event listener tombol
document.querySelector('.buttons').addEventListener('click', (event) => {
  const button = event.target.closest('button');
  if (!button) return;
  const value = button.dataset.value;
  const action = button.dataset.action;

  if (action === 'clear') {
    clearAll();
    return;
  }
  if (action === 'backspace') {
    backspace();
    return;
  }
  if (action === 'equals') {
    doEquals();
    return;
  }
  if (value) {
    append(value);
  }
});

// Dukungan keyboard
document.addEventListener('keydown', (e) => {
  const key = e.key;
  const angka = /[\d.]/.test(key);
  const operator = ['+', '-', '*', '/', '%'].includes(key);
  
  if (angka || operator) {
    e.preventDefault();
    if (key === '*') append('×');
    else if (key === '/') append('÷');
    else if (key === '-') append('−');
    else append(key);
  } else if (key === 'Enter' || key === '=') {
    e.preventDefault();
    doEquals();
  } else if (key === 'Backspace') {
    e.preventDefault();
    backspace();
  } else if (key === 'Escape' || key === 'Delete') {
    e.preventDefault();
    clearAll();
  }
});