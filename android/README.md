# SyntecxHub Android Development Internship — Week 1
## Project 1: Simple Calculator App

A clean, responsive, hand-crafted Android calculator application developed in **Kotlin** and **XML layouts** following standard Android architecture principles.

---

### Features & Capabilities
- **Arithmetic Operations:** Addition (`+`), Subtraction (`−`), Multiplication (`×`), Division (`÷`).
- **Data Types:** Full support for integer and floating-point decimal numbers (`.`).
- **Sign Inversion:** Positive and negative number toggle (`±`).
- **Editing Tools:** Clear (`C`) to reset state and Backspace (`⌫`) to correct single digits.
- **Input Validation & Safety:**
  - Gracefully catches division by zero with `"Cannot divide by zero"` without crashing.
  - Prevents multiple consecutive decimal points.
  - Formats results cleanly, stripping unnecessary trailing zeros (e.g., `8` instead of `8.0`).
- **Responsive Layouts:**
  - **Portrait (`res/layout/activity_main.xml`):** Traditional 5-row keypad with top calculation display.
  - **Landscape (`res/layout-land/activity_main.xml`):** Split horizontal view with left-hand display and right-hand keypad to prevent screen squishing and maintain ergonomic button sizes.
- **Architecture:** Separated calculation engine (`Calculator.kt`) from Activity UI logic (`MainActivity.kt`).

---

### Project Structure
```text
SyntecxHubCalculator/
├── app/
│   ├── build.gradle.kts
│   ├── src/
│   │   ├── main/
│   │   │   ├── AndroidManifest.xml
│   │   │   ├── java/com/example/syntecxhubcalculator/
│   │   │   │   ├── MainActivity.kt        # UI event binding and display updates
│   │   │   │   └── Calculator.kt          # Standalone calculation engine
│   │   │   └── res/
│   │   │       ├── layout/
│   │   │       │   └── activity_main.xml  # Portrait layout
│   │   │       ├── layout-land/
│   │   │       │   └── activity_main.xml  # Landscape layout
│   │   │       └── values/
│   │   │           ├── colors.xml         # Solid, restrained color palette
│   │   │           ├── strings.xml        # Localized string resources
│   │   │           └── themes.xml         # Material styles & button definitions
│   │   └── test/
│   │       └── java/com/example/syntecxhubcalculator/
│   │           └── CalculatorTest.kt      # JUnit unit test suite
├── gradle/
│   └── libs.versions.toml                 # Version catalog
├── build.gradle.kts                       # Root build configuration
├── settings.gradle.kts                    # Project settings
└── README.md
```

---

### How to Run in Android Studio
1. Open **Android Studio** (Hedgehog, Iguana, Jellyfish, or newer).
2. Click **File > Open...** and select the `SyntecxHubCalculator` project root folder.
3. Allow Gradle to sync dependencies.
4. Select an Android Emulator or connected physical device (Android 7.0 / API 24 or higher).
5. Click the green **Run** button (`Shift + F10`).
6. Rotate the emulator (`Ctrl + Left/Right Arrow`) to test both **Portrait** and **Landscape** modes.
7. Run the unit tests by right-clicking `CalculatorTest.kt` > **Run 'CalculatorTest'**.
