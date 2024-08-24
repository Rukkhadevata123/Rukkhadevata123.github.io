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
  function t() {
    i(), a();
  }
  function i() {
    document.addEventListener("mousemove", o),
      document.addEventListener("touchmove", e),
      document.addEventListener("touchstart", e),
      window.addEventListener("resize", n);
  }
  function n(t) {
    (d = window.innerWidth), window.innerHeight;
  }
  function e(t) {
    if (t.touches.length > 0)
      for (var i = 0; i < t.touches.length; i++)
        s(
          t.touches[i].clientX,
          t.touches[i].clientY,
          r[Math.floor(Math.random() * r.length)]
        );
  }
  function o(t) {
    (u.x = t.clientX),
      (u.y = t.clientY),
      s(u.x, u.y, r[Math.floor(Math.random() * r.length)]);
  }
  function s(t, i, n) {
    var e = new l();
    e.init(t, i, n), f.push(e);
  }
  function h() {
    for (var t = 0; t < f.length; t++) f[t].update();
    for (t = f.length - 1; t >= 0; t--)
      f[t].lifeSpan < 0 && (f[t].die(), f.splice(t, 1));
  }
  function a() {
    requestAnimationFrame(a), h();
  }
  function l() {
    (this.character = "*"),
      (this.lifeSpan = 120),
      (this.initialStyles = {
        position: "fixed",
        top: "0",
        display: "block",
        pointerEvents: "none",
        "z-index": "10000000",
        fontSize: "20px",
        "will-change": "transform",
      }),
      (this.init = function (t, i, n) {
        (this.velocity = {
          x: (Math.random() < 0.5 ? -1 : 1) * (Math.random() / 2),
          y: 1,
        }),
          (this.position = { x: t - 10, y: i - 20 }),
          (this.initialStyles.color = n),
          (this.element = document.createElement("span")),
          (this.element.innerHTML = this.character),
          c(this.element, this.initialStyles),
          this.update(),
          document.body.appendChild(this.element);
      }),
      (this.update = function () {
        (this.position.x += this.velocity.x),
          (this.position.y += this.velocity.y),
          this.lifeSpan--,
          (this.element.style.transform =
            "translate3d(" +
            this.position.x +
            "px," +
            this.position.y +
            "px,0) scale(" +
            this.lifeSpan / 120 +
            ")");
      }),
      (this.die = function () {
        this.element.parentNode.removeChild(this.element);
      });
  }
  function c(t, i) {
    for (var n in i) t.style[n] = i[n];
  }
  var r = ["#D61C59", "#E7D84B", "#1B8798", "#ffaaff", "#aaaaff"],
    d = window.innerWidth,
    u = (window.innerHeight, { x: d / 2, y: d / 2 }),
    f = [];
  t();
})();

