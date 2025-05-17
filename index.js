const terminal = document.getElementById("terminal");
const defaultLines = [
    "Connecting MyPage",
    "Loading[■■■■■■■■■■]100%",
    "Complete Connect",
    "Enter your order"
];

let lineIndex = 0;
let currentDir = "C:\\Users\\Guest>";

function typeLine(lines) {
    if (lineIndex >= lines.length) {
        inputPrompt();
        return;
    }

    const fullLine = lines[lineIndex];
    const lineElement = document.createElement("div");
    lineElement.className = "line";
    terminal.appendChild(lineElement);

    let i = 0;
    function typeChar() {
        lineElement.textContent += fullLine[i++];
        
        if (i < fullLine.length) {
            setTimeout(typeChar, 30);
        }else{
            lineIndex++;
            setTimeout(typeLine(lines), 300);
        }
    }
    typeChar();
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

    input.addEventListener("keydown", function(e) {
        if(e.key === "Enter") {
            const userInput = input.value;
            inputLine.remove();
    
            const executedLine = document.createElement("div");
            executedLine.className = "line";
            executedLine.textContent = currentDir + " " + userInput;
            terminal.appendChild(executedLine);

            cheakInputLine(userInput);

            inputPrompt();
        }
    });

}
function cheakInputLine(userInput) {
    const returnLine = document.createElement("div");
    returnLine.className = "line";
    const [base, ...args] = userInput.split(" ");

    switch (base.toLowerCase()) {
        case "now":
            const now = new Date();
            now.setTime(now.getTime() - now.getTimezoneOffset() * 60 * 1000);
            const formattedNow = now.toISOString().replace("T", " ").substring(0,19);
            returnLine.textContent = formattedNow;
        break;
            
        case "help":
            const helpText = [
                "now 今日の日時を表示します",
                "echo [TEXT] TEXTを表示します"
            ];
            // helpText.forEach(line => )
            // returnLine.textContent = helpText;
        break;

        case "echo":
            returnLine.textContent = args.join(" ");
        break;
        default:break;
    }
    terminal.appendChild(returnLine);
}

typeLine(defaultLines);