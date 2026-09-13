export type DeviceOrientation = 'portrait' | 'landscape';

export type CalculatorOperation = 'ADD' | 'SUBTRACT' | 'MULTIPLY' | 'DIVIDE';

export interface CalculatorState {
  currentInput: string;
  previousNumber: number | null;
  activeOperation: CalculatorOperation | null;
  expressionText: string;
  isResultDisplayed: boolean;
  errorMessage: string | null;
}

export interface LogcatEntry {
  id: string;
  timestamp: string;
  tag: string;
  level: 'D' | 'I' | 'W' | 'E';
  message: string;
}

export interface VerificationTest {
  id: string;
  label: string;
  expression: string;
  expectedResult: string;
  description: string;
}
