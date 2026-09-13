/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AndroidDeviceSimulator } from './components/AndroidDeviceSimulator';

export default function App() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] text-stone-800 flex flex-col font-sans selection:bg-amber-100">
      {/* Clean, Minimal Application Header */}
      <header className="bg-white/90 backdrop-blur-xs border-b border-[#EDE5D8] sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-[#92400E] flex items-center justify-center text-[#FFFDF8] font-semibold text-sm shadow-xs">
              ÷
            </div>
            <h1 className="text-sm font-semibold text-stone-900 tracking-tight">
              SyntecxHub Calculator
            </h1>
            <span className="text-[11px] text-stone-700 bg-[#F5EDE0] px-2 py-0.5 rounded font-medium border border-[#E7DECE]">
              Kotlin &amp; XML
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 flex flex-col justify-center">
        <AndroidDeviceSimulator />
      </main>

      {/* Subtle Minimal Footer */}
      <footer className="py-3 text-center text-xs text-slate-600">
        SyntecxHub Android Development Internship · Week 1 Simple Calculator
      </footer>
    </div>
  );
}
