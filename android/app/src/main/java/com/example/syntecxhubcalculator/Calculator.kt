package com.example.syntecxhubcalculator

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
        expressionText = "${formatNumber(currentVal)} ${operation.symbol}"
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
            expressionText = "${formatNumber(prev)} ÷ 0 ="
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
            expressionText = "${formatNumber(prev)} ${op.symbol} ${formatNumber(currentVal)} ="
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
}
