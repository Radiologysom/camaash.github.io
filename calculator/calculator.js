function updateClock() {
  const clock = document.getElementById('clock');
  const now = new Date();
  const timeString = now.toLocaleTimeString();
  clock.textContent = timeString;
}
setInterval(updateClock, 1000);
updateClock();


const normalBtn = document.getElementById('normalBtn');
const syntheticBtn = document.getElementById('syntheticBtn');
const historyBtn = document.getElementById('historyBtn');
const unitConvertBtn = document.getElementById('unitConvertBtn');

const normalMode = document.getElementById('normal-mode');
const syntheticMode = document.getElementById('synthetic-mode');
const historyMode = document.getElementById('history-mode');
const unitConvertPanel = document.getElementById('unit-convert-panel');

const expressionDisplay = document.getElementById('expression');
const resultDisplay = document.getElementById('result');
const historyList = document.getElementById('history-list');

const buttonsNormal = normalMode.querySelectorAll('button');
const buttonsSynthetic = syntheticMode.querySelectorAll('button');

let currentExpression = '';
let history = [];
function setActiveButton(activeBtn) {
  [normalBtn, syntheticBtn, historyBtn, unitConvertBtn].forEach(btn => {
    btn.classList.remove('active');
  });
  activeBtn.classList.add('active');
}

function showPanel(panel) {
  normalMode.style.display = 'none';
  syntheticMode.style.display = 'none';
  historyMode.style.display = 'none';
  unitConvertPanel.style.display = 'none';

  if(panel === normalMode || panel === syntheticMode) {
    panel.style.display = 'grid';
  } else {
    panel.style.display = 'block';
  }
}

function updateDisplay() {
  expressionDisplay.textContent = currentExpression || '0';
  resultDisplay.textContent = '';
}

function appendToExpression(value) {
  const operators = ['+', '-', '*', '/', '^', '%', '.'];
  const lastChar = currentExpression.slice(-1);

  if(operators.includes(value)) {
    if(currentExpression === '' && (value !== '-' && value !== '.')) return; // can't start with operator except minus or dot
    if(operators.includes(lastChar)) {
      currentExpression = currentExpression.slice(0, -1); // replace last operator
    }
  }
  currentExpression += value;
  updateDisplay();
}

function clearExpression() {
  currentExpression = '';
  updateDisplay();
  resultDisplay.textContent = '';
}

function calculate() {
  if(!currentExpression) return;

  try {
   
    let expr = currentExpression.replace(/\^/g, '**');
    expr = expr.replace(/(\d+)%/g, '($1/100)');
    if(/[^0-9+\-*/().%^]/.test(expr)) {
      resultDisplay.textContent = 'Error';
      return;
    }

    let result = eval(expr);

    if(typeof result === 'number' && !isNaN(result) && isFinite(result)) {
      result = +result.toFixed(10); // fix floating point precision
      resultDisplay.textContent = result;
      history.push(`${currentExpression} = ${result}`);
      updateHistory();
      currentExpression = result.toString();
    } else {
      resultDisplay.textContent = 'Error';
    }
  } catch {
    resultDisplay.textContent = 'Error';
  }
}

function square() {
  if(!currentExpression) return;
  try {
    let val = eval(currentExpression);
    let sq = val * val;
    resultDisplay.textContent = sq;
    history.push(`${currentExpression}² = ${sq}`);
    updateHistory();
    currentExpression = sq.toString();
  } catch {
    resultDisplay.textContent = 'Error';
  }
}

function squareRoot() {
  if(!currentExpression) return;
  try {
    let val = eval(currentExpression);
    if(val < 0) {
      resultDisplay.textContent = 'Error';
      return;
    }
    let root = Math.sqrt(val);
    resultDisplay.textContent = root;
    history.push(`√(${currentExpression}) = ${root}`);
    updateHistory();
    currentExpression = root.toString();
  } catch {
    resultDisplay.textContent = 'Error';
  }
}

function updateHistory() {
  historyList.innerHTML = '';
  for(let item of history.slice(-20).reverse()) {
    const li = document.createElement('li');
    li.textContent = item;
    historyList.appendChild(li);
  }
}


normalBtn.addEventListener('click', () => {
  setActiveButton(normalBtn);
  showPanel(normalMode);
  updateDisplay();
});

syntheticBtn.addEventListener('click', () => {
  setActiveButton(syntheticBtn);
  showPanel(syntheticMode);
  updateDisplay();
});

historyBtn.addEventListener('click', () => {
  setActiveButton(historyBtn);
  showPanel(historyMode);
});

unitConvertBtn.addEventListener('click', () => {
  setActiveButton(unitConvertBtn);
  showPanel(unitConvertPanel);
});

buttonsNormal.forEach(button => {
  button.addEventListener('click', () => {
    const val = button.textContent;
    if(val === 'C') {
      clearExpression();
    } else if(val === '=') {
      calculate();
    } else {
      appendToExpression(val);
    }
  });
});

buttonsSynthetic.forEach(button => {
  button.addEventListener('click', () => {
    const val = button.textContent;
    if(val === 'C') {
      clearExpression();
    } else if(val === '=') {
      calculate();
    } else if(val === 'x²') {
      square();
    } else if(val === '√') {
      squareRoot();
    } else {
      appendToExpression(val);
    }
  });
});

const convertTypeSelect = document.getElementById('convert-type');
const fromUnitSelect = document.getElementById('from-unit');
const toUnitSelect = document.getElementById('to-unit');
const convertInput = document.getElementById('convert-input');
const convertBtn = document.getElementById('convert-btn');
const convertResult = document.getElementById('convert-result');

const unitsData = {
  length: {
    units: ['km', 'm'],
    convert: (val, from, to) => {
      if(from === to) return val;
      if(from === 'km' && to === 'm') return val * 1000;
      if(from === 'm' && to === 'km') return val / 1000;
    }
  },
  weight: {
    units: ['kg', 'g'],
    convert: (val, from, to) => {
      if(from === to) return val;
      if(from === 'kg' && to === 'g') return val * 1000;
      if(from === 'g' && to === 'kg') return val / 1000;
    }
  },
  temp: {
    units: ['°C', '°F'],
    convert: (val, from, to) => {
      if(from === to) return val;
      if(from === '°C' && to === '°F') return (val * 9/5) + 32;
      if(from === '°F' && to === '°C') return (val - 32) * 5/9;
    }
  }
};

function populateUnits(type) {
  fromUnitSelect.innerHTML = '';
  toUnitSelect.innerHTML = '';
  unitsData[type].units.forEach(unit => {
    const optionFrom = document.createElement('option');
    optionFrom.value = unit;
    optionFrom.textContent = unit;
    fromUnitSelect.appendChild(optionFrom);

    const optionTo = document.createElement('option');
    optionTo.value = unit;
    optionTo.textContent = unit;
    toUnitSelect.appendChild(optionTo);
  });
  fromUnitSelect.value = unitsData[type].units[0];
  toUnitSelect.value = unitsData[type].units[1];
  convertResult.textContent = '';
}

convertTypeSelect.addEventListener('change', () => {
  populateUnits(convertTypeSelect.value);
  convertInput.value = '';
});

convertBtn.addEventListener('click', () => {
  const val = parseFloat(convertInput.value);
  if(isNaN(val)) {
    convertResult.textContent = 'Please enter a valid number';
    return;
  }
  const type = convertTypeSelect.value;
  const from = fromUnitSelect.value;
  const to = toUnitSelect.value;
  const res = unitsData[type].convert(val, from, to);
  convertResult.textContent = `Result: ${res} ${to}`;
});


populateUnits(convertTypeSelect.value);
