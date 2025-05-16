const terminal = document.getElementById("terminal");
const lines = [
    "Connecting MyPage",
    "Loading[■■■■■■■■■■]100%",
    "Complate Connect",
    "Enter your order"
];

let lineIndex = 0;
let charIndex = 0;
let currentLineText = "";
let currentDir = "C:\\Users\\Guest>";

function typeLine() {
    if (lineIndex >= lines.length) {
        inputPrompt();
        return;
    }

    const fullLine = lines[lineIndex];
    if (charIndex === 0) {
        const newLine = document.createElement("div");
        newLine.className = "line";
        terminal.appendChild(newLine);
    }

    const lineElement = terminal.lastChild;
    currentLineText += fullLine[charIndex];
    lineElement.textContent = currentLineText;

    charIndex++;

    if (charIndex < fullLine.length) {
        setTimeout(typeLine, 30);
    }else{
        charIndex = 0;
        currentLineText = "";
        lineIndex++;
        setTimeout(typeLine, 300);
    }
    
}

function inputPrompt() {
    const inputLine = document.createElement("div");
    inputLine.className = "input-line";

    const prompt = document.createElement("span");
    prompt.textContent = currentDir;
    inputLine.appendChild(prompt);

    const input = document.createElement("input");
    input.type = "text";
    input.className = "input";
    inputLine.appendChild(input);

    terminal.appendChild(inputLine);
    input.focus();

}

typeLine();