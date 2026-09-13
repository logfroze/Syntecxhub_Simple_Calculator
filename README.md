# 🧮 SyntecxHub Simple Calculator

A simple Android calculator application built with **Kotlin and XML** as part of the **SyntecxHub Android Development Internship — Week 1**.

The project focuses on implementing core calculator functionality with clean code, input validation, division-by-zero handling, and a responsive Android UI supporting both portrait and landscape orientations.

---

## ✨ Features

- **Standard Operations:** Addition (+), Subtraction (−), Multiplication (×), Division (÷)
- **Decimal Calculations:** Precision handling for floating point arithmetic
- **Reset / Clear:** Instantly reset calculation state
- **Sign Toggle (±) & Backspace:** Easy editing of typed expressions
- **Division-by-Zero Handling:** Safe handling that prevents crashes and shows clear error messaging
- **Responsive Layouts:** Dedicated portrait and landscape (`layout-land`) layouts
- **Clean Architecture:** Separation between calculation logic (`Calculator.kt`) and presentation (`MainActivity.kt`)

---

## 🛠️ Built With

- **Kotlin**
- **XML**
- **Android Studio**
- **Android SDK** (Min SDK 24, Target SDK 34)
- **React + Vite + Tailwind CSS** (Interactive web-based Android simulator)

---

## 🚀 Getting Started

### 1. Android Studio (Native App)

1. Clone this repository:
   ```bash
   git clone https://github.com/logfroze/Syntecxhub_Simple_Calculator.git
   ```
2. Open the `android/` directory in **Android Studio**.
3. Allow Gradle to sync and download required dependencies.
4. Launch an Android emulator or connect a physical Android device with USB debugging enabled.
5. Click **Run 'app'**.

### 2. Interactive Web Simulator (Browser)

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the local development server:
   ```bash
   npm run dev
   ```
3. Open `http://localhost:3000` in your browser to test the calculator inside the interactive Android simulator.

---

## 🧪 Verified Test Cases

The calculator correctly handles edge cases and standard tests:
- `5 + 3 = 8`
- `10 - 4 = 6`
- `6 × 7 = 42`
- `20 ÷ 5 = 4`
- `10 ÷ 0 = Error` (gracefully handled without app crash)
- Floating point operations: `0.1 + 0.2 = 0.3`

---

## 📚 Internship Overview

This project was completed for **Task 1 — Simple Calculator App** during the **SyntecxHub Android Development Internship (Week 1)**.

---

## 👨‍💻 Author

**Muhammad Umar**  
GitHub: [@logfroze](https://github.com/logfroze)
