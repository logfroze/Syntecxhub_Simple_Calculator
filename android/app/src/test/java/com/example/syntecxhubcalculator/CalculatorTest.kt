package com.example.syntecxhubcalculator

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
}
