window.onload = function() {
    document.addEventListener('keydown', changeDirection);
    setInterval(gameLoop, 1000/60);
}

function setupCanvas(canvas) {
    // Get the device pixel ratio, falling back to 1.
    var dpr = window.devicePixelRatio || 1;
    // Get the size of the canvas in CSS pixels.
    var rect = canvas.getBoundingClientRect();
    // Give the canvas pixel dimensions of their CSS
    // size * the device pixel ratio.
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    var ctx = canvas.getContext('2d');
    // Scale all drawing operations by the dpr, so you
    // don't have to worry about the difference.
    ctx.scale(dpr, dpr);
    return ctx;
  }

var canv = document.getElementById('screan'),
    ctx = setupCanvas(canv),
    gs = fkp = false,
    speed = baseSpead = 3,
    xv = yv = 0,
    // px = py = 0,
    px = 1280 / 2,
    py = 800 / 2,
    pw = ph = 20,
    aw = ah = 20,
    apples = [],
    trail = [],
    tail = 100,
    tailSafeZone = 20,
    cooldown = false,
    score = 0;

function gameLoop() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, 1280, 800);

    px += xv;
    py += yv;

    if (px > 1280) {
        px = 0;
    }

    if (px + pw < 0) {
        px = 1280;
    }

    if (py + ph < 0) {
        py = 800;
    }

    if (py > 800) {
        py = 0;
    }

    ctx.fillStyle = 'lime';
    
    for (var i = 0; i < trail.length; i++) {
        ctx.fillStyle = trail[i].color || 'lime';
        ctx.fillRect(trail[i].x, trail[i].y, pw, ph);
    }

    trail.push({
        x: px,
        y: py,
        color: ctx.fillStyle
    });

    if (trail.length > tail) {
        trail.shift();
    }

    if (trail.length > tail) {
        trail.shift();
    }

    if (trail.length >= tail && gs) {
        for (var i = trail.length - tailSafeZone; i >=0; i--) {
            if (
                px < (trail[i].x + pw) &&
                px + pw > trail[i].x &&
                py < (trail[i].y + ph) &&
                py + ph > trail[i].y
            ) {
                tail = 10;
                speed = baseSpead;

                for (var t = 0; t < trail.length; t++) {
                    trail[t].color = 'red';

                    if (t >= trail.length - tail) {
                        break;
                    }
                }
            }
        }
    }

    // paint apples
  for( var a = 0; a < apples.length; a++ )
  {
    ctx.fillStyle = apples[a].color;
    ctx.fillRect(apples[a].x, apples[a].y, aw, ah);
  }

  // check for snake head collisions with apples
  for( var a = 0; a < apples.length; a++ )
  {
    if(
      px < (apples[a].x + pw)
      && px + pw > apples[a].x
      && py < (apples[a].y + ph)
      && py + ph > apples[a].y
    )
    {
      // got collision with apple
      apples.splice(a, 1); // remove this apple from the apples list
      tail += 10; // add tail length
      speed += .1; // add some speed
      spawnApple(); // spawn another apple(-s)
      break;
    }
  }
}

 // apples spawner
function spawnApple()
{
  var
    newApple = {
      x: ~~(Math.random() * 12080),
      y: ~~(Math.random() * 800),
      color: 'red'
    };

  // forbid to spawn near the edges
  if(
    (newApple.x < aw || newApple.x > 1280 - aw)
    ||
    (newApple.y < ah || newApple.y > 800 - ah)
  )
  {
    spawnApple();
    return;
  }

  // check for collisions with tail element, so no apple will be spawned in it
  for( var i = 0; i < tail.length; i++ )
  {
    if(
      newApple.x < (trail[i].x + pw)
      && newApple.x + aw > trail[i].x
      && newApple.y < (trail[i].y + ph)
      && newApple.y + ah > trail[i].y
    )
    {
      // got collision
      spawnApple();
      return;
    }
  }

  apples.push(newApple);

  if( apples.length < 3 && ~~(Math.random() * 1000) > 700 )
  {
    // 30% chance to spawn one more apple
    spawnApple();
  }
}

function randomColor() {
    return '#' + ((~~(Math.random() * 255)).toString(16)) +
            ((~~(Math.random() * 255)).toString(16)) +
            ((~~(Math.random() * 255)).toString(16));
}

function changeDirection(evt) {

    if (!fkp && [37, 38, 39, 40].indexOf(evt.keyCode) > -1) {
        setTimeout(function() {gs = true;}, 1000);
        fkp = true;
        spawnApple();
    }


    if (cooldown) {
        return false;
    }

    if (evt.keyCode == 37 && !(xv > 0)) {
        xv = -speed;
        yv = 0;
    }

    if (evt.keyCode == 38 && !(yv > 0)) {
        xv = 0;
        yv = -speed;
    }

    if (evt.keyCode == 39 && !(xv < 0)) {
        xv = speed;
        yv = 0;
    }

    if (evt.keyCode == 40 && !(yv < 0)) {
        xv = 0;
        yv = speed;
    }

    cooldown = true;
    setTimeout(function(){ cooldown = false; }, 100);
}

