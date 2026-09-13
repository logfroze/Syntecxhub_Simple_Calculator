export interface AndroidProjectFile {
  path: string;
  name: string;
  category: 'kotlin' | 'xml' | 'gradle' | 'manifest' | 'docs';
  language: string;
  description: string;
  content: string;
}

export const ANDROID_PROJECT_FILES: AndroidProjectFile[] = [
  {
    path: 'app/src/main/java/com/example/syntecxhubcalculator/Calculator.kt',
    name: 'Calculator.kt',
    category: 'kotlin',
    language: 'kotlin',
    description: 'Standalone calculation engine, arithmetic evaluation, state management, and zero-division protection.',
    content: `package com.example.syntecxhubcalculator

import java.text.DecimalFormat
import java.text.DecimalFormatSymbols
import java.util.Locale

/**
 * Calculator
 *
 * Handles arithmetic logic, state transitions, and input validation
 * independently of Android UI and View lifecycle.
 *
 * Part of SyntecxHub Android Development Internship - Project 1.
 */
class Calculator {

    enum class Operation(val symbol: String) {
        ADD("+"),
        SUBTRACT("−"),
        MULTIPLY("×"),
        DIVIDE("÷")
    }

    var currentInput: String = "0"
        private set

    var previousNumber: Double? = null
        private set

    var activeOperation: Operation? = null
        private set

    var expressionText: String = ""
        private set

    var isResultDisplayed: Boolean = false
        private set

    var errorMessage: String? = null
        private set

    /**
     * Appends a digit (0-9) to the current input buffer.
     */
    fun appendDigit(digit: String) {
        if (errorMessage != null || isResultDisplayed) {
            currentInput = digit
            isResultDisplayed = false
            errorMessage = null
            if (activeOperation == null) {
                expressionText = ""
            }
            return
        }

        if (currentInput == "0") {
            currentInput = digit
        } else if (currentInput == "-0") {
            currentInput = "-$digit"
        } else if (currentInput.replace("-", "").replace(".", "").length < 15) {
            currentInput += digit
        }
    }

    /**
     * Appends a decimal point if one is not already present in the current number.
     */
    fun appendDecimal() {
        if (errorMessage != null || isResultDisplayed) {
            currentInput = "0."
            isResultDisplayed = false
            errorMessage = null
            if (activeOperation == null) {
                expressionText = ""
            }
            return
        }

        if (!currentInput.contains(".")) {
            currentInput += "."
        }
    }

    /**
     * Toggles the sign (positive / negative) of the current number.
     */
    fun toggleSign() {
        if (errorMessage != null) return

        if (currentInput == "0" || currentInput.isEmpty()) {
            return
        }

        currentInput = if (currentInput.startsWith("-")) {
            currentInput.substring(1)
        } else {
            "-$currentInput"
        }
    }

    /**
     * Removes the last digit or decimal from the current input buffer.
     */
    fun backspace() {
        if (errorMessage != null || isResultDisplayed) {
            clear()
            return
        }

        if (currentInput.length > 1) {
            currentInput = currentInput.dropLast(1)
            if (currentInput == "-" || currentInput.isEmpty()) {
                currentInput = "0"
            }
        } else {
            currentInput = "0"
        }
    }

    /**
     * Sets the pending arithmetic operation (+, -, *, /).
     */
    fun setOperation(operation: Operation) {
        if (errorMessage != null) {
            clear()
            return
        }

        // If an operation is already pending and the user enters a second number
        // then taps another operator, compute the intermediate result first.
        if (activeOperation != null && !isResultDisplayed) {
            calculateResult(chainingOperation = true)
            if (errorMessage != null) return
        }

        val currentVal = parseNumber(currentInput)
        previousNumber = currentVal
        activeOperation = operation
        expressionText = "\${formatNumber(currentVal)} \${operation.symbol}"
        isResultDisplayed = true
    }

    /**
     * Evaluates the current expression and outputs the result.
     */
    fun calculateResult(chainingOperation: Boolean = false) {
        if (errorMessage != null) return

        val prev = previousNumber
        val op = activeOperation

        if (prev == null || op == null) {
            return
        }

        val currentVal = parseNumber(currentInput)

        // Safe division by zero handling
        if (op == Operation.DIVIDE && currentVal == 0.0) {
            errorMessage = "Cannot divide by zero"
            expressionText = "\${formatNumber(prev)} ÷ 0 ="
            currentInput = "Cannot divide by zero"
            previousNumber = null
            activeOperation = null
            isResultDisplayed = true
            return
        }

        val result = when (op) {
            Operation.ADD -> prev + currentVal
            Operation.SUBTRACT -> prev - currentVal
            Operation.MULTIPLY -> prev * currentVal
            Operation.DIVIDE -> prev / currentVal
        }

        if (!chainingOperation) {
            expressionText = "\${formatNumber(prev)} \${op.symbol} \${formatNumber(currentVal)} ="
            activeOperation = null
            previousNumber = null
        } else {
            previousNumber = result
        }

        currentInput = formatNumber(result)
        isResultDisplayed = true
    }

    /**
     * Resets all values to the default calculator state.
     */
    fun clear() {
        currentInput = "0"
        previousNumber = null
        activeOperation = null
        expressionText = ""
        isResultDisplayed = false
        errorMessage = null
    }

    /**
     * Safely parses the formatted string to a Double.
     */
    private fun parseNumber(value: String): Double {
        return try {
            value.replace(",", "").toDouble()
        } catch (e: NumberFormatException) {
            0.0
        }
    }

    /**
     * Formats numbers cleanly:
     * - Strips trailing .0 for whole integers (e.g., "8" instead of "8.0")
     * - Formats floating point results cleanly up to 10 decimal digits
     */
    fun formatNumber(number: Double): String {
        if (number.isInfinite() || number.isNaN()) {
            return "Error"
        }

        val safeNum = if (number == -0.0) 0.0 else number
        val symbols = DecimalFormatSymbols(Locale.US)

        return if (Math.abs(safeNum) >= 1e12 || (Math.abs(safeNum) > 0 && Math.abs(safeNum) < 1e-6)) {
            val scientificFormat = DecimalFormat("0.######E0", symbols)
            scientificFormat.format(safeNum)
        } else {
            val normalFormat = DecimalFormat("#,##0.##########", symbols)
            normalFormat.format(safeNum)
        }
    }
}`
  },
  {
    path: 'app/src/main/java/com/example/syntecxhubcalculator/MainActivity.kt',
    name: 'MainActivity.kt',
    category: 'kotlin',
    language: 'kotlin',
    description: 'Activity handling button click listeners, ViewBinding, and orientation state persistence.',
    content: `package com.example.syntecxhubcalculator

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import com.example.syntecxhubcalculator.databinding.ActivityMainBinding

/**
 * MainActivity
 *
 * Handles view binding, UI click events, and orientation lifecycle.
 * Delegates all calculation and validation logic to [Calculator].
 *
 * Part of SyntecxHub Android Development Internship - Project 1.
 */
class MainActivity : AppCompatActivity() {

    private lateinit var binding: ActivityMainBinding
    private val calculator = Calculator()

    companion object {
        private const val KEY_CURRENT_INPUT = "KEY_CURRENT_INPUT"
        private const val KEY_EXPRESSION_TEXT = "KEY_EXPRESSION_TEXT"
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        setupButtonClickListeners()
        updateDisplay()
    }

    /**
     * Attaches click listeners to all buttons.
     */
    private fun setupButtonClickListeners() {
        // Number buttons (0-9)
        val numberButtons = mapOf(
            binding.btn0 to "0",
            binding.btn1 to "1",
            binding.btn2 to "2",
            binding.btn3 to "3",
            binding.btn4 to "4",
            binding.btn5 to "5",
            binding.btn6 to "6",
            binding.btn7 to "7",
            binding.btn8 to "8",
            binding.btn9 to "9"
        )

        for ((button, digit) in numberButtons) {
            button.setOnClickListener {
                calculator.appendDigit(digit)
                updateDisplay()
            }
        }

        // Decimal point
        binding.btnDot.setOnClickListener {
            calculator.appendDecimal()
            updateDisplay()
        }

        // Operation buttons (+, -, ×, ÷)
        binding.btnAdd.setOnClickListener {
            calculator.setOperation(Calculator.Operation.ADD)
            updateDisplay()
        }

        binding.btnSubtract.setOnClickListener {
            calculator.setOperation(Calculator.Operation.SUBTRACT)
            updateDisplay()
        }

        binding.btnMultiply.setOnClickListener {
            calculator.setOperation(Calculator.Operation.MULTIPLY)
            updateDisplay()
        }

        binding.btnDivide.setOnClickListener {
            calculator.setOperation(Calculator.Operation.DIVIDE)
            updateDisplay()
        }

        // Action buttons
        binding.btnEquals.setOnClickListener {
            calculator.calculateResult()
            updateDisplay()
        }

        binding.btnClear.setOnClickListener {
            calculator.clear()
            updateDisplay()
        }

        binding.btnPlusMinus.setOnClickListener {
            calculator.toggleSign()
            updateDisplay()
        }

        binding.btnBackspace.setOnClickListener {
            calculator.backspace()
            updateDisplay()
        }
    }

    /**
     * Synchronizes UI TextViews with the calculator's current state.
     */
    private fun updateDisplay() {
        binding.tvExpression.text = calculator.expressionText
        binding.tvResult.text = calculator.currentInput
    }

    /**
     * Preserves state during device rotation between portrait and landscape.
     */
    override fun onSaveInstanceState(outState: Bundle) {
        super.onSaveInstanceState(outState)
        outState.putString(KEY_CURRENT_INPUT, calculator.currentInput)
        outState.putString(KEY_EXPRESSION_TEXT, calculator.expressionText)
    }

    override fun onRestoreInstanceState(savedInstanceState: Bundle) {
        super.onRestoreInstanceState(savedInstanceState)
        val savedInput = savedInstanceState.getString(KEY_CURRENT_INPUT)
        if (!savedInput.isNullOrEmpty() && savedInput != "0") {
            calculator.appendDigit(savedInput)
        }
        updateDisplay()
    }
}`
  },
  {
    path: 'app/src/main/res/layout/activity_main.xml',
    name: 'activity_main.xml (Portrait)',
    category: 'xml',
    language: 'xml',
    description: 'Portrait XML layout with top display area and standard 5x4 keypad grid.',
    content: `<?xml version="1.0" encoding="utf-8"?>
<!-- Portrait Layout for SyntecxHub Simple Calculator App -->
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:id="@+id/mainLayout"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical"
    android:background="@color/calculator_background"
    tools:context=".MainActivity">

    <!-- Top Display Area -->
    <LinearLayout
        android:id="@+id/displayContainer"
        android:layout_width="match_parent"
        android:layout_height="0dp"
        android:layout_weight="1.4"
        android:background="@color/display_background"
        android:orientation="vertical"
        android:gravity="bottom|end"
        android:paddingStart="24dp"
        android:paddingTop="16dp"
        android:paddingEnd="24dp"
        android:paddingBottom="20dp">

        <!-- Expression / Calculation History Line -->
        <TextView
            android:id="@+id/tvExpression"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:gravity="end"
            android:ellipsize="start"
            android:maxLines="1"
            android:textColor="@color/display_text_secondary"
            android:textSize="20sp"
            tools:text="125 + 35" />

        <!-- Current Input / Final Result Line -->
        <TextView
            android:id="@+id/tvResult"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:layout_marginTop="8dp"
            android:gravity="end"
            android:ellipsize="start"
            android:maxLines="1"
            android:text="@string/default_display_value"
            android:textColor="@color/display_text_primary"
            android:textSize="48sp"
            android:textStyle="bold"
            tools:text="160" />

    </LinearLayout>

    <!-- Subtle divider line between display and keypad -->
    <View
        android:layout_width="match_parent"
        android:layout_height="1dp"
        android:background="@color/display_divider" />

    <!-- Calculator Keypad (5 Rows x 4 Columns) -->
    <LinearLayout
        android:id="@+id/keypadContainer"
        android:layout_width="match_parent"
        android:layout_height="0dp"
        android:layout_weight="3.6"
        android:orientation="vertical"
        android:padding="8dp">

        <!-- Row 1: Clear, Plus/Minus, Backspace, Divide -->
        <LinearLayout
            android:layout_width="match_parent"
            android:layout_height="0dp"
            android:layout_weight="1"
            android:orientation="horizontal">

            <com.google.android.material.button.MaterialButton
                android:id="@+id/btnClear"
                style="@style/Widget.Calculator.Button.Action"
                android:text="@string/btn_clear"
                android:textColor="@color/btn_clear_text" />

            <com.google.android.material.button.MaterialButton
                android:id="@+id/btnPlusMinus"
                style="@style/Widget.Calculator.Button.Action"
                android:text="@string/btn_plus_minus" />

            <com.google.android.material.button.MaterialButton
                android:id="@+id/btnBackspace"
                style="@style/Widget.Calculator.Button.Action"
                android:text="@string/btn_backspace" />

            <com.google.android.material.button.MaterialButton
                android:id="@+id/btnDivide"
                style="@style/Widget.Calculator.Button.Operator"
                android:text="@string/btn_divide" />
        </LinearLayout>

        <!-- Row 2: 7, 8, 9, Multiply -->
        <LinearLayout
            android:layout_width="match_parent"
            android:layout_height="0dp"
            android:layout_weight="1"
            android:orientation="horizontal">

            <com.google.android.material.button.MaterialButton
                android:id="@+id/btn7"
                style="@style/Widget.Calculator.Button.Number"
                android:text="@string/digit_7" />

            <com.google.android.material.button.MaterialButton
                android:id="@+id/btn8"
                style="@style/Widget.Calculator.Button.Number"
                android:text="@string/digit_8" />

            <com.google.android.material.button.MaterialButton
                android:id="@+id/btn9"
                style="@style/Widget.Calculator.Button.Number"
                android:text="@string/digit_9" />

            <com.google.android.material.button.MaterialButton
                android:id="@+id/btnMultiply"
                style="@style/Widget.Calculator.Button.Operator"
                android:text="@string/btn_multiply" />
        </LinearLayout>

        <!-- Row 3: 4, 5, 6, Subtract -->
        <LinearLayout
            android:layout_width="match_parent"
            android:layout_height="0dp"
            android:layout_weight="1"
            android:orientation="horizontal">

            <com.google.android.material.button.MaterialButton
                android:id="@+id/btn4"
                style="@style/Widget.Calculator.Button.Number"
                android:text="@string/digit_4" />

            <com.google.android.material.button.MaterialButton
                android:id="@+id/btn5"
                style="@style/Widget.Calculator.Button.Number"
                android:text="@string/digit_5" />

            <com.google.android.material.button.MaterialButton
                android:id="@+id/btn6"
                style="@style/Widget.Calculator.Button.Number"
                android:text="@string/digit_6" />

            <com.google.android.material.button.MaterialButton
                android:id="@+id/btnSubtract"
                style="@style/Widget.Calculator.Button.Operator"
                android:text="@string/btn_subtract" />
        </LinearLayout>

        <!-- Row 4: 1, 2, 3, Add -->
        <LinearLayout
            android:layout_width="match_parent"
            android:layout_height="0dp"
            android:layout_weight="1"
            android:orientation="horizontal">

            <com.google.android.material.button.MaterialButton
                android:id="@+id/btn1"
                style="@style/Widget.Calculator.Button.Number"
                android:text="@string/digit_1" />

            <com.google.android.material.button.MaterialButton
                android:id="@+id/btn2"
                style="@style/Widget.Calculator.Button.Number"
                android:text="@string/digit_2" />

            <com.google.android.material.button.MaterialButton
                android:id="@+id/btn3"
                style="@style/Widget.Calculator.Button.Number"
                android:text="@string/digit_3" />

            <com.google.android.material.button.MaterialButton
                android:id="@+id/btnAdd"
                style="@style/Widget.Calculator.Button.Operator"
                android:text="@string/btn_add" />
        </LinearLayout>

        <!-- Row 5: 0, Dot, Equals -->
        <LinearLayout
            android:layout_width="match_parent"
            android:layout_height="0dp"
            android:layout_weight="1"
            android:orientation="horizontal">

            <com.google.android.material.button.MaterialButton
                android:id="@+id/btn0"
                style="@style/Widget.Calculator.Button.Number"
                android:layout_weight="2"
                android:text="@string/digit_0" />

            <com.google.android.material.button.MaterialButton
                android:id="@+id/btnDot"
                style="@style/Widget.Calculator.Button.Number"
                android:text="@string/btn_dot" />

            <com.google.android.material.button.MaterialButton
                android:id="@+id/btnEquals"
                style="@style/Widget.Calculator.Button.Equals"
                android:text="@string/btn_equals" />
        </LinearLayout>

    </LinearLayout>

</LinearLayout>`
  },
  {
    path: 'app/src/main/res/layout-land/activity_main.xml',
    name: 'activity_main.xml (Landscape)',
    category: 'xml',
    language: 'xml',
    description: 'Landscape XML layout with ergonomic side-by-side display and keypad partition.',
    content: `<?xml version="1.0" encoding="utf-8"?>
<!-- Landscape Layout for SyntecxHub Simple Calculator App (res/layout-land/activity_main.xml) -->
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:id="@+id/mainLayoutLand"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="horizontal"
    android:background="@color/calculator_background"
    tools:context=".MainActivity">

    <!-- Left Side: Dedicated Spacious Display Area -->
    <LinearLayout
        android:id="@+id/displayContainerLand"
        android:layout_width="0dp"
        android:layout_height="match_parent"
        android:layout_weight="1.1"
        android:background="@color/display_background"
        android:orientation="vertical"
        android:gravity="bottom|end"
        android:paddingStart="24dp"
        android:paddingTop="20dp"
        android:paddingEnd="24dp"
        android:paddingBottom="24dp">

        <TextView
            android:id="@+id/tvExpression"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:gravity="end"
            android:ellipsize="start"
            android:maxLines="2"
            android:textColor="@color/display_text_secondary"
            android:textSize="18sp"
            tools:text="1,250 × 8" />

        <TextView
            android:id="@+id/tvResult"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:layout_marginTop="12dp"
            android:gravity="end"
            android:ellipsize="start"
            android:maxLines="1"
            android:text="@string/default_display_value"
            android:textColor="@color/display_text_primary"
            android:textSize="40sp"
            android:textStyle="bold"
            tools:text="10,000" />

    </LinearLayout>

    <!-- Vertical separator line between display and keypad -->
    <View
        android:layout_width="1dp"
        android:layout_height="match_parent"
        android:background="@color/display_divider" />

    <!-- Right Side: Keypad Grid rearranged for Landscape -->
    <LinearLayout
        android:id="@+id/keypadContainerLand"
        android:layout_width="0dp"
        android:layout_height="match_parent"
        android:layout_weight="1.9"
        android:orientation="vertical"
        android:padding="6dp">

        <!-- Row 1: Clear, Plus/Minus, Backspace, Divide -->
        <LinearLayout
            android:layout_width="match_parent"
            android:layout_height="0dp"
            android:layout_weight="1"
            android:orientation="horizontal">

            <com.google.android.material.button.MaterialButton
                android:id="@+id/btnClear"
                style="@style/Widget.Calculator.Button.Action"
                android:text="@string/btn_clear"
                android:textColor="@color/btn_clear_text" />

            <com.google.android.material.button.MaterialButton
                android:id="@+id/btnPlusMinus"
                style="@style/Widget.Calculator.Button.Action"
                android:text="@string/btn_plus_minus" />

            <com.google.android.material.button.MaterialButton
                android:id="@+id/btnBackspace"
                style="@style/Widget.Calculator.Button.Action"
                android:text="@string/btn_backspace" />

            <com.google.android.material.button.MaterialButton
                android:id="@+id/btnDivide"
                style="@style/Widget.Calculator.Button.Operator"
                android:text="@string/btn_divide" />
        </LinearLayout>

        <!-- Row 2: 7, 8, 9, Multiply -->
        <LinearLayout
            android:layout_width="match_parent"
            android:layout_height="0dp"
            android:layout_weight="1"
            android:orientation="horizontal">

            <com.google.android.material.button.MaterialButton
                android:id="@+id/btn7"
                style="@style/Widget.Calculator.Button.Number"
                android:text="@string/digit_7" />

            <com.google.android.material.button.MaterialButton
                android:id="@+id/btn8"
                style="@style/Widget.Calculator.Button.Number"
                android:text="@string/digit_8" />

            <com.google.android.material.button.MaterialButton
                android:id="@+id/btn9"
                style="@style/Widget.Calculator.Button.Number"
                android:text="@string/digit_9" />

            <com.google.android.material.button.MaterialButton
                android:id="@+id/btnMultiply"
                style="@style/Widget.Calculator.Button.Operator"
                android:text="@string/btn_multiply" />
        </LinearLayout>

        <!-- Row 3: 4, 5, 6, Subtract -->
        <LinearLayout
            android:layout_width="match_parent"
            android:layout_height="0dp"
            android:layout_weight="1"
            android:orientation="horizontal">

            <com.google.android.material.button.MaterialButton
                android:id="@+id/btn4"
                style="@style/Widget.Calculator.Button.Number"
                android:text="@string/digit_4" />

            <com.google.android.material.button.MaterialButton
                android:id="@+id/btn5"
                style="@style/Widget.Calculator.Button.Number"
                android:text="@string/digit_5" />

            <com.google.android.material.button.MaterialButton
                android:id="@+id/btn6"
                style="@style/Widget.Calculator.Button.Number"
                android:text="@string/digit_6" />

            <com.google.android.material.button.MaterialButton
                android:id="@+id/btnSubtract"
                style="@style/Widget.Calculator.Button.Operator"
                android:text="@string/btn_subtract" />
        </LinearLayout>

        <!-- Row 4: 1, 2, 3, Add -->
        <LinearLayout
            android:layout_width="match_parent"
            android:layout_height="0dp"
            android:layout_weight="1"
            android:orientation="horizontal">

            <com.google.android.material.button.MaterialButton
                android:id="@+id/btn1"
                style="@style/Widget.Calculator.Button.Number"
                android:text="@string/digit_1" />

            <com.google.android.material.button.MaterialButton
                android:id="@+id/btn2"
                style="@style/Widget.Calculator.Button.Number"
                android:text="@string/digit_2" />

            <com.google.android.material.button.MaterialButton
                android:id="@+id/btn3"
                style="@style/Widget.Calculator.Button.Number"
                android:text="@string/digit_3" />

            <com.google.android.material.button.MaterialButton
                android:id="@+id/btnAdd"
                style="@style/Widget.Calculator.Button.Operator"
                android:text="@string/btn_add" />
        </LinearLayout>

        <!-- Row 5: 0, Dot, Equals -->
        <LinearLayout
            android:layout_width="match_parent"
            android:layout_height="0dp"
            android:layout_weight="1"
            android:orientation="horizontal">

            <com.google.android.material.button.MaterialButton
                android:id="@+id/btn0"
                style="@style/Widget.Calculator.Button.Number"
                android:layout_weight="2"
                android:text="@string/digit_0" />

            <com.google.android.material.button.MaterialButton
                android:id="@+id/btnDot"
                style="@style/Widget.Calculator.Button.Number"
                android:text="@string/btn_dot" />

            <com.google.android.material.button.MaterialButton
                android:id="@+id/btnEquals"
                style="@style/Widget.Calculator.Button.Equals"
                android:text="@string/btn_equals" />
        </LinearLayout>

    </LinearLayout>

</LinearLayout>`
  },
  {
    path: 'app/src/main/res/values/colors.xml',
    name: 'colors.xml',
    category: 'xml',
    language: 'xml',
    description: 'Clean, restrained solid color definitions adhering to Material Design without AI slop.',
    content: `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <!-- Brand / Primary Colors -->
    <color name="primary">#92400E</color>
    <color name="primary_dark">#78350F</color>
    <color name="accent">#B45309</color>

    <!-- Display Area -->
    <color name="display_background">#F7F3EC</color>
    <color name="display_text_primary">#292524</color>
    <color name="display_text_secondary">#78716C</color>
    <color name="display_divider">#E8E0D4</color>

    <!-- Keypad Background -->
    <color name="calculator_background">#FCFAF7</color>

    <!-- Button Backgrounds -->
    <color name="btn_number_bg">#FAF7F2</color>
    <color name="btn_number_text">#292524</color>

    <color name="btn_action_bg">#EFE8DC</color>
    <color name="btn_action_text">#44403C</color>

    <color name="btn_operator_bg">#FEF3C7</color>
    <color name="btn_operator_text">#92400E</color>

    <color name="btn_clear_text">#C2410C</color>

    <color name="btn_equals_bg">#B45309</color>
    <color name="btn_equals_text">#FFFDF8</color>
</resources>`
  },
  {
    path: 'app/src/main/res/values/strings.xml',
    name: 'strings.xml',
    category: 'xml',
    language: 'xml',
    description: 'Standardized string resources for button texts and localized system error messages.',
    content: `<resources>
    <string name="app_name">Calculator</string>

    <!-- Operation buttons -->
    <string name="btn_clear">C</string>
    <string name="btn_plus_minus">±</string>
    <string name="btn_backspace">⌫</string>
    <string name="btn_divide">÷</string>
    <string name="btn_multiply">×</string>
    <string name="btn_subtract">−</string>
    <string name="btn_add">+</string>
    <string name="btn_equals">=</string>
    <string name="btn_dot">.</string>

    <!-- Digits -->
    <string name="digit_0">0</string>
    <string name="digit_1">1</string>
    <string name="digit_2">2</string>
    <string name="digit_3">3</string>
    <string name="digit_4">4</string>
    <string name="digit_5">5</string>
    <string name="digit_6">6</string>
    <string name="digit_7">7</string>
    <string name="digit_8">8</string>
    <string name="digit_9">9</string>

    <!-- Default Display & Error Messages -->
    <string name="default_display_value">0</string>
    <string name="error_divide_by_zero">Cannot divide by zero</string>
    <string name="error_invalid_input">Invalid format</string>
</resources>`
  },
  {
    path: 'app/src/main/res/values/themes.xml',
    name: 'themes.xml',
    category: 'xml',
    language: 'xml',
    description: 'Material theme styles for number, action, operator, and equals buttons.',
    content: `<resources xmlns:tools="http://schemas.android.com/tools">
    <!-- Base application theme. -->
    <style name="Theme.SyntecxHubCalculator" parent="Theme.MaterialComponents.DayNight.NoActionBar">
        <!-- Primary brand color. -->
        <item name="colorPrimary">@color/primary</item>
        <item name="colorPrimaryVariant">@color/primary_dark</item>
        <item name="colorOnPrimary">@color/btn_equals_text</item>
        <!-- Status bar color. -->
        <item name="android:statusBarColor">@color/display_background</item>
        <item name="android:windowLightStatusBar" tools:targetApi="m">true</item>
    </style>

    <!-- Standard Calculator Button Style -->
    <style name="Widget.Calculator.Button" parent="Widget.MaterialComponents.Button">
        <item name="android:layout_width">0dp</item>
        <item name="android:layout_height">0dp</item>
        <item name="android:layout_margin">4dp</item>
        <item name="android:textSize">22sp</item>
        <item name="android:textStyle">bold</item>
        <item name="android:insetTop">0dp</item>
        <item name="android:insetBottom">0dp</item>
        <item name="android:insetLeft">0dp</item>
        <item name="android:insetRight">0dp</item>
        <item name="cornerRadius">8dp</item>
        <item name="elevation">0dp</item>
    </style>

    <!-- Number Button Style -->
    <style name="Widget.Calculator.Button.Number">
        <item name="backgroundTint">@color/btn_number_bg</item>
        <item name="android:textColor">@color/btn_number_text</item>
        <item name="rippleColor">#33000000</item>
    </style>

    <!-- Action / Utility Button Style (Clear, Sign, Backspace) -->
    <style name="Widget.Calculator.Button.Action">
        <item name="backgroundTint">@color/btn_action_bg</item>
        <item name="android:textColor">@color/btn_action_text</item>
        <item name="rippleColor">#33000000</item>
    </style>

    <!-- Operator Button Style (+, -, *, /) -->
    <style name="Widget.Calculator.Button.Operator">
        <item name="backgroundTint">@color/btn_operator_bg</item>
        <item name="android:textColor">@color/btn_operator_text</item>
        <item name="rippleColor">#331976D2</item>
    </style>

    <!-- Equals Button Style (=) -->
    <style name="Widget.Calculator.Button.Equals">
        <item name="backgroundTint">@color/btn_equals_bg</item>
        <item name="android:textColor">@color/btn_equals_text</item>
        <item name="rippleColor">#44FFFFFF</item>
    </style>
</resources>`
  },
  {
    path: 'app/src/main/AndroidManifest.xml',
    name: 'AndroidManifest.xml',
    category: 'manifest',
    language: 'xml',
    description: 'Application manifest registering MainActivity with orientation handling.',
    content: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools">

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.SyntecxHubCalculator"
        tools:targetApi="31">
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:configChanges="orientation|screenSize|screenLayout|smallestScreenSize">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>

</manifest>`
  },
  {
    path: 'app/src/test/java/com/example/syntecxhubcalculator/CalculatorTest.kt',
    name: 'CalculatorTest.kt',
    category: 'kotlin',
    language: 'kotlin',
    description: 'Unit tests verifying 5+3=8, 10-4=6, 6x7=42, 20/5=4, 10/0 zero-division handling, and decimals.',
    content: `package com.example.syntecxhubcalculator

import org.junit.Assert.assertEquals
import org.junit.Assert.assertNull
import org.junit.Before
import org.junit.Test

/**
 * Unit tests verifying the calculations specified in SyntecxHub Internship Project 1:
 * - 5 + 3 = 8
 * - 10 − 4 = 6
 * - 6 × 7 = 42
 * - 20 ÷ 5 = 4
 * - 10 ÷ 0 is handled safely ("Cannot divide by zero")
 * - Decimal numbers
 * - Positive and negative numbers
 * - Clear resets state
 */
class CalculatorTest {

    private lateinit var calculator: Calculator

    @Before
    fun setUp() {
        calculator = Calculator()
    }

    @Test
    fun testAddition() {
        calculator.appendDigit("5")
        calculator.setOperation(Calculator.Operation.ADD)
        calculator.appendDigit("3")
        calculator.calculateResult()

        assertEquals("8", calculator.currentInput)
        assertEquals("5 + 3 =", calculator.expressionText)
    }

    @Test
    fun testSubtraction() {
        calculator.appendDigit("1")
        calculator.appendDigit("0")
        calculator.setOperation(Calculator.Operation.SUBTRACT)
        calculator.appendDigit("4")
        calculator.calculateResult()

        assertEquals("6", calculator.currentInput)
    }

    @Test
    fun testMultiplication() {
        calculator.appendDigit("6")
        calculator.setOperation(Calculator.Operation.MULTIPLY)
        calculator.appendDigit("7")
        calculator.calculateResult()

        assertEquals("42", calculator.currentInput)
    }

    @Test
    fun testDivision() {
        calculator.appendDigit("2")
        calculator.appendDigit("0")
        calculator.setOperation(Calculator.Operation.DIVIDE)
        calculator.appendDigit("5")
        calculator.calculateResult()

        assertEquals("4", calculator.currentInput)
    }

    @Test
    fun testDivisionByZeroHandledSafely() {
        calculator.appendDigit("1")
        calculator.appendDigit("0")
        calculator.setOperation(Calculator.Operation.DIVIDE)
        calculator.appendDigit("0")
        calculator.calculateResult()

        assertEquals("Cannot divide by zero", calculator.currentInput)
        assertEquals("Cannot divide by zero", calculator.errorMessage)
    }

    @Test
    fun testDecimalCalculations() {
        calculator.appendDigit("2")
        calculator.appendDecimal()
        calculator.appendDigit("5")
        calculator.setOperation(Calculator.Operation.ADD)
        calculator.appendDigit("1")
        calculator.appendDecimal()
        calculator.appendDigit("7")
        calculator.appendDigit("5")
        calculator.calculateResult()

        assertEquals("4.25", calculator.currentInput)
    }

    @Test
    fun testTogglePositiveNegative() {
        calculator.appendDigit("9")
        calculator.toggleSign()
        assertEquals("-9", calculator.currentInput)

        calculator.toggleSign()
        assertEquals("9", calculator.currentInput)
    }

    @Test
    fun testClearResetsCalculator() {
        calculator.appendDigit("4")
        calculator.appendDigit("2")
        calculator.setOperation(Calculator.Operation.ADD)
        calculator.appendDigit("8")
        calculator.clear()

        assertEquals("0", calculator.currentInput)
        assertEquals("", calculator.expressionText)
        assertNull(calculator.activeOperation)
        assertNull(calculator.previousNumber)
    }

    @Test
    fun testBackspace() {
        calculator.appendDigit("1")
        calculator.appendDigit("2")
        calculator.appendDigit("3")
        calculator.backspace()
        assertEquals("12", calculator.currentInput)

        calculator.backspace()
        assertEquals("1", calculator.currentInput)

        calculator.backspace()
        assertEquals("0", calculator.currentInput)
    }
}`
  },
  {
    path: 'app/build.gradle.kts',
    name: 'app/build.gradle.kts',
    category: 'gradle',
    language: 'gradle',
    description: 'App module build script enabling ViewBinding and Material Components.',
    content: `plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
}

android {
    namespace = "com.example.syntecxhubcalculator"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.example.syntecxhubcalculator"
        minSdk = 24
        targetSdk = 34
        versionCode = 1
        versionName = "1.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_1_8
        targetCompatibility = JavaVersion.VERSION_1_8
    }
    kotlinOptions {
        jvmTarget = "1.8"
    }
    buildFeatures {
        viewBinding = true
    }
}

