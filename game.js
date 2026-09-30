const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;

const state = {
  level: 0,
  memoryCount: 0,
  player: { x: 480, y: 350 },
  keys: {},
  paused: false,
  dialogue: null,
  dialogueIndex: 0,
  phaseStarted: false,
  phaseWon: false,
  poolWon: false,
  journalOpened: false
};

const levels = [
  {
    label: "Prologue — MFG Staff",
    subtitle: "Role Call",
    bg: "#78a65e"
  },
  { label: "Level 1 — The Whiteboard", subtitle: "RA Office", bg: "#9b8067" },
  { label: "Level 2 — Coffee Run", subtitle: "Tate St.", bg: "#b88a63" },
  { label: "Level 3 — Phase 10", subtitle: "RA Office", bg: "#8b755d" },
  { label: "Level 4 — Pool", subtitle: "Basement", bg: "#4f6e63" },
  { label: "Level 5 — Birthday", subtitle: "Your Room", bg: "#493f62" }
];

const dialogues = {
  prologue: [
    ["MFG STAFF", "Role call starts. Everyone gathers around."],
    ["Maddie", "Do y'all know Booyah?"],
    ["Maddie", "Booyah, it's MFG, best at the G, made a couple calls, don't play with me..."],
    ["Maddie", "Everybody wanna stay here, we got them good vibes, back in the day, they used to see us and drive by, we keep it real, we is not lying."],
    ["SYSTEM", "MEMORY UNLOCKED: First Impression"]
  ],
  whiteboard: [
    ["SYSTEM", "The whiteboard is covered in brainrot and inside jokes."],
    ["SYSTEM", "Elephant: ADDRESS ME"],
    ["SYSTEM", "Tung Tung Tung Sahur."],
    ["SYSTEM", "Ballerina Cappuccina."],
    ["SYSTEM", "Cunty SpongeBob."],
    ["SYSTEM", "And several drawings that make absolutely no sense to anyone else."],
    ["SYSTEM", "MEMORY UNLOCKED: The Whiteboard"]
  ],
  coffee: [
    ["SYSTEM", "You're not feeling well. Your energy is low."],
    ["SYSTEM", "Your phone buzzes."]
  ],
  birthday: [
    ["Maddie", "Why do you keep looking at me?"],
    ["Him", "..."],
    ["Him", "I want you."],
    ["Maddie", "Really?"],
    ["SYSTEM", "You trace his bottom lip with your thumb."],
    ["SYSTEM", "You kiss."],
    ["SYSTEM", "MEMORY SAVED."]
  ]
};

