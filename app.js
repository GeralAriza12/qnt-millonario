// QNT Millonario - Game script with ladder, 50/50 lifeline, money rewards, and simple sounds

const TOTAL = 10;
let pool = [];
let set = [];
let idx = 0;
let money = 0;
let used5050 = false;
let soundOn = true;

const startBtn = document.getElementById('start-btn');
const startScreen = document.getElementById('start');
const gameScreen = document.getElementById('game');
const resultScreen = document.getElementById('result');
const qCount = document.getElementById('q-count');
const questionEl = document.getElementById('question');
const choicesEl = document.getElementById('choices');
const nextBtn = document.getElementById('next');
const moneyEl = document.getElementById('money');
const finalMoney = document.getElementById('final-money');
const finalMsg = document.getElementById('final-msg');
const playAgain = document.getElementById('play-again');
const lifeline5050 = document.getElementById('lifeline-5050');
const soundToggle = document.getElementById('sound-toggle');
const levelsEl = document.getElementById('levels');

startBtn.onclick = startGame;
nextBtn.onclick = nextQuestion;
playAgain.onclick = startGame;
lifeline5050.onclick = use5050;
soundToggle.onclick = ()=> { soundOn = !soundOn; soundToggle.classList.toggle('sound-on', soundOn); playTone(600,0.08); };

function init(){
  if(window.QNT_QUESTIONS) pool = window.QNT_QUESTIONS.slice();
  generateLevels();
  renderLadder();
}
init();

function startGame(){
  used5050 = false;
  lifeline5050.disabled = false;
  soundToggle.classList.toggle('sound-on', soundOn);
  set = pick(pool, TOTAL);
  idx = 0;
  money = 0;
  showScreen('game');
  renderQuestion();
  updateMoney();
}

function showScreen(id){
  startScreen.classList.remove('active');
  gameScreen.classList.remove('active');
  resultScreen.classList.remove('active');
  document.getElementById(id).classList.add('active');
}

function pick(arr, n){
  let a = arr.slice();
  for(let i=a.length-1;i>0;i--){ let j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; }
  return a.slice(0,n);
}

function renderQuestion(){
  const q = set[idx];
  qCount.innerText = `Pregunta ${idx+1}/${TOTAL}`;
  questionEl.innerText = q.question;
  choicesEl.innerHTML = '';
  nextBtn.disabled = true;
  highlightLevel(idx);
  q.options.forEach((o,i)=>{
    const d = document.createElement('div');
    d.className = 'choice';
    d.dataset.i = i;
    d.innerHTML = `<strong>${String.fromCharCode(65+i)}.</strong> ${o}`;
    d.onclick = ()=> selectChoice(d, i);
    choicesEl.appendChild(d);
  });
  playTone(450,0.06);
}

function selectChoice(el, i){
  if(el.classList.contains('disabled')) return;
  const q = set[idx];
  Array.from(choicesEl.children).forEach((c,ii)=>{
    c.classList.add('disabled');
    if(ii===q.answer) c.classList.add('correct');
    if(ii===i && ii!==q.answer) c.classList.add('wrong');
  });
  if(i===q.answer){
    money += (window.MONEY_LEVELS && window.MONEY_LEVELS[idx]) ? window.MONEY_LEVELS[idx] : 100;
    playTone(880,0.09);
    el.classList.add('scale-up');
    // animate ladder item
    const nodes = levelsEl.querySelectorAll('li');
    const index = nodes.length - 1 - idx;
    if(nodes[index]){ nodes[index].classList.add('win'); setTimeout(()=>nodes[index].classList.remove('win'),800); }
  } else {
    playTone(200,0.25);
  }
  updateMoney();
  nextBtn.disabled = false;
}

function nextQuestion(){
  idx++;
  if(idx>=TOTAL){
    endGame();
  } else {
    renderQuestion();
  }
}

function updateMoney(){
  moneyEl.innerText = formatMoney(money);
}

function endGame(){
  showScreen('result');
  finalMoney.innerText = `Has ganado: ${formatMoney(money)}`;
  let msg = '';
  if(money <= 400) msg = 'Sigue practicando, cada día se mejora una venta.';
  else if(money <= 800) msg = 'Buen trabajo, estás fortaleciendo tu perfil comercial.';
  else msg = '¡Excelente! Tienes mentalidad de vendedor QNT.';
  finalMsg.innerText = msg;
  playTone(520,0.12);
}

function formatMoney(n){ return '$' + n.toFixed(0); }

function use5050(){
  if(used5050) return;
  used5050 = true;
  lifeline5050.disabled = true;
  const q = set[idx];
  const wrongs = [];
  q.options.forEach((o,i)=>{ if(i!==q.answer) wrongs.push(i); });
  // remove two wrongs randomly leaving only one wrong + correct
  while(wrongs.length>1){ wrongs.splice(Math.floor(Math.random()*wrongs.length),1); }
  Array.from(choicesEl.children).forEach((c,i)=>{
    if(wrongs.includes(i)) c.classList.add('disabled');
  });
  playTone(600,0.06);
}

function generateLevels(){
  const base = window.MONEY_LEVELS || [100,200,300,400,500,600,700,800,900,1000];
  window.MONEY_LEVELS = base;
}

function renderLadder(){
  const ul = levelsEl;
  ul.innerHTML='';
  const arr = (window.MONEY_LEVELS || [100,200,300,400,500,600,700,800,900,1000]);
  for(let i=arr.length-1;i>=0;i--){
    const li = document.createElement('li');
    li.id = 'lvl-'+i;
    li.innerHTML = `<span class="small">Nivel ${i+1}</span><span>${formatMoney(arr[i])}</span>`;
    ul.appendChild(li);
  }
}

function highlightLevel(i){
  const nodes = levelsEl.querySelectorAll('li');
  nodes.forEach(n=>n.classList.remove('active'));
  const index = nodes.length - 1 - i;
  if(nodes[index]) nodes[index].classList.add('active');
}

// simple audio
function playTone(freq, duration){
  if(!soundOn) return;
  try{
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type='sine';
    o.frequency.value = freq;
    g.gain.value = 0.05;
    o.connect(g); g.connect(ctx.destination);
    o.start();
    setTimeout(()=>{ o.stop(); ctx.close(); }, duration*1000);
  }catch(e){ console.log(e); }
}
