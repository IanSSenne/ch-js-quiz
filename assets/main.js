const startScreen = document.querySelector("#start-screen");
const quizScreen = document.querySelector("#quiz-screen");
const scoreScreen = document.querySelector("#score-screen");
const timer = document.querySelector("#timer");
const answers = document.querySelector("#answers");
const question = document.querySelector("#question");
const promptEl = document.querySelector("#prompt");
const feedbackEl = document.querySelector("#feedback");
const highScoresEl = document.querySelector("#high-scores");

const questions = [
	{
		question: "What is 2 + '2'?",
		answers: ["4", "22", "2", "5"],
		correctAnswer: 1,
	},
	{
		question: 'what is the result of [..."👨‍👨‍👧‍👧"]',
		answers: [
			`["👨","\\u200d","👨","\\u200d","👧","\\u200d","👧"]`,
			`["👨","👨","👧","👧"]`,
			`["👧","\\u200d","👧","\\u200d","👨","\\u200d","👨"]`,
			`["👨‍👨‍👧‍👧"]`,
		],
		correctAnswer: 0,
	},
];

const screens = [startScreen, quizScreen, scoreScreen];
let isRunning = false;
let intervalId = null;
let timeRemaining = 0;
let questionsIndex = 0;
let hasSubmitScore = false;
function renderQuestion() {
	answers.innerHTML = "";
	const questionData = questions[questionsIndex];
	if (!questionData) return endGame();
	question.textContent = questionData.question;
	let hasAnswered = false;
	questionData.answers
		.map((answer, index) => {
			const li = document.createElement("li");
			const answerElement = document.createElement("button");
			answerElement.textContent = answer;
			answerElement.addEventListener("click", () => {
				if (hasAnswered) return;
				hasAnswered = true;
				if (index === questionData.correctAnswer) {
					feedbackEl.textContent = "Correct!";
					if (questionsIndex === questions.length) endGame();
				} else {
					feedbackEl.textContent = "Wrong!";
					timeRemaining -= 5;
				}
				promptEl.hidden = true;
				feedbackEl.hidden = false;
				setTimeout(() => {
					feedbackEl.hidden = true;
					promptEl.hidden = false;

					questionsIndex++;
					renderQuestion();
				}, 1000);
			});
			li.appendChild(answerElement);
			return li;
		})
		// randomize the answer order, no cheating!
		.sort(() => Math.random() - 0.5)
		.forEach((answer) => {
			answers.appendChild(answer);
		});
}

function setScreen(name) {
	screens.forEach((screen) => {
		screen.style.display = "none";
	});

	document.querySelector(`#${name}-screen`).style.display = "block";
}

function endGame() {
	clearInterval(intervalId);
	setScreen("score");
	renderHighScores();
}

function tickApp() {
	timeRemaining--;
	timer.textContent = timeRemaining;
	if (timeRemaining === 0) endGame();
}

startScreen.querySelector("button").addEventListener("click", () => {
	setScreen("quiz");
	timeRemaining = 60;

	isRunning = true;

	questionsIndex = 0;
	hasSubmitScore = false;
	renderQuestion();
	intervalId = setInterval(tickApp, 1000);
});

function renderHighScores() {
	const scores = JSON.parse(localStorage.getItem("scores")) || [];
	highScoresEl.innerHTML = "";
	scores.forEach((score) => {
		const li = document.createElement("li");
		let nameSpan = document.createElement("span");
		nameSpan.textContent = score.name;
		let scoreSpan = document.createElement("span");
		scoreSpan.textContent = score.score;
		li.appendChild(nameSpan);
		li.appendChild(scoreSpan);
		highScoresEl.appendChild(li);
	});
}

document.querySelector("#score-form").addEventListener("submit", (e) => {
	e.preventDefault();
	if (hasSubmitScore) return;
	hasSubmitScore = true;
	const name = document.querySelector("#initials").value;
	const scores = JSON.parse(localStorage.getItem("scores")) || [];
	scores.push({ name, score: timeRemaining });
	scores.sort((a, b) => b.score - a.score);
	localStorage.setItem("scores", JSON.stringify(scores));
	renderHighScores();
});