function resizeCanvas() {
  const ratio = canvas.width / canvas.height;
  const width = Math.min(canvas.parentElement.clientWidth, 960);
  canvas.style.height = `${width / ratio}px`;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function setLevel(n) {
  state.level = n;
  document.getElementById("level-label").textContent = levels[n].label;
  document.getElementById("level-number").textContent = n === 0 ? "Prologue" : n;
  document.body.style.setProperty("--level-bg", levels[n].bg);
  state.player.x = 480;
  state.player.y = 350;
  state.paused = false;
}

function memory() {
  state.memoryCount = Math.min(5, state.memoryCount + 1);
  document.getElementById("memory-count").textContent = state.memoryCount;
}

function drawPixelCharacter(x, y, opts = {}) {
  const isMaddie = opts.maddie;
  const skin = isMaddie ? "#9b6a54" : "#f0c7aa";
  const hair = isMaddie ? "#19151a" : "#5a3427";
  ctx.fillStyle = hair;
  ctx.fillRect(x - 17, y - 38, 34, 18);
  if (!isMaddie) {
    ctx.fillStyle = "#a74643";
    ctx.fillRect(x - 8, y - 38, 12, 6);
  }
  ctx.fillStyle = skin;
  ctx.fillRect(x - 13, y - 23, 26, 24);
  ctx.fillStyle = "#28212c";
  ctx.fillRect(x - 9, y - 17, 4, 4);
  ctx.fillRect(x + 5, y - 17, 4, 4);
  ctx.fillStyle = isMaddie ? "#273b78" : "#4d7c54";
  ctx.fillRect(x - 17, y + 1, 34, 27);
  ctx.fillStyle = "#e7e0d3";
  ctx.fillRect(x - 15, y + 28, 13, 12);
  ctx.fillRect(x + 2, y + 28, 13, 12);
  if (!isMaddie) {
    ctx.fillStyle = "#e6e0d2";
    ctx.fillRect(x - 23, y - 8, 6, 22);
    ctx.fillRect(x + 17, y - 8, 6, 22);
    ctx.fillStyle = "#222";
    ctx.fillRect(x - 24, y - 11, 7, 3);
    ctx.fillRect(x + 17, y - 11, 7, 3);
    ctx.fillStyle = "#7f9c77";
    ctx.fillRect(x - 19, y + 5, 38, 4);
  }
}

function drawScene() {
  const bg = levels[state.level].bg;
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Simple original pixel-art environment
  ctx.fillStyle = "rgba(255,255,255,.10)";
  for (let x = 0; x < canvas.width; x += 48) {
    for (let y = 0; y < canvas.height; y += 48) {
      ctx.fillRect(x + ((y / 48) % 2) * 8, y, 2, 2);
    }
  }

  if (state.level === 0) drawStaffRoom();
  if (state.level === 1) drawOffice();
  if (state.level === 2) drawDormCoffee();
  if (state.level === 3) drawPhaseRoom();
  if (state.level === 4) drawPoolRoom();
  if (state.level === 5) drawBirthdayRoom();

  drawPixelCharacter(state.player.x, state.player.y, { maddie: false });
}

function drawStaffRoom() {
  ctx.fillStyle = "#c7b08b";
  ctx.fillRect(80, 90, 800, 360);
  ctx.fillStyle = "#765a47";
  ctx.fillRect(100, 110, 760, 35);
  ctx.fillStyle = "#463a42";
  ctx.font = "18px monospace";
  ctx.fillText("MFG STAFF", 420, 132);

  const positions = [[220,250],[330,250],[440,250],[550,250],[660,250],[770,250]];
  positions.forEach((p,i)=>drawPixelCharacter(p[0],p[1],{maddie:false}));
  drawPixelCharacter(480, 410, {maddie:true});
}

function drawOffice() {
  ctx.fillStyle = "#6d513f";
  ctx.fillRect(100, 80, 760, 390);
  ctx.fillStyle = "#e7e0ca";
  ctx.fillRect(190, 110, 580, 180);
  ctx.fillStyle = "#34302f";
  ctx.font = "20px monospace";
  ctx.fillText("ADDRESS ME", 235, 160);
  ctx.fillText("TUNG TUNG TUNG SAHUR", 235, 195);
  ctx.fillText("BALLERINA CAPPUCCINA", 235, 230);
  ctx.fillText("CUNTY SPONGEBOB", 235, 265);
  ctx.fillStyle = "#b4a6a0";
  ctx.fillRect(130, 340, 700, 55);
  drawPixelCharacter(480, 390, {maddie:true});
}

function drawDormCoffee() {
  ctx.fillStyle = "#bd9c83";
  ctx.fillRect(100, 80, 760, 390);
  ctx.fillStyle = "#70564b";
  ctx.fillRect(150, 120, 180, 240);
  ctx.fillStyle = "#dfd0b2";
  ctx.fillRect(540, 115, 240, 70);
  ctx.fillStyle = "#3d2d2a";
  ctx.font = "18px monospace";
  ctx.fillText("TATE ST. COFFEE", 565, 155);
  ctx.fillStyle = "#6b4c38";
  ctx.fillRect(610, 220, 100, 70);
  ctx.fillStyle = "#f5e7cc";
  ctx.fillRect(635, 205, 50, 20);
  drawPixelCharacter(420, 360, {maddie:true});
}

function drawPhaseRoom() {
  ctx.fillStyle = "#6d5b4e";
  ctx.fillRect(80, 80, 800, 390);
  ctx.fillStyle = "#8b5a3c";
  ctx.fillRect(250, 180, 460, 220);
  drawPixelCharacter(300, 300, {maddie:true});
  drawPixelCharacter(480, 300, {maddie:false});
  drawKimora(660, 300);
}

function drawKimora(x,y) {
  ctx.fillStyle = "#1b1417";
  ctx.fillRect(x-17,y-38,34,18);
  ctx.fillStyle = "#8f604e";
  ctx.fillRect(x-13,y-23,26,24);
  ctx.fillStyle = "#2f2530";
  ctx.fillRect(x-17,y+1,34,27);
  ctx.fillStyle = "#dfd8ca";
  ctx.fillRect(x-15,y+28,13,12);
  ctx.fillRect(x+2,y+28,13,12);
}

function drawPoolRoom() {
  ctx.fillStyle = "#4e423d";
  ctx.fillRect(70, 70, 820, 410);
  ctx.fillStyle = "#39735a";
  ctx.fillRect(210, 150, 540, 230);
  ctx.strokeStyle = "#704c32";
  ctx.lineWidth = 18;
  ctx.strokeRect(210,150,540,230);
  ctx.fillStyle = "#141414";
  [[210,150],[750,150],[210,380],[750,380],[480,150],[480,380]].forEach(([x,y])=>ctx.fillRect(x-12,y-12,24,24));
  drawPixelCharacter(350, 410, {maddie:true});
  drawPixelCharacter(600, 410, {maddie:false});
}

function drawBirthdayRoom() {
  ctx.fillStyle = "#493f62";
  ctx.fillRect(70,70,820,410);
  ctx.fillStyle = "#b99882";
  ctx.fillRect(250,230,460,180);
  ctx.fillStyle = "#d8b8b4";
  ctx.fillRect(250,200,460,60);
  drawPixelCharacter(430,310,{maddie:true});
  drawPixelCharacter(530,310,{maddie:false});
  ctx.fillStyle = "#f4d27b";
  ctx.fillRect(780,100,40,40);
}

function showDialogue(lines, onDone = null) {
  state.paused = true;
  state.dialogue = lines;
  state.dialogueIndex = 0;
  state.dialogueDone = onDone;
  document.getElementById("dialogue").classList.remove("hidden");
  renderDialogue();
}

function renderDialogue() {
  const [speaker,text] = state.dialogue[state.dialogueIndex];
  document.getElementById("speaker").textContent = speaker;
  document.getElementById("dialogue-text").textContent = text;
  document.getElementById("dialogue-next").textContent =
    state.dialogueIndex === state.dialogue.length - 1 ? "Continue" : "Next";
}

document.getElementById("dialogue-next").addEventListener("click", () => {
  if (!state.dialogue) return;
  state.dialogueIndex++;
  if (state.dialogueIndex >= state.dialogue.length) {
    const done = state.dialogueDone;
    state.dialogue = null;
    document.getElementById("dialogue").classList.add("hidden");
    state.paused = false;
    if (done) done();
  } else renderDialogue();
});

function openPhone() {
  state.paused = true;
  const messages = [
    ["him", "hey! i'm doing a tate street coffee run for kimora at like 4ish do ya want anything?"],
    ["him", "/would you wanna come with?"],
    ["me", "I'll take my usual, I won't tag along just bc I feel a little under the weather"],
    ["him", "🤔"],
    ["him", "i hope you feel better!"],
    ["me", "Thanks!"]
  ];
  const box = document.getElementById("messages");
  box.innerHTML = "";
  messages.forEach(([who,msg]) => {
    const div = document.createElement("div");
    div.className = `msg ${who}`;
    div.textContent = msg;
    box.appendChild(div);
  });
  document.getElementById("phone").classList.remove("hidden");
}
document.getElementById("close-phone").addEventListener("click", () => {
  document.getElementById("phone").classList.add("hidden");
  state.paused = false;
  startCoffee();
});

function startCoffee() {
  showDialogue([
    ["SYSTEM", "The coffee run begins."],
    ["SYSTEM", "Tate St. coffee acquired."],
    ["SYSTEM", "He comes back and talks to you outside your room."],
    ["SYSTEM", "Somehow, you're headed to the RA office together."]
  ], () => {
    setLevel(3);
    memory();
    showDialogue([
      ["SYSTEM", "You and him start playing Phase 10 in the office."],
      ["SYSTEM", "Kimora arrives."],
      ["Kimora", "Oh, I'm Big Dawg."]
    ], () => openPhase10());
  });
}

function openPhase10() {
  state.paused = true;
  document.getElementById("phase10").classList.remove("hidden");
  const hand = document.getElementById("phase-hand");
  hand.innerHTML = "";
  ["7","7","Q","Q","3","3","K","K"].forEach(v => {
    const c = document.createElement("div");
    c.className = "card";
    c.textContent = v;
    hand.appendChild(c);
  });
}
document.getElementById("phase-draw").addEventListener("click", () => {
  document.getElementById("phase-status").textContent = "You draw exactly the card you need. Suspicious.";
});
document.getElementById("phase-play").addEventListener("click", () => {
  document.getElementById("phase-status").textContent = "Phase complete! You won.";
  state.phaseWon = true;
  setTimeout(() => {
    document.getElementById("phase10").classList.add("hidden");
    state.paused = false;
    memory();
    setLevel(4);
    showDialogue([
      ["SYSTEM", "Next stop: the basement."],
      ["Maddie", "You wanna play pool?"],
      ["Him", "Sure."]
    ], () => openPool());
  }, 700);
});

function openPool() {
  state.paused = true;
  document.getElementById("pool").classList.remove("hidden");
}
document.getElementById("pool-shoot").addEventListener("click", () => {
  const status = document.getElementById("pool-status");
  status.textContent = "You line up the shot... and sink it.";
  setTimeout(() => {
    status.textContent = "Maddie wins. Obviously.";
    setTimeout(() => {
      document.getElementById("pool").classList.add("hidden");
      state.paused = false;
      state.poolWon = true;
      memory();
      setLevel(5);
      showDialogue([
        ["SYSTEM", "Birthday night."],
        ["SYSTEM", "You are lying side by side. Your knees touch."],
        ["SYSTEM", "You keep looking at him, then looking away."],
        ["Him", "Why do you keep looking at me?"],
        ["Him", "I want you."],
        ["Maddie", "Really?"],
        ["SYSTEM", "You trace his bottom lip with your thumb."],
        ["SYSTEM", "You kiss."],
        ["SYSTEM", "MEMORY SAVED."]
      ], () => openJournal());
    }, 900);
  }, 700);
});

const journalEntries = [
`FIRST JOURNAL ENTRY

I feel hella tired right now and all that's in my mind is 3:15.

[Your full journal entry can go here.]

He's just my good friend. My good boy.`,

`POEM

You tell me you want tattoos...

[Paste the full poem here.]

...you already left something permanent on me.`,

`MORE REAL-WORLD ENTRIES

[Paste additional journal entries here.]
`
];

function openJournal() {
  state.paused = true;
  const box = document.getElementById("journal-content");
  box.innerHTML = journalEntries.map(e => `<div class="journal-entry"></div>`).join("");
  [...box.children].forEach((el,i)=>el.textContent = journalEntries[i]);
  document.getElementById("journal").classList.remove("hidden");
}
document.getElementById("journal-close").addEventListener("click", () => {
  document.getElementById("journal").classList.add("hidden");
  state.paused = false;
  openLetter();
});

function openLetter() {
  state.paused = true;
  const text = document.getElementById("letter-text");
  text.innerHTML = `
    <p>Hey handsome man,</p>
    <p>If you're reading this, you made it all the way to the end.</p>
    <p>I wanted to make you something instead of just asking you normally. I wanted to turn all of these little moments into a game because somehow all of these ordinary days became some of my favorite memories.</p>
    <p>The Booyah roll call. The stupid whiteboard. Tate St. coffee. Phase 10 with Big Dawg. Pool. My birthday. All of it.</p>
    <p>Somewhere along the way, you became one of my favorite people to spend time with.</p>
    <p>So I have one last question for you.</p>
    <p><strong>Will you be my boyfriend?</strong></p>
  `;
  document.getElementById("letter").classList.remove("hidden");
}
document.getElementById("letter-next").addEventListener("click", () => {
  document.getElementById("letter").classList.add("hidden");
  document.getElementById("choice").classList.remove("hidden");
});

function finish(choice) {
  document.getElementById("choice").classList.add("hidden");
  const title = document.getElementById("ending-title");
  const text = document.getElementById("ending-text");
  if (choice === "yes") {
    title.textContent = "QUEST COMPLETE ❤️";
    text.textContent = "Boyfriend Status: UNLOCKED. Maddie has joined your party. NEW GAME+ — The adventure continues...";
  } else {
    title.textContent = "ENDING: WAIT, WHAT?";
    text.textContent = "Your character stares at the screen. \"...Oh.\" Then the game asks one more time: Are you sure?";
  }
  document.getElementById("ending").classList.remove("hidden");
}
document.getElementById("yes").addEventListener("click", () => finish("yes"));
document.getElementById("no").addEventListener("click", () => finish("no"));
document.getElementById("restart").addEventListener("click", () => location.reload());

function triggerCurrentLevel() {
  if (state.level === 0) {
    showDialogue(dialogues.prologue, () => { memory(); setLevel(1); });
  } else if (state.level === 1) {
    showDialogue(dialogues.whiteboard, () => { memory(); setLevel(2); });
  } else if (state.level === 2) {
    openPhone();
  }
}

window.addEventListener("keydown", (e) => {
  if (["ArrowUp","ArrowDown","ArrowLeft","ArrowRight","w","a","s","d","e","E"].includes(e.key)) e.preventDefault();
  state.keys[e.key.toLowerCase()] = true;
  if (e.key.toLowerCase() === "e" && !state.paused) triggerCurrentLevel();
});
window.addEventListener("keyup", (e) => state.keys[e.key.toLowerCase()] = false);

function update() {
  if (!state.paused && state.level <= 2) {
    const speed = 3;
    if (state.keys["arrowup"] || state.keys["w"]) state.player.y -= speed;
    if (state.keys["arrowdown"] || state.keys["s"]) state.player.y += speed;
    if (state.keys["arrowleft"] || state.keys["a"]) state.player.x -= speed;
    if (state.keys["arrowright"] || state.keys["d"]) state.player.x += speed;
    state.player.x = Math.max(120, Math.min(840, state.player.x));
    state.player.y = Math.max(120, Math.min(430, state.player.y));
  }
}

function loop() {
  update();
  drawScene();
  requestAnimationFrame(loop);
}

setLevel(0);
loop();