function clickEffect() {
  let balls = [];
  let longPressed = false;
  let longPress;
  let multiplier = 0;
  let width, height;
  let origin;
  let normal;
  let ctx;
  const colours = ["#F73859", "#14FFEC", "#00E0FF", "#FF99FE", "#FAF15D"];
  const canvas = document.createElement("canvas");
  document.body.appendChild(canvas);
  canvas.setAttribute(
    "style",
    "width: 100%; height: 100%; top: 0; left: 0; z-index: 99999; position: fixed; pointer-events: none;"
  );
  const pointer = document.createElement("span");
  pointer.classList.add("pointer");
  document.body.appendChild(pointer);

  if (canvas.getContext && window.addEventListener) {
    ctx = canvas.getContext("2d");
    updateSize();
    window.addEventListener("resize", updateSize, false);
    loop();
    window.addEventListener(
      "mousedown",
      function (e) {
        pushBalls(randBetween(10, 20), e.clientX, e.clientY);
        document.body.classList.add("is-pressed");
        longPress = setTimeout(function () {
          document.body.classList.add("is-longpress");
          longPressed = true;
        }, 500);
      },
      false
    );
    window.addEventListener(
      "mouseup",
      function (e) {
        clearInterval(longPress);
        if (longPressed == true) {
          document.body.classList.remove("is-longpress");
          pushBalls(
            randBetween(
              50 + Math.ceil(multiplier),
              100 + Math.ceil(multiplier)
            ),
            e.clientX,
            e.clientY
          );
          longPressed = false;
        }
        document.body.classList.remove("is-pressed");
      },
      false
    );
    window.addEventListener(
      "mousemove",
      function (e) {
        let x = e.clientX;
        let y = e.clientY;
        pointer.style.top = y + "px";
        pointer.style.left = x + "px";
      },
      false
    );
  } else {
    console.log("canvas or addEventListener is unsupported!");
  }

  function updateSize() {
    canvas.width = window.innerWidth * 2;
    canvas.height = window.innerHeight * 2;
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
    ctx.scale(2, 2);
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    origin = {
      x: width / 2,
      y: height / 2,
    };
    normal = {
      x: width / 2,
      y: height / 2,
    };
  }
  class Ball {
    constructor(x = origin.x, y = origin.y) {
      this.x = x;
      this.y = y;
      this.angle = Math.PI * 2 * Math.random();
      if (longPressed == true) {
        this.multiplier = randBetween(14 + multiplier, 15 + multiplier);
      } else {
        this.multiplier = randBetween(6, 12);
      }
      this.vx = (this.multiplier + Math.random() * 0.5) * Math.cos(this.angle);
      this.vy = (this.multiplier + Math.random() * 0.5) * Math.sin(this.angle);
      this.r = randBetween(8, 12) + 3 * Math.random();
      this.color = colours[Math.floor(Math.random() * colours.length)];
    }
    update() {
      this.x += this.vx - normal.x;
      this.y += this.vy - normal.y;
      normal.x = (-2 / window.innerWidth) * Math.sin(this.angle);
      normal.y = (-2 / window.innerHeight) * Math.cos(this.angle);
      this.r -= 0.3;
      this.vx *= 0.9;
      this.vy *= 0.9;
    }
  }

  function pushBalls(count = 1, x = origin.x, y = origin.y) {
    for (let i = 0; i < count; i++) {
      balls.push(new Ball(x, y));
    }
  }

  function randBetween(min, max) {
    return Math.floor(Math.random() * max) + min;
  }

  function loop() {
    ctx.fillStyle = "rgba(255, 255, 255, 0)";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < balls.length; i++) {
      let b = balls[i];
      if (b.r < 0) continue;
      ctx.fillStyle = b.color;
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2, false);
      ctx.fill();
      b.update();
    }
    if (longPressed == true) {
      multiplier += 0.2;
    } else if (!longPressed && multiplier >= 0) {
      multiplier -= 0.4;
    }
    removeBall();
    requestAnimationFrame(loop);
  }

  function removeBall() {
    for (let i = 0; i < balls.length; i++) {
      let b = balls[i];
      if (
        b.x + b.r < 0 ||
        b.x - b.r > width ||
        b.y + b.r < 0 ||
        b.y - b.r > height ||
        b.r < 0
      ) {
        balls.splice(i, 1);
      }
    }
  }
}
clickEffect();

/* 控制下雪 */
function snowFall(snow) {
  /* 可配置属性 */
  snow = snow || {};
  this.maxFlake = snow.maxFlake || 200; /* 最多片数 */
  this.flakeSize = snow.flakeSize || 10; /* 雪花形状 */
  this.fallSpeed = snow.fallSpeed || 1; /* 坠落速度 */
}
/* 兼容写法 */
requestAnimationFrame =
  window.requestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.msRequestAnimationFrame ||
  window.oRequestAnimationFrame ||
  function (callback) {
    setTimeout(callback, 1000 / 60);
  };

cancelAnimationFrame =
  window.cancelAnimationFrame ||
  window.mozCancelAnimationFrame ||
  window.webkitCancelAnimationFrame ||
  window.msCancelAnimationFrame ||
  window.oCancelAnimationFrame;
