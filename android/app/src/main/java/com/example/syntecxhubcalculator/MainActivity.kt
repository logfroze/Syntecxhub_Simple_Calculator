package com.example.syntecxhubcalculator

import android.os.Bundle
import android.widget.TextView
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
}
