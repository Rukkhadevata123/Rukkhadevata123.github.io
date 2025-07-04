// 趣味标题
var OriginTitle = document.title;
var titleTime;
document.addEventListener("visibilitychange", function () {
  if (document.hidden) {
    $('[rel="icon"]').attr("href", "/funny.ico");
    document.title = "╭(°A°`)╮ 页面崩溃啦 ~";
    clearTimeout(titleTime);
  } else {
    $('[rel="icon"]').attr("href", "/img/newtubiao.png");
    document.title = "(ฅ>ω<*ฅ) 噫又好啦 ~" + OriginTitle;
    titleTime = setTimeout(function () {
      document.title = OriginTitle;
    }, 2000);
  }
});

// 鼠标移动星星特效
(function () {
  const colors = ["#D61C59", "#E7D84B", "#1B8798", "#ffaaff", "#aaaaff"];
  const particles = [];
  let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

  function createParticle(x, y, color) {
    const particle = {
      x: x - 10,
      y: y - 20,
      vx: (Math.random() < 0.5 ? -1 : 1) * (Math.random() / 2),
      vy: 1,
      life: 120,
      maxLife: 120,
      color: color,
      element: document.createElement("span")
    };

    particle.element.innerHTML = "*";
    Object.assign(particle.element.style, {
      position: "fixed",
      top: "0",
      display: "block",
      pointerEvents: "none",
      zIndex: "10000000",
      fontSize: "20px",
      color: color,
      willChange: "transform"
    });

    document.body.appendChild(particle.element);
    particles.push(particle);
  }

  function updateParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life--;

      p.element.style.transform = `translate3d(${p.x}px, ${p.y}px, 0) scale(${p.life / p.maxLife})`;

      if (p.life <= 0) {
        p.element.remove();
        particles.splice(i, 1);
      }
    }
    requestAnimationFrame(updateParticles);
  }

  document.addEventListener("mousemove", function(e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    createParticle(mouse.x, mouse.y, colors[Math.floor(Math.random() * colors.length)]);
  });

  document.addEventListener("touchmove", function(e) {
    if (e.touches.length > 0) {
      for (let i = 0; i < e.touches.length; i++) {
        createParticle(
          e.touches[i].clientX,
          e.touches[i].clientY,
          colors[Math.floor(Math.random() * colors.length)]
        );
      }
    }
  });

  updateParticles();
})();

// 点击爆炸特效
function clickEffect() {
  const colors = ["#F73859", "#14FFEC", "#00E0FF", "#FF99FE", "#FAF15D"];
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  let balls = [];
  let longPressed = false;
  let longPress;
  let multiplier = 0;

  // 设置画布
  Object.assign(canvas.style, {
    width: "100%",
    height: "100%",
    top: "0",
    left: "0",
    zIndex: "99999",
    position: "fixed",
    pointerEvents: "none"
  });
  document.body.appendChild(canvas);

  function updateSize() {
    canvas.width = window.innerWidth * 2;
    canvas.height = window.innerHeight * 2;
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
    ctx.scale(2, 2);
  }

  class Ball {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.angle = Math.PI * 2 * Math.random();
      this.multiplier = longPressed ? randBetween(14 + multiplier, 15 + multiplier) : randBetween(6, 12);
      this.vx = (this.multiplier + Math.random() * 0.5) * Math.cos(this.angle);
      this.vy = (this.multiplier + Math.random() * 0.5) * Math.sin(this.angle);
      this.r = randBetween(8, 12) + 3 * Math.random();
      this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.r -= 0.3;
      this.vx *= 0.9;
      this.vy *= 0.9;
    }
  }

  function randBetween(min, max) {
    return Math.floor(Math.random() * max) + min;
  }

  function pushBalls(count, x, y) {
    for (let i = 0; i < count; i++) {
      balls.push(new Ball(x, y));
    }
  }

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = balls.length - 1; i >= 0; i--) {
      const b = balls[i];
      if (b.r <= 0 || b.x + b.r < 0 || b.x - b.r > window.innerWidth || 
          b.y + b.r < 0 || b.y - b.r > window.innerHeight) {
        balls.splice(i, 1);
        continue;
      }
      
      ctx.fillStyle = b.color;
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      ctx.fill();
      b.update();
    }

    if (longPressed) {
      multiplier += 0.2;
    } else if (multiplier >= 0) {
      multiplier -= 0.4;
    }

    requestAnimationFrame(loop);
  }

  // 事件监听
  window.addEventListener("mousedown", function(e) {
    pushBalls(randBetween(10, 20), e.clientX, e.clientY);
    longPress = setTimeout(() => { longPressed = true; }, 500);
  });

  window.addEventListener("mouseup", function(e) {
    clearTimeout(longPress);
    if (longPressed) {
      pushBalls(randBetween(50 + Math.ceil(multiplier), 100 + Math.ceil(multiplier)), e.clientX, e.clientY);
      longPressed = false;
    }
  });

  window.addEventListener("resize", updateSize);
  
  updateSize();
  loop();
}

clickEffect();