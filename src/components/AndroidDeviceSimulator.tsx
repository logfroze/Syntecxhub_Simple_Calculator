import React, { useState, useEffect } from 'react';
import { WebCalculatorEngine } from '../utils/calculatorEngine';
import { CalculatorOperation, CalculatorState, DeviceOrientation } from '../types';
import { RotateCw, RotateCcw, Wifi, BatteryCharging } from 'lucide-react';

export const AndroidDeviceSimulator: React.FC = () => {
  const [orientation, setOrientation] = useState<DeviceOrientation>('portrait');
  const [engine] = useState(() => new WebCalculatorEngine());
  const [calcState, setCalcState] = useState<CalculatorState>(() => engine.getState());

  const handleDigit = (digit: string) => {
    engine.appendDigit(digit);
    setCalcState(engine.getState());
  };

  const handleDecimal = () => {
    engine.appendDecimal();
    setCalcState(engine.getState());
  };

  const handleOperation = (op: CalculatorOperation) => {
    engine.setOperation(op);
    setCalcState(engine.getState());
  };

  const handleEquals = () => {
    engine.calculateResult();
    setCalcState(engine.getState());
  };

  const handleClear = () => {
    engine.clear();
    setCalcState(engine.getState());
  };

  const handleSign = () => {
    engine.toggleSign();
    setCalcState(engine.getState());
  };

  const handleBackspace = () => {
    engine.backspace();
    setCalcState(engine.getState());
  };

  // Keyboard support for testing convenience
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;

      if (e.key >= '0' && e.key <= '9') {
        e.preventDefault();
        handleDigit(e.key);
      } else if (e.key === '.') {
        e.preventDefault();
        handleDecimal();
      } else if (e.key === '+') {
        e.preventDefault();
        handleOperation('ADD');
      } else if (e.key === '-') {
        e.preventDefault();
        handleOperation('SUBTRACT');
      } else if (e.key === '*' || e.key === 'x') {
        e.preventDefault();
        handleOperation('MULTIPLY');
      } else if (e.key === '/') {
        e.preventDefault();
        handleOperation('DIVIDE');
      } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        handleEquals();
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        handleBackspace();
      } else if (e.key === 'Escape' || e.key === 'c' || e.key === 'C') {
        e.preventDefault();
        handleClear();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [calcState]);

  return (
    <div id="simulator-container" className="flex flex-col items-center justify-center w-full py-4">
      {/* The Android Device Mockup Frame */}
      <div
        id="android-device-frame"
        className={`relative bg-[#201C18] rounded-[44px] p-3.5 shadow-2xl ring-1 ring-[#38312A] transition-all duration-300 flex flex-col items-center ${
          orientation === 'portrait' ? 'w-[360px] min-h-[660px]' : 'w-[700px] min-h-[410px]'
        }`}
      >
        {/* Punch-hole camera */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-[#141210] rounded-full z-30 ring-1 ring-[#2E2822]"></div>

        {/* Android Screen Display Surface */}
        <div className="w-full h-full bg-[#FCFAF7] rounded-[32px] overflow-hidden flex flex-col relative select-none border border-[#ECE5DB]">
          {/* Android Status Bar */}
          <div className="w-full bg-[#F7F3EC] px-5 pt-2.5 pb-1 flex items-center justify-between text-[11px] font-medium text-stone-600">
            <span className="font-semibold text-stone-700">12:00</span>
            <div className="flex items-center gap-2 text-stone-500">
              <Wifi className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold">5G</span>
              <div className="flex items-center gap-0.5">
                <span className="text-[10px] font-medium">98%</span>
                <BatteryCharging className="w-3.5 h-3.5 text-amber-700" />
              </div>
            </div>
          </div>

          {/* Android Mobile App Bar: hosts Reset and Switch to Landscape/Portrait inside the screen */}
          <div className="w-full bg-[#F7F3EC] px-4 py-2.5 flex items-center justify-between border-b border-[#E8E0D4]">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-stone-900 tracking-tight">Calculator</span>
            </div>

            {/* In-screen Controls: Reset & Orientation Toggle with warm styling */}
            <div className="flex items-center gap-1.5">
              <button
                id="btn-mobile-reset"
                onClick={handleClear}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg text-stone-700 hover:text-stone-900 hover:bg-[#EAE2D5] active:bg-[#DFD5C5] transition-colors cursor-pointer"
                title="Reset Calculator"
              >
                <RotateCcw className="w-3.5 h-3.5 text-stone-500" />
                <span>Reset</span>
              </button>

              <button
                id="btn-mobile-orientation"
                onClick={() => setOrientation((prev) => (prev === 'portrait' ? 'landscape' : 'portrait'))}
                className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg bg-[#92400E] hover:bg-[#78350F] active:bg-[#5C270B] text-[#FFFDF8] transition-all shadow-xs cursor-pointer"
                title={`Switch to ${orientation === 'portrait' ? 'Landscape' : 'Portrait'}`}
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>{orientation === 'portrait' ? 'Landscape' : 'Portrait'}</span>
              </button>
            </div>
          </div>

          {/* Calculator Interface (Portrait vs Landscape) */}
          {orientation === 'portrait' ? (
            /* PORTRAIT LAYOUT */
            <div className="flex flex-col flex-1 bg-[#FCFAF7]">
              {/* Display Area */}
              <div
                id="displayContainer"
                className="bg-[#F7F3EC] px-6 py-5 flex flex-col justify-end items-end min-h-[160px] border-b border-[#E8E0D4]"
              >
                <div
                  id="tvExpression"
                  className="text-right text-[#78716C] text-base font-normal tracking-wide h-6 overflow-hidden text-ellipsis whitespace-nowrap w-full"
                >
                  {calcState.expressionText || ''}
                </div>
                <div
                  id="tvResult"
                  className={`text-right font-medium text-[#292524] tracking-tight mt-1 overflow-x-auto overflow-y-hidden whitespace-nowrap w-full scrollbar-none transition-all ${
                    calcState.errorMessage
                      ? 'text-red-700 text-2xl font-semibold'
                      : calcState.currentInput.length > 9
                      ? 'text-3xl'
                      : 'text-4xl'
                  }`}
                >
                  {calcState.currentInput}
                </div>
              </div>

              {/* Keypad 5x4 Grid */}
              <div id="keypadContainer" className="flex-1 p-3 flex flex-col justify-between gap-2.5 bg-[#FCFAF7]">
                {/* Row 1: C, ±, ⌫, ÷ */}
                <div className="flex gap-2.5 flex-1">
                  <button
                    id="btnClear"
                    onClick={handleClear}
                    className="flex-1 rounded-xl bg-[#EFE8DC] hover:bg-[#E4DACB] active:scale-95 text-[#C2410C] font-semibold text-lg py-3 flex items-center justify-center transition-all cursor-pointer border border-[#E7DECE]"
                  >
                    C
                  </button>
                  <button
                    id="btnPlusMinus"
                    onClick={handleSign}
                    className="flex-1 rounded-xl bg-[#EFE8DC] hover:bg-[#E4DACB] active:scale-95 text-[#44403C] font-semibold text-lg py-3 flex items-center justify-center transition-all cursor-pointer border border-[#E7DECE]"
                  >
                    ±
                  </button>
                  <button
                    id="btnBackspace"
                    onClick={handleBackspace}
                    className="flex-1 rounded-xl bg-[#EFE8DC] hover:bg-[#E4DACB] active:scale-95 text-[#44403C] font-semibold text-lg py-3 flex items-center justify-center transition-all cursor-pointer border border-[#E7DECE]"
                  >
                    ⌫
                  </button>
                  <button
                    id="btnDivide"
                    onClick={() => handleOperation('DIVIDE')}
                    className={`flex-1 rounded-xl font-bold text-xl py-3 flex items-center justify-center active:scale-95 transition-all cursor-pointer border ${
                      calcState.activeOperation === 'DIVIDE'
                        ? 'bg-[#92400E] text-white border-[#78350F] shadow-xs'
                        : 'bg-[#FEF3C7] hover:bg-[#FDE68A] text-[#92400E] border-[#FCD34D]/80'
                    }`}
                  >
                    ÷
                  </button>
                </div>

                {/* Row 2: 7, 8, 9, × */}
                <div className="flex gap-2.5 flex-1">
                  <button
                    id="btn7"
                    onClick={() => handleDigit('7')}
                    className="flex-1 rounded-xl bg-[#FAF7F2] hover:bg-[#F0EAE1] active:scale-95 text-[#292524] font-medium text-xl py-3 flex items-center justify-center transition-all cursor-pointer border border-[#EDE5D8]"
                  >
                    7
                  </button>
                  <button
                    id="btn8"
                    onClick={() => handleDigit('8')}
                    className="flex-1 rounded-xl bg-[#FAF7F2] hover:bg-[#F0EAE1] active:scale-95 text-[#292524] font-medium text-xl py-3 flex items-center justify-center transition-all cursor-pointer border border-[#EDE5D8]"
                  >
                    8
                  </button>
                  <button
                    id="btn9"
                    onClick={() => handleDigit('9')}
                    className="flex-1 rounded-xl bg-[#FAF7F2] hover:bg-[#F0EAE1] active:scale-95 text-[#292524] font-medium text-xl py-3 flex items-center justify-center transition-all cursor-pointer border border-[#EDE5D8]"
                  >
                    9
                  </button>
                  <button
                    id="btnMultiply"
                    onClick={() => handleOperation('MULTIPLY')}
                    className={`flex-1 rounded-xl font-bold text-xl py-3 flex items-center justify-center active:scale-95 transition-all cursor-pointer border ${
                      calcState.activeOperation === 'MULTIPLY'
                        ? 'bg-[#92400E] text-white border-[#78350F] shadow-xs'
                        : 'bg-[#FEF3C7] hover:bg-[#FDE68A] text-[#92400E] border-[#FCD34D]/80'
                    }`}
                  >
                    ×
                  </button>
                </div>

                {/* Row 3: 4, 5, 6, − */}
                <div className="flex gap-2.5 flex-1">
                  <button
                    id="btn4"
                    onClick={() => handleDigit('4')}
                    className="flex-1 rounded-xl bg-[#FAF7F2] hover:bg-[#F0EAE1] active:scale-95 text-[#292524] font-medium text-xl py-3 flex items-center justify-center transition-all cursor-pointer border border-[#EDE5D8]"
                  >
                    4
                  </button>
                  <button
                    id="btn5"
                    onClick={() => handleDigit('5')}
                    className="flex-1 rounded-xl bg-[#FAF7F2] hover:bg-[#F0EAE1] active:scale-95 text-[#292524] font-medium text-xl py-3 flex items-center justify-center transition-all cursor-pointer border border-[#EDE5D8]"
                  >
                    5
                  </button>
                  <button
                    id="btn6"
                    onClick={() => handleDigit('6')}
                    className="flex-1 rounded-xl bg-[#FAF7F2] hover:bg-[#F0EAE1] active:scale-95 text-[#292524] font-medium text-xl py-3 flex items-center justify-center transition-all cursor-pointer border border-[#EDE5D8]"
                  >
                    6
                  </button>
                  <button
                    id="btnSubtract"
                    onClick={() => handleOperation('SUBTRACT')}
                    className={`flex-1 rounded-xl font-bold text-xl py-3 flex items-center justify-center active:scale-95 transition-all cursor-pointer border ${
                      calcState.activeOperation === 'SUBTRACT'
                        ? 'bg-[#92400E] text-white border-[#78350F] shadow-xs'
                        : 'bg-[#FEF3C7] hover:bg-[#FDE68A] text-[#92400E] border-[#FCD34D]/80'
                    }`}
                  >
                    −
                  </button>
                </div>

                {/* Row 4: 1, 2, 3, + */}
                <div className="flex gap-2.5 flex-1">
                  <button
                    id="btn1"
                    onClick={() => handleDigit('1')}
                    className="flex-1 rounded-xl bg-[#FAF7F2] hover:bg-[#F0EAE1] active:scale-95 text-[#292524] font-medium text-xl py-3 flex items-center justify-center transition-all cursor-pointer border border-[#EDE5D8]"
                  >
                    1
                  </button>
                  <button
                    id="btn2"
                    onClick={() => handleDigit('2')}
                    className="flex-1 rounded-xl bg-[#FAF7F2] hover:bg-[#F0EAE1] active:scale-95 text-[#292524] font-medium text-xl py-3 flex items-center justify-center transition-all cursor-pointer border border-[#EDE5D8]"
                  >
                    2
                  </button>
                  <button
                    id="btn3"
                    onClick={() => handleDigit('3')}
                    className="flex-1 rounded-xl bg-[#FAF7F2] hover:bg-[#F0EAE1] active:scale-95 text-[#292524] font-medium text-xl py-3 flex items-center justify-center transition-all cursor-pointer border border-[#EDE5D8]"
                  >
                    3
                  </button>
                  <button
                    id="btnAdd"
                    onClick={() => handleOperation('ADD')}
                    className={`flex-1 rounded-xl font-bold text-xl py-3 flex items-center justify-center active:scale-95 transition-all cursor-pointer border ${
                      calcState.activeOperation === 'ADD'
                        ? 'bg-[#92400E] text-white border-[#78350F] shadow-xs'
                        : 'bg-[#FEF3C7] hover:bg-[#FDE68A] text-[#92400E] border-[#FCD34D]/80'
                    }`}
                  >
                    +
                  </button>
                </div>

                {/* Row 5: 0, ., = */}
                <div className="flex gap-2.5 flex-1">
                  <button
                    id="btn0"
                    onClick={() => handleDigit('0')}
                    className="flex-[2] rounded-xl bg-[#FAF7F2] hover:bg-[#F0EAE1] active:scale-95 text-[#292524] font-medium text-xl py-3 flex items-center justify-center transition-all cursor-pointer border border-[#EDE5D8]"
                  >
                    0
                  </button>
                  <button
                    id="btnDot"
                    onClick={handleDecimal}
                    className="flex-1 rounded-xl bg-[#FAF7F2] hover:bg-[#F0EAE1] active:scale-95 text-[#292524] font-bold text-xl py-3 flex items-center justify-center transition-all cursor-pointer border border-[#EDE5D8]"
                  >
                    .
                  </button>
                  <button
                    id="btnEquals"
                    onClick={handleEquals}
                    className="flex-1 rounded-xl bg-[#B45309] hover:bg-[#92400E] active:scale-95 text-[#FFFDF8] font-bold text-2xl py-3 flex items-center justify-center transition-all shadow-sm cursor-pointer border border-[#92400E]"
                  >
                    =
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* LANDSCAPE LAYOUT: matches res/layout-land/activity_main.xml */
            <div className="flex flex-1 bg-[#FCFAF7] overflow-hidden">
              {/* Left Side: Display Panel (42% width) */}
              <div
                id="displayContainerLand"
                className="w-[42%] bg-[#F7F3EC] p-5 flex flex-col justify-between items-end border-r border-[#E8E0D4]"
              >
                <div className="w-full text-left text-[11px] font-medium text-stone-500 uppercase tracking-wider">
                  Formula &amp; Result
                </div>
                <div className="w-full text-right my-auto space-y-1">
                  <div
                    id="tvExpression"
                    className="text-right text-[#78716C] text-sm font-normal tracking-wide h-5 overflow-hidden text-ellipsis whitespace-nowrap w-full"
                  >
                    {calcState.expressionText || ''}
                  </div>
                  <div
                    id="tvResult"
                    className={`text-right font-medium text-[#292524] tracking-tight overflow-x-auto overflow-y-hidden whitespace-nowrap w-full scrollbar-none transition-all ${
                      calcState.errorMessage
                        ? 'text-red-700 text-xl font-semibold'
                        : calcState.currentInput.length > 8
                        ? 'text-2xl'
                        : 'text-3xl'
                    }`}
                  >
                    {calcState.currentInput}
                  </div>
                </div>
                <div className="w-full text-left text-[10px] text-stone-500">
                  Landscape layout active
                </div>
              </div>

              {/* Right Side: Keypad Grid (58% width) */}
              <div id="keypadContainerLand" className="w-[58%] p-2.5 flex flex-col justify-between gap-1.5 bg-[#FCFAF7]">
                {/* Row 1: C, ±, ⌫, ÷ */}
                <div className="flex gap-1.5 flex-1">
                  <button
                    onClick={handleClear}
                    className="flex-1 rounded-lg bg-[#EFE8DC] hover:bg-[#E4DACB] active:scale-95 text-[#C2410C] font-semibold text-base py-1.5 flex items-center justify-center transition-all cursor-pointer border border-[#E7DECE]"
                  >
                    C
                  </button>
                  <button
                    onClick={handleSign}
                    className="flex-1 rounded-lg bg-[#EFE8DC] hover:bg-[#E4DACB] active:scale-95 text-[#44403C] font-semibold text-base py-1.5 flex items-center justify-center transition-all cursor-pointer border border-[#E7DECE]"
                  >
                    ±
                  </button>
                  <button
                    onClick={handleBackspace}
                    className="flex-1 rounded-lg bg-[#EFE8DC] hover:bg-[#E4DACB] active:scale-95 text-[#44403C] font-semibold text-base py-1.5 flex items-center justify-center transition-all cursor-pointer border border-[#E7DECE]"
                  >
                    ⌫
                  </button>
                  <button
                    onClick={() => handleOperation('DIVIDE')}
                    className={`flex-1 rounded-lg font-bold text-lg py-1.5 flex items-center justify-center active:scale-95 transition-all cursor-pointer border ${
                      calcState.activeOperation === 'DIVIDE'
                        ? 'bg-[#92400E] text-white border-[#78350F] shadow-xs'
                        : 'bg-[#FEF3C7] hover:bg-[#FDE68A] text-[#92400E] border-[#FCD34D]/80'
                    }`}
                  >
                    ÷
                  </button>
                </div>

                {/* Row 2: 7, 8, 9, × */}
                <div className="flex gap-1.5 flex-1">
                  <button
                    onClick={() => handleDigit('7')}
                    className="flex-1 rounded-lg bg-[#FAF7F2] hover:bg-[#F0EAE1] active:scale-95 text-[#292524] font-medium text-lg py-1.5 flex items-center justify-center transition-all cursor-pointer border border-[#EDE5D8]"
                  >
                    7
                  </button>
                  <button
                    onClick={() => handleDigit('8')}
                    className="flex-1 rounded-lg bg-[#FAF7F2] hover:bg-[#F0EAE1] active:scale-95 text-[#292524] font-medium text-lg py-1.5 flex items-center justify-center transition-all cursor-pointer border border-[#EDE5D8]"
                  >
                    8
                  </button>
                  <button
                    onClick={() => handleDigit('9')}
                    className="flex-1 rounded-lg bg-[#FAF7F2] hover:bg-[#F0EAE1] active:scale-95 text-[#292524] font-medium text-lg py-1.5 flex items-center justify-center transition-all cursor-pointer border border-[#EDE5D8]"
                  >
                    9
                  </button>
                  <button
                    onClick={() => handleOperation('MULTIPLY')}
                    className={`flex-1 rounded-lg font-bold text-lg py-1.5 flex items-center justify-center active:scale-95 transition-all cursor-pointer border ${
                      calcState.activeOperation === 'MULTIPLY'
                        ? 'bg-[#92400E] text-white border-[#78350F] shadow-xs'
                        : 'bg-[#FEF3C7] hover:bg-[#FDE68A] text-[#92400E] border-[#FCD34D]/80'
                    }`}
                  >
                    ×
                  </button>
                </div>

                {/* Row 3: 4, 5, 6, − */}
                <div className="flex gap-1.5 flex-1">
                  <button
                    onClick={() => handleDigit('4')}
                    className="flex-1 rounded-lg bg-[#FAF7F2] hover:bg-[#F0EAE1] active:scale-95 text-[#292524] font-medium text-lg py-1.5 flex items-center justify-center transition-all cursor-pointer border border-[#EDE5D8]"
                  >
                    4
                  </button>
                  <button
                    onClick={() => handleDigit('5')}
                    className="flex-1 rounded-lg bg-[#FAF7F2] hover:bg-[#F0EAE1] active:scale-95 text-[#292524] font-medium text-lg py-1.5 flex items-center justify-center transition-all cursor-pointer border border-[#EDE5D8]"
                  >
                    5
                  </button>
                  <button
                    onClick={() => handleDigit('6')}
                    className="flex-1 rounded-lg bg-[#FAF7F2] hover:bg-[#F0EAE1] active:scale-95 text-[#292524] font-medium text-lg py-1.5 flex items-center justify-center transition-all cursor-pointer border border-[#EDE5D8]"
                  >
                    6
                  </button>
                  <button
                    onClick={() => handleOperation('SUBTRACT')}
                    className={`flex-1 rounded-lg font-bold text-lg py-1.5 flex items-center justify-center active:scale-95 transition-all cursor-pointer border ${
                      calcState.activeOperation === 'SUBTRACT'
                        ? 'bg-[#92400E] text-white border-[#78350F] shadow-xs'
                        : 'bg-[#FEF3C7] hover:bg-[#FDE68A] text-[#92400E] border-[#FCD34D]/80'
                    }`}
                  >
                    −
                  </button>
                </div>

                {/* Row 4: 1, 2, 3, + */}
                <div className="flex gap-1.5 flex-1">
                  <button
                    onClick={() => handleDigit('1')}
                    className="flex-1 rounded-lg bg-[#FAF7F2] hover:bg-[#F0EAE1] active:scale-95 text-[#292524] font-medium text-lg py-1.5 flex items-center justify-center transition-all cursor-pointer border border-[#EDE5D8]"
                  >
                    1
                  </button>
                  <button
                    onClick={() => handleDigit('2')}
                    className="flex-1 rounded-lg bg-[#FAF7F2] hover:bg-[#F0EAE1] active:scale-95 text-[#292524] font-medium text-lg py-1.5 flex items-center justify-center transition-all cursor-pointer border border-[#EDE5D8]"
                  >
                    2
                  </button>
                  <button
                    onClick={() => handleDigit('3')}
                    className="flex-1 rounded-lg bg-[#FAF7F2] hover:bg-[#F0EAE1] active:scale-95 text-[#292524] font-medium text-lg py-1.5 flex items-center justify-center transition-all cursor-pointer border border-[#EDE5D8]"
                  >
                    3
                  </button>
                  <button
                    onClick={() => handleOperation('ADD')}
                    className={`flex-1 rounded-lg font-bold text-lg py-1.5 flex items-center justify-center active:scale-95 transition-all cursor-pointer border ${
                      calcState.activeOperation === 'ADD'
                        ? 'bg-[#92400E] text-white border-[#78350F] shadow-xs'
                        : 'bg-[#FEF3C7] hover:bg-[#FDE68A] text-[#92400E] border-[#FCD34D]/80'
                    }`}
                  >
                    +
                  </button>
                </div>

                {/* Row 5: 0 (span 2), ., = */}
                <div className="flex gap-1.5 flex-1">
                  <button
                    onClick={() => handleDigit('0')}
                    className="flex-[2] rounded-lg bg-[#FAF7F2] hover:bg-[#F0EAE1] active:scale-95 text-[#292524] font-medium text-lg py-1.5 flex items-center justify-center transition-all cursor-pointer border border-[#EDE5D8]"
                  >
                    0
                  </button>
                  <button
                    onClick={handleDecimal}
                    className="flex-1 rounded-lg bg-[#FAF7F2] hover:bg-[#F0EAE1] active:scale-95 text-[#292524] font-bold text-lg py-1.5 flex items-center justify-center transition-all cursor-pointer border border-[#EDE5D8]"
                  >
                    .
                  </button>
                  <button
                    onClick={handleEquals}
                    className="flex-1 rounded-lg bg-[#B45309] hover:bg-[#92400E] active:scale-95 text-[#FFFDF8] font-bold text-xl py-1.5 flex items-center justify-center transition-all shadow-xs cursor-pointer border border-[#92400E]"
                  >
                    =
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Android Navigation Bar (Clean Gesture Pill) */}
          <div className="w-full bg-[#F7F3EC] py-2 flex items-center justify-center border-t border-[#E8E0D4]">
            <span className="w-28 h-1 rounded-full bg-stone-400/80"></span>
          </div>
        </div>
      </div>
    </div>
  );
};
