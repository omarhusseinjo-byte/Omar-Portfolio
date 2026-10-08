let currentNumber = "";
let previousNumber = "";
let operator = "";

const expression = document.getElementById("expression");
const result = document.getElementById("result");
const history = document.getElementById("history");


// Update the display
function updateDisplay() {
    result.textContent = currentNumber || "0";

    if (previousNumber && operator) {
        expression.textContent =
            previousNumber + " " + getOperatorSymbol(operator);
    } else {
        expression.textContent = "";
    }
}


// Add numbers
function addValue(value) {

    // Decimal
    if (value === ".") {

        if (currentNumber.includes(".")) {
            return;
        }

        if (currentNumber === "") {
            currentNumber = "0";
        }
    }

    // Numbers
    if (!"+-*/%()".includes(value)) {
        currentNumber += value;
        updateDisplay();
        return;
    }

    // Parentheses are not needed for this calculator style
    if (value === "(" || value === ")") {
        return;
    }

    // Operator
    chooseOperator(value);
}


// Choose an operator
function chooseOperator(newOperator) {

    // If there is no current number, don't do anything
    if (currentNumber === "" && previousNumber === "") {
        return;
    }

    // If there is already an operation,
    // calculate it first
    if (previousNumber !== "" && currentNumber !== "") {

        calculate(false);
    }

    // Save current number
    if (currentNumber !== "") {
        previousNumber = currentNumber;
        currentNumber = "";
    }

    operator = newOperator;

    updateDisplay();
}


// Calculate
function calculate(showHistory = true) {

    if (
        previousNumber === "" ||
        currentNumber === "" ||
        operator === ""
    ) {
        return;
    }

    let first = parseFloat(previousNumber);
    let second = parseFloat(currentNumber);

    let answer;

    switch (operator) {

        case "+":
            answer = first + second;
            break;

        case "-":
            answer = first - second;
            break;

        case "*":
            answer = first * second;
            break;

        case "/":

            if (second === 0) {
                result.textContent = "Error";
                return;
            }

            answer = first / second;
            break;

        case "%":
            answer = first % second;
            break;
    }

    answer = formatNumber(answer);

    if (showHistory) {

        addHistory(
            previousNumber +
            " " +
            getOperatorSymbol(operator) +
            " " +
            currentNumber +
            " = " +
            answer
        );
    }

    previousNumber = "";
    currentNumber = answer;
    operator = "";

    expression.textContent = "";
    result.textContent = answer;
}


// Clear calculator
function clearCalculator() {

    currentNumber = "";
    previousNumber = "";
    operator = "";

    expression.textContent = "";
    result.textContent = "0";
}


// Delete last number
function deleteLast() {

    currentNumber =
        currentNumber.slice(0, -1);

    updateDisplay();
}


// Format numbers
function formatNumber(number) {

    if (Number.isInteger(number)) {
        return number.toString();
    }

    return Number(
        number.toFixed(10)
    ).toString();
}


// Convert symbols for display
function getOperatorSymbol(operator) {

    switch (operator) {

        case "*":
            return "×";

        case "/":
            return "÷";

        case "-":
            return "−";

        case "+":
            return "+";

        case "%":
            return "%";

        default:
            return operator;
    }
}


// History
function addHistory(text) {

    if (
        history.textContent ===
        "No calculations yet."
    ) {
        history.textContent = "";
    }

    const item =
        document.createElement("div");

    item.className =
        "history-item";

    item.textContent = text;

    history.prepend(item);
}


// Square root
function squareRoot() {

    let number;

    if (currentNumber !== "") {
        number = parseFloat(currentNumber);
    } else {
        return;
    }

    if (number < 0) {
        result.textContent = "Error";
        return;
    }

    let answer =
        Math.sqrt(number);

    currentNumber =
        formatNumber(answer);

    updateDisplay();
}


// Square
function squareNumber() {

    if (currentNumber === "") {
        return;
    }

    let number =
        parseFloat(currentNumber);

    let answer =
        number * number;

    currentNumber =
        formatNumber(answer);

    updateDisplay();
}


// Keyboard support
document.addEventListener(
    "keydown",
    function(event) {

        let key = event.key;

        // Number
        if (
            key >= "0" &&
            key <= "9"
        ) {

            addValue(key);

            event.preventDefault();
        }

        // Decimal
        else if (key === ".") {

            addValue(".");

            event.preventDefault();
        }

        // Operators
        else if (
            key === "+" ||
            key === "-" ||
            key === "*" ||
            key === "/"
        ) {

            addValue(key);

            event.preventDefault();
        }

        // Equal
        else if (
            key === "Enter" ||
            key === "="
        ) {

            calculate();

            event.preventDefault();
        }

        // Delete
        else if (
            key === "Backspace"
        ) {

            deleteLast();

            event.preventDefault();
        }

        // Clear
        else if (
            key === "Escape"
        ) {

            clearCalculator();

            event.preventDefault();
        }
    }
);