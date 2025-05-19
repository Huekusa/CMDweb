const terminal = document.getElementById('terminal');
const defaultLines = [
    'Connecting MyPage',
    'Loading[■■■■■■■■■■]100%',
    'Complete Connect',
    'Enter your order'
];

let currentDir = 'C:\\Users\\Guest>';
const users = {};

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function typeLine(texts, textsIndex = 0) {
    if (Array.isArray(texts)) {
        if(textsIndex >= texts.length) return;

        const text = texts[textsIndex]
        const textElement = document.createElement('div');
        textElement.className = 'line';
        terminal.appendChild(textElement);

        for (let i = 0; i < text.length; i++) {
            textElement.textContent += text[i];
            await delay(30);
        }

        await delay(250);
        await typeLine(texts, textsIndex + 1);
    }else if (typeof texts === 'string') {
        const textElement = document.createElement('div');
        textElement.className = 'line';
        terminal.appendChild(textElement);

        for (let i = 0; i < texts.length; i++) {
            textElement.textContent += texts[i];
            await delay(30);
        }
    }
}

function inputPrompt() {
    const inputLine = document.createElement('div');
    inputLine.className = 'input-line';

    const prompt = document.createElement('span');
    prompt.textContent = currentDir;
    inputLine.appendChild(prompt);

    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'input';
    inputLine.appendChild(input);

    terminal.appendChild(inputLine);
    input.focus();

    input.addEventListener('keydown', async function(e) {
        if(e.key === 'Enter') {
            const userInput = input.value;
            inputLine.remove();
    
            const executedLine = document.createElement('div');
            executedLine.className = 'line';
            executedLine.textContent = currentDir + ' ' + userInput;
            terminal.appendChild(executedLine);

            await cheakInputLine(userInput);

        }
    });

}

async function cheakInputLine(userInput) {
    const [base, ...args] = userInput.split(' ');

    switch (base.toLowerCase()) {
        case 'now':
            const now = new Date();
            now.setTime(now.getTime() - now.getTimezoneOffset() * 60 * 1000);
            const formattedNow = now.toISOString().replace('T', ' ').substring(0,19);
            await typeLine(formattedNow);
        break;
            
        case 'help':
            const helpText = [
                'help           使用できるコマンドを表示します',
                'login [user]   userでログインします',
                'echo [TEXT]    TEXTを表示します',
                'now            今日の日時を表示します'
            ];
            await typeLine(helpText);
        break;

        case 'echo':
            await typeLine(args.join(' '));
        break;

        case 'register':
            if (argsTrimed.length !== 2) {
                break;
            }
            const [username, password] = argsTrimed;

            if (!users[username]) {
                await typeLine("error");
            }else {
                users[username] = password;
            }
        break;

        case 'login':
            const argsTrimed = args.map(arg => arg.trim()).filter(arg => arg.length > 0);
            if (argsTrimed.length === 0) {
                await typeLine("error");
            }else if (argsTrimed.length > 1) {
                await typeLine("error2");
            }else {
                const username = argsTrimed[0];
                currentDir = 'C:\\Users\\'+ username +'>';
            }
        break;

        default:
            await typeLine([
                '存在しないコマンドです',
                '使用できるコマンドはhelpで確認できます'
            ]);
        break;
    }
    inputPrompt();
}

(async function startTerminal() {
    await typeLine(defaultLines);
    inputPrompt();
})();