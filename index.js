const terminal = document.getElementById('terminal');
const defaultLines = [
	'Connecting MyPage',
	'Loading[■■■■■■■■■■]100%',
	'Complete Connect',
	'Enter your order'
];

let currentUser = 'guest';
const users = {
	guest: 'pass',
	root: 'rootpass'
};

/**
 * 指定した時間（ミリ秒）だけ待機する
 * @param {number} ms - 待機時間（ミリ秒）
 * @returns {Promise<void>}
 */
function delay(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

function getCurrentDir() {
	return `C:\\Users\\${currentUser}>`;
}

/*
*Cookie設定
*/
function setCookie(name, value, days = 7) {
	const expires = new Date(Date.now() + days * 864e5).toUTCString();
	document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
}

function getCookie(name) {
	return document.cookie.split('; ').reduce((r, v) => {
		const parts = v.split('=');
		return parts[0] === name ? decodeURIComponent(parts[1]) : r;
	}, '');
}

function deleteCookie(name) {
	document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
}


/**
 * テキスト入力アニメーション
 * @param {*} text 
 * @param {*} speed 
 */
async function printLine(text, speed = 30) {
	const textElement = document.createElement('div');
	textElement.className = 'line';
	terminal.appendChild(textElement);

	for (let i = 0; i < text.length; i++) {
		textElement.textContent += text[i];
		await delay(speed);
	}
}

async function typeLine(texts, speed = 30, brSpeed = 250) {
	if (Array.isArray(texts)) {
		for(const text of texts){
			await printLine(text, speed);
			await delay(brSpeed);
		}
	}else if (typeof texts === 'string') {
		await printLine(texts, speed);
	}
}

function inputPrompt() {
	const inputLine = document.createElement('div');
	inputLine.className = 'input-line';

	const prompt = document.createElement('span');
	prompt.textContent = getCurrentDir();
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
			executedLine.textContent = getCurrentDir() + ' ' + userInput;
			terminal.appendChild(executedLine);

			await checkInputLine(userInput);
		}else if (e.key === 'Tab') { //Tab補完機能
			e.preventDefault(); //Tabデフォルト機能無効化

			const inputValue = input.value.trim();
			const inputParts = inputValue.split(/\s+/);
			const baseCommand = inputParts[0]?.toLowerCase();
			const currentArg = inputParts[inputParts.length - 1]
			if (inputParts.length === 1) {
				const matches = Commands.filter(cmd => cmd.startsWith(baseCommand))
				if (matches.length === 1) {
					input.value = matches[0] + ' ';
				}
			}else if (['login', 'register'].includes(baseCommand)) {
				if (inputParts.length === 2) {
					const matches = Object.keys(users).filter(user => user.startsWith(currentArg));
					if (matches.length === 1) {
						inputParts[1] = matches[0];
						input.value = inputParts.join(' ') + ' ';
					}
				}
			}
		}
	});
}


const Commands = [
	'now',
	'help',
	'register',
	'login',
	'logout',
	'exit',
	'clear',
	'echo'
]

async function checkInputLine(userInput) {
	const [base, ...args] = userInput.split(' ');
	const argsTrimmed = args.map(arg => arg.trim()).filter(arg => arg.length > 0);
	
	switch (base.toLowerCase()) {
		case 'now':
			const now = new Date();
			now.setTime(now.getTime() - now.getTimezoneOffset() * 60 * 1000);
			const formattedNow = now.toISOString().replace('T', ' ').substring(0,19);
			await typeLine(formattedNow);
		break;
			
		case 'help':
			const helpText = [
				'help                使用できるコマンドを表示します',
				'register [u] [p]    ユーザーを新規登録します',
				'login [u] [p]       ユーザーでログインします',
				'logout              ログアウトします',
				'echo [TEXT]         TEXTを表示します',
				'clear               画面をクリアします',
				'now                 今日の日時を表示します'
			];
			await typeLine(helpText, 20, 100);
		break;

		case 'echo':
			await typeLine(args.join(' '));
		break;

		case 'register':
			if (argsTrimmed.length !== 2) {
				await typeLine('Usage: register [username] [password]')
				break;
			}
			const [regUser, regPass] = argsTrimmed;

			if (users[regUser]) {
				await typeLine('This user is already registered');
			}else {
				users[regUser] = regPass;
				await typeLine('Success register')
			}
		break;

		case 'login':
			if (argsTrimmed.length !== 2) {
				await typeLine('Usage: login [username] [password]');
				break;
			}
			const [loginUser, loginPass] = argsTrimmed;

			if (!users[loginUser]) {
				await typeLine('This user is not registered');
				break;
			}else if (users[loginUser] !== loginPass) {
				await typeLine('Incorrect password');
				break;
			}else{
				currentUser = loginUser;
				setCookie('username', loginUser);
				setCookie('userpass', loginPass);
				await typeLine('Login successful');
			}
		break;

		case 'logout':
		case 'exit':
			currentUser = 'guest';
			deleteCookie('username');
			deleteCookie('userpass');
			await typeLine('Logged out');
		break;

		case 'clear':
			terminal.innerHTML = '';
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
	const savedUser = getCookie('username');
	const savedPass = getCookie('userpass');
	if (savedUser && savedPass && users[savedUser] === savedPass) {
		currentUser = savedUser;
		await typeLine([
			`Welcome back, ${savedUser}`,
			'Auto-login successful'
		]);
	} else {
		await typeLine(defaultLines);
	}
	inputPrompt();
})();