const display = document.getElementById('display');
const buttons = document.querySelectorAll('.buttons button');
const clearBtn = document.getElementById('clear');
const backspaceBtn = document.getElementById('backspace');
const equalsBtn = document.getElementById('equals');
const decimalBtn = document.getElementById('decimal');
const percentBtn = document.getElementById('percent');

let currentInput = '0';
let resetNext = false;

function updateDisplay() {
  if (currentInput === '') currentInput = '0';
  display.innerHTML = escapeHTML(currentInput) + '<span class="cursor">|</span>';
  adjustFontSize();
}

function escapeHTML(text) {
  // simple HTML escape to avoid issues in innerHTML
  return text.replace(/&/g, '&amp;')
             .replace(/</g, '&lt;')
             .replace(/>/g, '&gt;');
}

function adjustFontSize() {
  // Remove all shrink classes
  display.classList.remove('shrink-1', 'shrink-2', 'shrink-3');
  
  const len = currentInput.length;
  if (len > 14) {
    display.classList.add('shrink-3');
  } else if (len > 10) {
    display.classList.add('shrink-2');
  } else if (len > 7) {
    display.classList.add('shrink-1');
  }
}

function appendNumber(num) {
  if (resetNext) {
    currentInput = num;
    resetNext = false;
  } else {
    if (currentInput === '0') {
      currentInput = num;
    } else {
      currentInput += num;
    }
  }
  updateDisplay();
}

function appendDecimal() {
  if (resetNext) {
    currentInput = '0.';
    resetNext = false;
    updateDisplay();
    return;
  }
  if (!currentInput.includes('.')) {
    currentInput += '.';
  }
  updateDisplay();
}

function clearAll() {
  currentInput = '0';
  resetNext = false;
  updateDisplay();
}

function backspace() {
  if (resetNext) {
    clearAll();
    return;
  }
  if (currentInput.length === 1) {
    currentInput = '0';
  } else {
    currentInput = currentInput.slice(0, -1);
  }
  updateDisplay();
}

function calculate() {
  try {
    // Replace % with /100 for percentage handling
    let expression = currentInput.replace(/%/g, '/100');

    // Use eval safely - we limit input to digits and operators only
    if (!/^[0-9+\-*/.%\s]+$/.test(expression)) {
      throw new Error('Invalid characters');
    }

    let result = Function('"use strict";return (' + expression + ')')();

    if (result === Infinity || result === -Infinity || isNaN(result)) {
      currentInput = 'Error';
    } else {
      currentInput = result.toString();
    }
  } catch {
    currentInput = 'Error';
  }
  resetNext = true;
  updateDisplay();
}

// Handle percent button as input
function appendPercent() {
  if (resetNext) {
    currentInput = '0%';
    resetNext = false;
  } else if (!currentInput.endsWith('%')) {
    currentInput += '%';
  }
  updateDisplay();
}

// Button listeners
buttons.forEach(button => {
  if (button.hasAttribute('data-num')) {
    button.addEventListener('click', () => appendNumber(button.getAttribute('data-num')));
  } else if (button.hasAttribute('data-op')) {
    button.addEventListener('click', () => {
      if (resetNext) resetNext = false;
      if (/[+\-*/.]$/.test(currentInput)) {
        currentInput = currentInput.slice(0, -1) + button.getAttribute('data-op');
      } else {
        currentInput += button.getAttribute('data-op');
      }
      updateDisplay();
    });
  }
});

clearBtn.addEventListener('click', clearAll);
backspaceBtn.addEventListener('click', backspace);
equalsBtn.addEventListener('click', calculate);
decimalBtn.addEventListener('click', appendDecimal);
percentBtn.addEventListener('click', appendPercent);

// Initialize display
updateDisplay();
