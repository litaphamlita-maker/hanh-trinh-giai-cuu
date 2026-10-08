
const state = {
  stage: 0,
  health: 10,
  questions: [],
  started: false,
  locked: false
};

const $ = id => document.getElementById(id);

async function loadQuestions(){
  const res = await fetch("data/questions.json");
  if(!res.ok) throw new Error("Không thể tải data/questions.json");
  state.questions = await res.json();
  if(state.questions.length !== 12) throw new Error("questions.json phải có đúng 12 chặng.");
}

function renderHealth(){
  const box = $("health");
  box.innerHTML = "";
  for(let i=0;i<10;i++){
    const s = document.createElement("span");
    s.className = "heart" + (i < state.health ? "" : " empty");
    s.textContent = "❤️";
    box.appendChild(s);
  }
  const count = document.createElement("div");
  count.className = "bite-count";
  count.textContent = state.health < 10 ? `🖐️ ${10-state.health} vết cắn` : "🖐️ Chưa bị cắn";
  $("healthText").textContent = `${state.health}/10`;
  box.appendChild(count);
}

function renderMap(){
  document.querySelectorAll(".node").forEach((n,i)=>{
    n.classList.toggle("done", i < state.stage);
    n.classList.toggle("current", i === state.stage);
    n.classList.toggle("locked", i > state.stage);
  });
  $("progressBar").style.width = `${(state.stage/12)*100}%`;
  $("stageLabel").textContent = `CHẶNG ${Math.min(state.stage+1,12)} / 12`;
}

function moveHero(){
  const hero = $("hero");
  const node = document.querySelector(`.node[data-stage="${state.stage}"]`);
  if(!node) return;
  const r = node.getBoundingClientRect();
  const parent = $("game").getBoundingClientRect();
  const left = r.left + r.width/2 - parent.left;
  const bottom = parent.bottom - (r.top + r.height/2);
  hero.style.left = `${left}px`;
  hero.style.bottom = `${Math.max(125,bottom-55)}px`;
}

function showStart(){
  $("startOverlay").classList.remove("hidden");
  $("questionOverlay").classList.add("hidden");
  $("rescueOverlay").classList.add("hidden");
  $("victoryOverlay").classList.add("hidden");
  $("gameoverOverlay").classList.add("hidden");
  $("hero").classList.remove("walk");
}

async function startGame(){
  state.stage=0; state.health=10; state.started=true; state.locked=false;
  renderHealth(); renderMap();
  $("startOverlay").classList.add("hidden");
  $("hero").classList.add("walk");
  await delay(250);
  moveHero();
  await delay(700);
  openStage();
}

function openStage(){
  if(state.stage >= 12){ showRescue(); return; }
  state.locked=false;
  renderMap();
  moveHero();

  const q = state.questions[state.stage];
  $("questionStage").textContent = `🐍 CON RẮN GIAN ÁC — CHẶNG ${state.stage+1}`;
  $("questionText").textContent = q.question;

  const opts = $("options");
  opts.innerHTML="";
  q.options.forEach((text,i)=>{
    const b=document.createElement("button");
    b.className="option";
    b.innerHTML=`<b>${["A","B","C","D"][i]}.</b> ${text}`;
    b.onclick=()=>answer(i);
    opts.appendChild(b);
  });
  $("feedback").className="feedback";
  $("feedback").textContent="";
  $("questionOverlay").classList.remove("hidden");

  const snake=$("snake");
  snake.classList.remove("defeated");
  snake.classList.remove("appear");
  void snake.offsetWidth;
  snake.classList.add("appear");
}

function answer(choice){
  if(state.locked) return;
  state.locked=true;

  const q=state.questions[state.stage];
  const buttons=[...document.querySelectorAll(".option")];
  buttons.forEach(b=>b.disabled=true);

  if(choice === Number(q.correct)){
    buttons[choice].classList.add("correct");
    $("feedback").className="feedback good";
    $("feedback").textContent=q.explanationCorrect || "✨ Chính xác! Con rắn biến mất.";
    $("snake").classList.add("defeated");
    setTimeout(nextStage,1000);
  }else{
    buttons[choice].classList.add("wrong");
    if(buttons[q.correct]) buttons[q.correct].classList.add("correct");
    state.health--;
    renderHealth();
    showBite();
    $("feedback").className="feedback bad";
    $("feedback").textContent=q.explanationWrong || "🐍 Chưa đúng! Bạn bị rắn cắn và mất 1 máu.";

    if(state.health <= 0){
      setTimeout(gameOver,1050);
    }else{
      setTimeout(nextStage,1250);
    }
  }
}

function showBite(){
  const mark=$("biteMark");
  mark.classList.remove("show");
  void mark.offsetWidth;
  mark.classList.add("show");
}

function nextStage(){
  $("questionOverlay").classList.add("hidden");
  state.stage++;
  renderMap();
  if(state.stage>=12){
    setTimeout(showRescue,450);
  }else{
    setTimeout(openStage,350);
  }
}

function showRescue(){
  $("questionOverlay").classList.add("hidden");
  $("snake").classList.add("hidden");
  $("hero").classList.remove("walk");
  $("rescueOverlay").classList.remove("hidden");
  renderMap();
}

function rescue(){
  $("rescueButton").disabled=true;
  $("cuts").style.display="block";
  $("ropeText").textContent="⚔️ XOẸT! XOẸT! DÂY ĐÃ ĐỨT!";
  setTimeout(()=>{
    $("cage").classList.add("hidden");
    $("giant").classList.add("hidden");
    $("friend").classList.add("freed");
    $("rescueButton").classList.add("hidden");
  },550);
  setTimeout(()=>{
    $("rescueOverlay").classList.add("hidden");
    $("victoryOverlay").classList.remove("hidden");
    $("finalHealth").textContent=`Bạn còn ${state.health}/10 máu. Đồng đội đã được giải cứu an toàn!`;
    $("progressBar").style.width="100%";
  },1500);
}

function gameOver(){
  $("questionOverlay").classList.add("hidden");
  $("hero").classList.remove("walk");
  $("gameoverOverlay").classList.remove("hidden");
}

function restart(){ location.reload(); }
function delay(ms){return new Promise(r=>setTimeout(r,ms));}

window.addEventListener("resize",()=>{ if(state.started) moveHero(); });

loadQuestions().catch(err=>{
  console.error(err);
  $("loadingError").textContent="Không tải được questions.json. Hãy kiểm tra cấu trúc thư mục GitHub.";
  $("loadingError").classList.remove("hidden");
});
