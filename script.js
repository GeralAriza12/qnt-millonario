const intro = document.getElementById("intro");
const startBtn = document.getElementById("startBtn");
const game = document.getElementById("game");
const questionEl = document.getElementById("question");
const answersEl = document.getElementById("answers");
const feedbackEl = document.getElementById("feedback");
const nextBtn = document.getElementById("nextBtn");
const fiftyBtn = document.getElementById("fiftyBtn");
const levelEl = document.getElementById("level");
const ladder = document.getElementById("ladder");
const roulette = document.getElementById("roulette");
const spinBtn = document.getElementById("spinBtn");
const resultText = document.getElementById("resultText");
const wheelCanvas = document.getElementById("wheelCanvas");
const improve = document.getElementById("improve");
const ctx = wheelCanvas.getContext("2d");

let currentQuestion = 0;
let score = 0;
let shuffledQuestions = [];
let canAnswer = true;

// Mostrar botón tras 5 segundos
window.addEventListener("load", () => {
  setTimeout(() => startBtn.classList.remove("hidden"), 5000);
});

// Banco de preguntas
const questions = [
  { question: "¿Qué papel juega la neuroventa en el proceso comercial?",
    answers: ["A) Ventas rápidas", "B) Ignorar emociones", "C) Precio", "D) Entender cómo funciona el cerebro"],
    correct: 3 },
  { question: "¿Qué es una objeción?", answers: ["A) Rechazo", "B) Impedimento", "C) Oportunidad", "D) Desinterés"], correct: 2 },
  { question: "¿Cómo vender sin hablar del producto?", answers: ["A) Historias reales", "B) Evitar conversación", "C) Precios primero", "D) Folletos"], correct: 0 },
  { question: "¿Qué señal demuestra que un cliente es analítico?", answers: ["A) Emocional", "B) Datos", "C) Impaciente", "D) Experiencias"], correct: 1 },
  { question: "¿Qué técnica reduce objeciones?", answers: ["A) Contradecir", "B) Escuchar y empatizar", "C) Interrumpir", "D) Evadir"], correct: 1 },
  { question: "¿Qué busca la PNL en ventas?", answers: ["A) Persuadir", "B) Manipular", "C) Mejorar comunicación", "D) Reducir tiempo"], correct: 2 },
  { question: "¿Qué atrae al cliente a QNT?", answers: ["A) Presión", "B) Confianza y servicio", "C) Precio", "D) Mensajes masivos"], correct: 1 },
  { question: "¿Qué representa la flexibilidad?", answers: ["A) Cambiar oferta", "B) Adaptarse", "C) Mismo discurso", "D) Descuento"], correct: 1 },
  { question: "¿Qué permite el perfilamiento?", answers: ["A) Vender rápido", "B) Comprender necesidades", "C) Ignorar emociones", "D) Evitar contacto"], correct: 1 },
  { question: "¿Qué actitud refleja un buen vendedor QNT?", answers: ["A) Escucha y empatía", "B) Impaciencia", "C) Hablar mucho", "D) Foco en producto"], correct: 0 }
];

// Iniciar juego
startBtn.addEventListener("click", () => {
  intro.classList.add("hidden");
  game.classList.remove("hidden");
  shuffledQuestions = [...questions].sort(() => 0.5 - Math.random()).slice(0, 10);
  currentQuestion = 0;
  score = 0;
  showQuestion();
  generateLadder();
});

function showQuestion() {
  const q = shuffledQuestions[currentQuestion];
  levelEl.textContent = `Nivel ${currentQuestion + 1}`;
  questionEl.textContent = q.question;
  feedbackEl.textContent = "";
  answersEl.innerHTML = "";
  nextBtn.classList.add("hidden");
  fiftyBtn.disabled = false;
  canAnswer = true;

  q.answers.forEach((ans, i) => {
    const btn = document.createElement("button");
    btn.textContent = ans;
    btn.addEventListener("click", () => selectAnswer(i));
    answersEl.appendChild(btn);
  });
  updateLadder();
}

function selectAnswer(i) {
  if (!canAnswer) return;
  canAnswer = false;
  const q = shuffledQuestions[currentQuestion];
  const buttons = answersEl.querySelectorAll("button");
  if (i === q.correct) {
    buttons[i].classList.add("correct");
    feedbackEl.textContent = "¡Correcto! 🎯";
    score++;
  } else {
    buttons[i].classList.add("wrong");
    buttons[q.correct].classList.add("correct");
    feedbackEl.textContent = "❌ Incorrecto";
  }
  nextBtn.classList.remove("hidden");
}

nextBtn.addEventListener("click", () => {
  currentQuestion++;
  if (currentQuestion < 10) {
    showQuestion();
  } else {
    game.classList.add("hidden");
    if (score >= 9) showRoulette();
    else improve.classList.remove("hidden");
  }
});

fiftyBtn.addEventListener("click", () => {
  const q = shuffledQuestions[currentQuestion];
  const buttons = Array.from(answersEl.querySelectorAll("button"));
  let wrong = buttons.map((b, i) => (i !== q.correct ? i : null)).filter(i => i !== null);
  wrong.sort(() => 0.5 - Math.random());
  wrong.slice(0, 2).forEach(i => (buttons[i].style.visibility = "hidden"));
  fiftyBtn.disabled = true;
});

function generateLadder() {
  ladder.innerHTML = "";
  for (let i = 10; i >= 1; i--) {
    const step = document.createElement("div");
    step.textContent = `Nivel ${i}`;
    ladder.appendChild(step);
  }
}

function updateLadder() {
  const steps = ladder.querySelectorAll("div");
  steps.forEach((s, i) => s.classList.toggle("active", i === 10 - (currentQuestion + 1)));
}

const prizes = [
  "5 min de break ☕", "5 min de almuerzo extra 🍽️", "Sigue intentando 💪",
  "5 min salida temprano 🕔", "5 min llegada tarde 😎"
];

function showRoulette() {
  roulette.classList.remove("hidden");
  drawWheel();
}

function drawWheel() {
  const arc = (2 * Math.PI) / prizes.length;
  for (let i = 0; i < prizes.length; i++) {
    ctx.beginPath();
    ctx.fillStyle = i % 2 === 0 ? "#ffcc00" : "#0043c2";
    ctx.moveTo(200, 200);
    ctx.arc(200, 200, 200, i * arc, (i + 1) * arc);
    ctx.fill();
    ctx.save();
    ctx.translate(200, 200);
    ctx.rotate(i * arc + arc / 2);
    ctx.fillStyle = "#fff";
    ctx.textAlign = "right";
    ctx.font = "16px Poppins";
    ctx.fillText(prizes[i], 180, 5);
    ctx.restore();
  }
}

spinBtn.addEventListener("click", () => {
  const spinAngle = Math.random() * 360 + 1440;
  wheelCanvas.style.transition = "transform 4s ease-out";
  wheelCanvas.style.transform = `rotate(${spinAngle}deg)`;
  spinBtn.disabled = true;
  setTimeout(() => {
    const prizeIndex = Math.floor(((360 - (spinAngle % 360)) / 72) % prizes.length);
    resultText.textContent = `🎉 ¡Ganaste: ${prizes[prizeIndex]}! 🎉`;
  }, 4500);
});
