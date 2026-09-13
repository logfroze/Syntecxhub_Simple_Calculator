import { CalculatorOperation, CalculatorState } from '../types';

export class WebCalculatorEngine {
  private state: CalculatorState = {
    currentInput: '0',
    previousNumber: null,
    activeOperation: null,
    expressionText: '',
    isResultDisplayed: false,
    errorMessage: null,
  };

  getState(): CalculatorState {
    return { ...this.state };
  }

  appendDigit(digit: string): void {
    if (this.state.errorMessage !== null || this.state.isResultDisplayed) {
      this.state.currentInput = digit;
      this.state.isResultDisplayed = false;
      this.state.errorMessage = null;
      if (this.state.activeOperation === null) {
        this.state.expressionText = '';
      }
      return;
    }

    if (this.state.currentInput === '0') {
      this.state.currentInput = digit;
    } else if (this.state.currentInput === '-0') {
      this.state.currentInput = `-${digit}`;
    } else if (this.state.currentInput.replace(/[-.]/g, '').length < 15) {
      this.state.currentInput += digit;
    }
  }

  appendDecimal(): void {
    if (this.state.errorMessage !== null || this.state.isResultDisplayed) {
      this.state.currentInput = '0.';
      this.state.isResultDisplayed = false;
      this.state.errorMessage = null;
      if (this.state.activeOperation === null) {
        this.state.expressionText = '';
      }
      return;
    }

    if (!this.state.currentInput.includes('.')) {
      this.state.currentInput += '.';
    }
  }

  toggleSign(): void {
    if (this.state.errorMessage !== null) return;

    if (this.state.currentInput === '0' || this.state.currentInput === '') {
      return;
    }

    if (this.state.currentInput.startsWith('-')) {
      this.state.currentInput = this.state.currentInput.substring(1);
    } else {
      this.state.currentInput = `-${this.state.currentInput}`;
    }
  }

  backspace(): void {
    if (this.state.errorMessage !== null || this.state.isResultDisplayed) {
      this.clear();
      return;
    }

    if (this.state.currentInput.length > 1) {
      this.state.currentInput = this.state.currentInput.slice(0, -1);
      if (this.state.currentInput === '-' || this.state.currentInput === '') {
        this.state.currentInput = '0';
      }
    } else {
      this.state.currentInput = '0';
    }
  }

  setOperation(operation: CalculatorOperation): void {
    if (this.state.errorMessage !== null) {
      this.clear();
      return;
    }

    // Chaining operations: compute intermediate result if another operator pressed
    if (this.state.activeOperation !== null && !this.state.isResultDisplayed) {
      this.calculateResult(true);
      if (this.state.errorMessage !== null) return;
    }

    const currentVal = this.parseNumber(this.state.currentInput);
    this.state.previousNumber = currentVal;
    this.state.activeOperation = operation;
    const opSymbol = this.getOperationSymbol(operation);
    this.state.expressionText = `${this.formatNumber(currentVal)} ${opSymbol}`;
    this.state.isResultDisplayed = true;
  }

  calculateResult(chainingOperation = false): void {
    if (this.state.errorMessage !== null) return;

    const prev = this.state.previousNumber;
    const op = this.state.activeOperation;

    if (prev === null || op === null) {
      return;
    }

    const currentVal = this.parseNumber(this.state.currentInput);

    // Division by zero check
    if (op === 'DIVIDE' && currentVal === 0) {
      this.state.errorMessage = 'Cannot divide by zero';
      this.state.expressionText = `${this.formatNumber(prev)} ÷ 0 =`;
      this.state.currentInput = 'Cannot divide by zero';
      this.state.previousNumber = null;
      this.state.activeOperation = null;
      this.state.isResultDisplayed = true;
      return;
    }

    let result = 0;
    switch (op) {
      case 'ADD':
        result = prev + currentVal;
        break;
      case 'SUBTRACT':
        result = prev - currentVal;
        break;
      case 'MULTIPLY':
        result = prev * currentVal;
        break;
      case 'DIVIDE':
        result = prev / currentVal;
        break;
    }

    const opSymbol = this.getOperationSymbol(op);

    if (!chainingOperation) {
      this.state.expressionText = `${this.formatNumber(prev)} ${opSymbol} ${this.formatNumber(currentVal)} =`;
      this.state.activeOperation = null;
      this.state.previousNumber = null;
    } else {
      this.state.previousNumber = result;
    }

    this.state.currentInput = this.formatNumber(result);
    this.state.isResultDisplayed = true;
  }

  clear(): void {
    this.state = {
      currentInput: '0',
      previousNumber: null,
      activeOperation: null,
      expressionText: '',
      isResultDisplayed: false,
      errorMessage: null,
    };
  }

  private parseNumber(val: string): number {
    const num = parseFloat(val.replace(/,/g, ''));
    return isNaN(num) ? 0 : num;
  }

  formatNumber(num: number): string {
    if (!isFinite(num) || isNaN(num)) {
      return 'Error';
    }

    const safeNum = num === -0 ? 0 : num;

    if (Math.abs(safeNum) >= 1e12 || (Math.abs(safeNum) > 0 && Math.abs(safeNum) < 1e-6)) {
      return safeNum.toExponential(6).replace('e+', 'E').replace('e-', 'E-');
    }

    // Format with max 10 decimals and drop trailing zeros
    const rounded = parseFloat(safeNum.toFixed(10));
    return rounded.toLocaleString('en-US', {
      maximumFractionDigits: 10,
    });
  }

  private getOperationSymbol(op: CalculatorOperation): string {
    switch (op) {
      case 'ADD':
        return '+';
      case 'SUBTRACT':
        return '−';
      case 'MULTIPLY':
        return '×';
      case 'DIVIDE':
        return '÷';
    }
  }
}
