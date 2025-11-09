// ==== QNT MILLONARIO ====
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
const ctx = wheelCanvas.getContext("2d");

let currentQuestion = 0;
let score = 0;
let shuffledQuestions = [];
let canAnswer = true;

// ==== Banco de preguntas ====
const questions = [
  { question: "¿Qué papel juega la neuroventa en el proceso comercial?", answers: ["A) Realizar ventas rápidas sin analizar al cliente", "B) Ignorar las emociones del cliente", "C) Solo enfocarse en el precio", "D) Entender y aprovechar cómo funciona el cerebro para influir en la decisión de compra"], correct: 3 },
  { question: "¿Qué es una objeción?", answers: ["A) Un argumento que el cliente usa para rechazar la oferta", "B) Un impedimento definitivo para vender", "C) Una oportunidad para profundizar en las necesidades del cliente", "D) Una señal de que el cliente no está interesado"], correct: 2 },
  { question: "¿Cómo podrías vender sin hablar del producto?", answers: ["A) Usando historias reales que conecten emocionalmente", "B) Evitando todo tipo de conversación", "C) Hablando de precios primero", "D) Entregando folletos técnicos"], correct: 0 },
  { question: "¿Qué señal demuestra que un cliente es analítico?", answers: ["A) Se enfoca en beneficios emocionales", "B) Pregunta detalles y datos concretos", "C) Muestra impaciencia y deseo de cerrar rápido", "D) Habla mucho de sus experiencias personales"], correct: 1 },
  { question: "¿Qué técnica ayuda a reducir objeciones?", answers: ["A) Contradecir al cliente con firmeza", "B) Escuchar activamente y empatizar", "C) Interrumpir para mantener el control", "D) Evitar hablar de sus preocupaciones"], correct: 1 },
  { question: "¿Qué busca la Programación Neurolingüística (PNL) en ventas?", answers: ["A) Persuadir sin ética", "B) Manipular al cliente para comprar", "C) Mejorar la comunicación y conexión con el cliente", "D) Reducir el tiempo de la conversación"], correct: 2 },
  { question: "¿Qué hace que un cliente se acerque voluntariamente a QNT?", answers: ["A) La presión comercial constante", "B) La atracción genuina por la confianza y el servicio", "C) El bajo precio únicamente", "D) Los mensajes masivos sin personalización"], correct: 1 },
  { question: "¿Qué representa la flexibilidad en el proceso de ventas?", answers: ["A) Cambiar la oferta según la competencia", "B) Adaptarse al ritmo y necesidades del cliente", "C) Mantener siempre el mismo discurso", "D) Ofrecer descuentos sin analizar"], correct: 1 },
  { question: "¿Qué permite el perfilamiento del cliente?", answers: ["A) Vender más rápido sin preguntar", "B) Comprender quién es y qué necesita realmente", "C) Ignorar sus emociones", "D) Evitar contacto directo"], correct: 1 },
  { question: "¿Qué actitud refleja un buen vendedor QNT?", answers: ["A) Escucha, empatía y actitud proactiva", "B) Impaciencia por cerrar", "C) Hablar más que el cliente", "D) Foco en el producto, no en la persona"], correct: 0 }
];

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
    feedbackEl.textContent = "❌ Incorrecto.";
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
    else showRetryMessage();
  }
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
  steps.forEach((s, i) => {
    s.classList.toggle("active", i === 10 - (currentQuestion + 1));
  });
}

const prizes = ["5 min de break ☕", "5 min de almuerzo extra 🍽️", "Sigue intentando 💪", "5 min salida temprano 🕔", "5 min llegada tarde 😎"];

function showRoulette() {
  roulette.classList.remove("hidden");
  drawWheel();
}

function showRetryMessage() {
  roulette.classList.remove("hidden");
  roulette.innerHTML = "<h2>🧠 Puedes mejorar 🧠</h2><p>Te recomendamos repasar los siguientes temas:</p><ul><li>Neuroventas</li><li>Perfilamiento del cliente</li><li>Comunicación efectiva</li></ul>";
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
