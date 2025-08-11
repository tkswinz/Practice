class Calculator {
    constructor(previousOperandTextElement, currentOperandTextElement) {
        this.previousOperandTextElement = previousOperandTextElement;
        this.currentOperandTextElement = currentOperandTextElement;
        this.clear();
    }

    clear() {
        this.currentOperand = '';
        this.previousOperand = '';
        this.operation = undefined;
        this.updateDisplay();
    }

    deleteLast() {
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
        if (this.currentOperand === '') {
            this.currentOperand = '0';
        }
        this.updateDisplay();
    }

    appendNumber(number) {
        if (number === '.' && this.currentOperand.includes('.')) return;
        
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number;
        } else {
            this.currentOperand = this.currentOperand.toString() + number.toString();
        }
        
        this.updateDisplay();
    }

    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        if (this.previousOperand !== '') {
            this.compute();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
        this.updateDisplay();
    }

    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        
        if (isNaN(prev) || isNaN(current)) return;
        
        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '×':
                computation = prev * current;
                break;
            case '÷':
                if (current === 0) {
                    alert('Cannot divide by zero!');
                    return;
                }
                computation = prev / current;
                break;
            case '%':
                computation = prev % current;
                break;
            default:
                return;
        }
        
        // Round to avoid floating point precision issues
        computation = Math.round((computation + Number.EPSILON) * 100000000) / 100000000;
        
        this.currentOperand = computation;
        this.operation = undefined;
        this.previousOperand = '';
        this.updateDisplay();
    }

    getDisplayNumber(number) {
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        let integerDisplay;
        
        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 });
        }
        
        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }

    updateDisplay() {
        if (this.currentOperand === '') {
            this.currentOperandTextElement.innerText = '0';
        } else {
            this.currentOperandTextElement.innerText = this.getDisplayNumber(this.currentOperand);
        }
        
        if (this.operation != null) {
            this.previousOperandTextElement.innerText = 
                `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
        } else {
            this.previousOperandTextElement.innerText = '';
        }
    }
}

// Initialize calculator
const previousOperandTextElement = document.getElementById('previousOperand');
const currentOperandTextElement = document.getElementById('currentOperand');

const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement);

// Add keyboard support
document.addEventListener('keydown', function(event) {
    const key = event.key;
    
    // Numbers and decimal point
    if (key >= '0' && key <= '9' || key === '.') {
        calculator.appendNumber(key);
        animateButton(key);
    }
    
    // Operations
    if (key === '+') {
        calculator.chooseOperation('+');
        animateButton('+');
    }
    if (key === '-') {
        calculator.chooseOperation('-');
        animateButton('-');
    }
    if (key === '*') {
        calculator.chooseOperation('×');
        animateButton('×');
    }
    if (key === '/') {
        event.preventDefault(); // Prevent browser search
        calculator.chooseOperation('÷');
        animateButton('÷');
    }
    if (key === '%') {
        calculator.chooseOperation('%');
        animateButton('%');
    }
    
    // Special keys
    if (key === 'Enter' || key === '=') {
        calculator.compute();
        animateButton('=');
    }
    if (key === 'Escape') {
        calculator.clear();
        animateButton('AC');
    }
    if (key === 'Backspace') {
        calculator.deleteLast();
        animateButton('⌫');
    }
});

// Function to animate button press
function animateButton(buttonText) {
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        if (button.innerText === buttonText) {
            button.classList.add('pressed');
            setTimeout(() => {
                button.classList.remove('pressed');
            }, 100);
        }
    });
}

// Add click animation to all buttons
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function() {
        this.classList.add('pressed');
        setTimeout(() => {
            this.classList.remove('pressed');
        }, 100);
    });
});

// Add some visual feedback for operations
function highlightOperation(operation) {
    const operatorButtons = document.querySelectorAll('.btn-operator');
    operatorButtons.forEach(button => {
        if (button.innerText === operation) {
            button.style.background = 'linear-gradient(135deg, #ff5252, #e53935)';
            button.style.transform = 'scale(1.05)';
        } else {
            button.style.background = 'linear-gradient(135deg, #ff6b6b, #ee5a52)';
            button.style.transform = 'scale(1)';
        }
    });
}

// Enhanced error handling
window.addEventListener('error', function(event) {
    console.error('Calculator error:', event.error);
    calculator.clear();
    alert('An error occurred. Calculator has been reset.');
});

// Add some fun easter eggs
let clickCount = 0;
document.querySelector('.display').addEventListener('click', function() {
    clickCount++;
    if (clickCount === 10) {
        this.style.background = 'linear-gradient(45deg, #ff6b6b, #4ecdc4, #667eea, #764ba2)';
        this.style.backgroundSize = '400% 400%';
        this.style.animation = 'gradientShift 3s ease infinite';
        
        // Add CSS animation dynamically
        const style = document.createElement('style');
        style.textContent = `
            @keyframes gradientShift {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
            }
        `;
        document.head.appendChild(style);
        
        setTimeout(() => {
            this.style.background = 'rgba(0, 0, 0, 0.3)';
            this.style.animation = '';
            clickCount = 0;
        }, 5000);
    }
});

console.log('🧮 Beautiful Calculator loaded successfully!');
console.log('💡 Tip: You can use your keyboard to operate the calculator!');
console.log('⌨️  Keyboard shortcuts:');
console.log('   Numbers: 0-9');
console.log('   Operators: +, -, *, /, %');
console.log('   Calculate: Enter or =');
console.log('   Clear: Escape');
console.log('   Delete: Backspace');
console.log('🎉 Try clicking the display 10 times for a surprise!');