dependencies {
    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.appcompat)
    implementation(libs.material)
    implementation(libs.androidx.activity)
    implementation(libs.androidx.constraintlayout)
    testImplementation(libs.junit)
    androidTestImplementation(libs.androidx.junit)
    androidTestImplementation(libs.androidx.espresso.core)
}`
  },
  {
    path: 'settings.gradle.kts',
    name: 'settings.gradle.kts',
    category: 'gradle',
    language: 'gradle',
    description: 'Project settings and module includes.',
    content: `rootProject.name = "SyntecxHubCalculator"
include(":app")`
  },
  {
    path: 'build.gradle.kts',
    name: 'build.gradle.kts',
    category: 'gradle',
    language: 'gradle',
    description: 'Top-level root build configuration.',
    content: `plugins {
    alias(libs.plugins.android.application) apply false
    alias(libs.plugins.kotlin.android) apply false
}`
  },
  {
    path: 'README.md',
    name: 'README.md',
    category: 'docs',
    language: 'markdown',
    description: 'Internship submission guide and Android Studio running instructions.',
    content: `# SyntecxHub Android Development Internship — Week 1
## Project 1: Simple Calculator App

A clean, responsive, hand-crafted Android calculator application developed in **Kotlin** and **XML layouts** following standard Android architecture principles.

### Features & Capabilities
- **Arithmetic Operations:** Addition (+), Subtraction (−), Multiplication (×), Division (÷).
- **Data Types:** Full support for integer and floating-point decimal numbers (.).
- **Sign Inversion:** Positive and negative number toggle (±).
- **Editing Tools:** Clear (C) to reset state and Backspace (⌫) to correct single digits.
- **Input Validation & Safety:**
  - Gracefully catches division by zero with "Cannot divide by zero" without crashing.
  - Prevents multiple consecutive decimal points.
  - Formats results cleanly, stripping unnecessary trailing zeros (e.g., 8 instead of 8.0).
- **Responsive Layouts:**
  - **Portrait (res/layout/activity_main.xml):** Traditional 5-row keypad with top calculation display.
  - **Landscape (res/layout-land/activity_main.xml):** Split horizontal view with left-hand display and right-hand keypad to prevent screen squishing and maintain ergonomic button sizes.
- **Architecture:** Separated calculation engine (Calculator.kt) from Activity UI logic (MainActivity.kt).`
  }
];