/* 开始下雪 */
snowFall.prototype.start = function () {
  /* 创建画布 */
  snowCanvas.apply(this);
  /* 创建雪花形状 */
  createFlakes.apply(this);
  /* 画雪 */
  drawSnow.apply(this);
};
/* 创建画布 */
function snowCanvas() {
  /* 添加Dom结点 */
  var snowcanvas = document.createElement("canvas");
  snowcanvas.id = "snowfall";
  snowcanvas.width = window.innerWidth;
  snowcanvas.height = document.body.clientHeight;
  snowcanvas.setAttribute(
    "style",
    "position:absolute; top: 0; left: 0; z-index: 1; pointer-events: none;"
  );
  document.getElementsByTagName("body")[0].appendChild(snowcanvas);
  this.canvas = snowcanvas;
  this.ctx = snowcanvas.getContext("2d");
  /* 窗口大小改变的处理 */
  window.onresize = function () {
    snowcanvas.width = window.innerWidth;
    /* snowcanvas.height = window.innerHeight */
  };
}
/* 雪运动对象 */
function flakeMove(canvasWidth, canvasHeight, flakeSize, fallSpeed) {
  this.x = Math.floor(Math.random() * canvasWidth); /* x坐标 */
  this.y = Math.floor(Math.random() * canvasHeight); /* y坐标 */
  this.size = Math.random() * flakeSize + 2; /* 形状 */
  this.maxSize = flakeSize; /* 最大形状 */
  this.speed = Math.random() * 1 + fallSpeed; /* 坠落速度 */
  this.fallSpeed = fallSpeed; /* 坠落速度 */
  this.velY = this.speed; /* Y方向速度 */
  this.velX = 0; /* X方向速度 */
  this.stepSize = Math.random() / 30; /* 步长 */
  this.step = 0; /* 步数 */
}
flakeMove.prototype.update = function () {
  var x = this.x,
    y = this.y;
  /* 左右摆动(余弦) */
  this.velX *= 0.98;
  if (this.velY <= this.speed) {
    this.velY = this.speed;
  }
  this.velX += Math.cos((this.step += 0.05)) * this.stepSize;

  this.y += this.velY;
  this.x += this.velX;
  /* 飞出边界的处理 */
  if (
    this.x >= canvas.width ||
    this.x <= 0 ||
    this.y >= canvas.height ||
    this.y <= 0
  ) {
    this.reset(canvas.width, canvas.height);
  }
};
/* 飞出边界-放置最顶端继续坠落 */
flakeMove.prototype.reset = function (width, height) {
  this.x = Math.floor(Math.random() * width);
  this.y = 0;
  this.size = Math.random() * this.maxSize + 2;
  this.speed = Math.random() * 1 + this.fallSpeed;
  this.velY = this.speed;
  this.velX = 0;
};
// 渲染雪花-随机形状（此处可修改雪花颜色！！！）
flakeMove.prototype.render = function (ctx) {
  var snowFlake = ctx.createRadialGradient(
    this.x,
    this.y,
    0,
    this.x,
    this.y,
    this.size
  );
  snowFlake.addColorStop(
    0,
    "rgba(255, 255, 255, 0.9)"
  ); /* 此处是雪花颜色，默认是白色 */
  snowFlake.addColorStop(
    0.5,
    "rgba(255, 255, 255, 0.5)"
  ); /* 若要改为其他颜色，请自行查 */
  snowFlake.addColorStop(
    1,
    "rgba(255, 255, 255, 0)"
  ); /* 找16进制的RGB 颜色代码。 */
  ctx.save();
  ctx.fillStyle = snowFlake;
  ctx.beginPath();
  ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
};
/* 创建雪花-定义形状 */
function createFlakes() {
  var maxFlake = this.maxFlake,
    flakes = (this.flakes = []),
    canvas = this.canvas;
  for (var i = 0; i < maxFlake; i++) {
    flakes.push(
      new flakeMove(canvas.width, canvas.height, this.flakeSize, this.fallSpeed)
    );
  }
}
/* 画雪 */
function drawSnow() {
  var maxFlake = this.maxFlake,
    flakes = this.flakes;
  (ctx = this.ctx), (canvas = this.canvas), (that = this);
  /* 清空雪花 */
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (var e = 0; e < maxFlake; e++) {
    flakes[e].update();
    flakes[e].render(ctx);
  }
  /*  一帧一帧的画 */
  this.loop = requestAnimationFrame(function () {
    drawSnow.apply(that);
  });
}
/* 调用及控制方法 */
var snow = new snowFall({ maxFlake: 60 });
snow.start();
