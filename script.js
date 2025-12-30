let mode = "off";
let particles = [];
let fireworkTimer = null;

const canvas = document.getElementById("fireworks");
const ctx = canvas.getContext("2d");

function resize(){
  canvas.width = innerWidth;
  canvas.height = innerHeight;
}
window.addEventListener("resize", resize);
resize();

function showScreen(id){
  document.querySelectorAll(".screen").forEach(s=>{
    s.classList.remove("active");
    s.style.display = "none";
  });

  const target = document.getElementById(id);
  if (target){
    target.classList.add("active");
    target.style.display = "flex";
  }

  // mode canvas
  if(id === "second") mode = "fireworks";
  else if(id === "third"){
    mode = "sparkles";
    typeWriter(
      "mainMessage",
      "I hope this year gives you space to grow, time to heal, and courage to choose what feels right for you. May your days be filled with balance and moments that make everything feel worth it. Wishing you a year that feels steady, genuine, and quietly fulfilling.",
      45
    );
  } else if(id === "fourth") mode = "sparkles";
  else mode = "off";

  syncParticles();
}

function goToSecond(){
  const input = document.getElementById("nameInput");
  const name = input.value.trim();

  if(!name){
    alert("Isi namamu dulu ya!");
    return;
  }

  document.getElementById("displayName").innerText = name;
  document.getElementById("greetName").innerText = "To: " + name;
  showScreen("second");
}

function typeWriter(elementId, text, speed){
  let i = 0;
  const element = document.getElementById(elementId);
  element.innerHTML = "";

  (function type(){
    if(i < text.length){
      element.innerHTML += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  })();
}

function syncParticles(){
  if(fireworkTimer){
    clearInterval(fireworkTimer);
    fireworkTimer = null;
  }
  if(mode === "off") return;

  const interval = (mode === "fireworks") ? 350 : 150;

  fireworkTimer = setInterval(()=>{
    if(mode === "fireworks"){
      const x = Math.random() * canvas.width;
      const y = Math.random() * (canvas.height / 2);
      const colors = ["#ffffff", "#ffdf00", "#ffd700", "#fffaf0"];

      for(let i=0; i<70; i++){
        particles.push({
          x, y,
          vx: Math.random() * 8 - 4,
          vy: Math.random() * 8 - 4,
          alpha: 1,
          size: Math.random() * 2.5 + 1,
          color: colors[Math.floor(Math.random() * colors.length)],
          type: "flare"
        });
      }
    } else {
      particles.push({
        x: Math.random() * canvas.width,
        y: canvas.height + 10,
        vx: Math.random() * 1 - 0.5,
        vy: -(Math.random() * 1 + 0.5),
        alpha: 1,
        size: Math.random() * 3 + 1,
        color: "#ffd700",
        type: "float"
      });
    }
  }, interval);
}

function update(){
  ctx.clearRect(0,0,canvas.width,canvas.height);

  for(let i = particles.length - 1; i >= 0; i--){
    const p = particles[i];

    p.alpha -= (p.type === "flare") ? 0.012 : 0.005;
    p.x += p.vx;
    p.y += p.vy;
    if(p.type === "flare") p.vy += 0.06;

    const shimmer = p.size * (0.6 + Math.abs(Math.sin(Date.now() * 0.01)));

    ctx.globalAlpha = Math.max(p.alpha, 0);
    ctx.shadowBlur = 10;
    ctx.shadowColor = p.color;
    ctx.fillStyle = p.color;

    ctx.beginPath();
    ctx.arc(p.x, p.y, shimmer, 0, Math.PI * 2);
    ctx.fill();

    if(p.alpha <= 0) particles.splice(i, 1);
  }

  ctx.shadowBlur = 0;
  ctx.globalAlpha = 1;
  requestAnimationFrame(update);
}
update();
