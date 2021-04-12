import Matter from "matter-js";
import createScores from "./PlinkoGameScores";

var Engine = Matter.Engine,
  Render = Matter.Render,
  World = Matter.World,
  Bodies = Matter.Bodies;

var engine;
let render;
var currentPegs = 8;
var ballEndPos;

const gameWidth = 600;
const gameHeight = 450;
var pegSpacing;
var yOffset;
var xOffset;

var defaultCategory = 0x0001,
  pegCategory = 0x0002,
  //allows for multiple balls to not interfere with eachother
  ballCatagories = [
    0x0008,
    0x0010,
    0x0020,
    0x0040,
    0x0080,
    0x0100,
    0x0200,
    // 0x0400,
    // 0x0800,
    // 0x1000,
    // 0x2000,
    // 0x4000,
    // 0x8000,
    // 0x10000,
  ];

var currentBall = 0;

export var getBalls = () => {
  var balls = [];
  for (var i = 0; i < engine.world.bodies.length; i++) {
    if (engine.world.bodies[i].label.includes("ball")) {
      balls.push(engine.world.bodies[i]);
    }
  }
  return balls.length;
};

function createPath(pegRows, randomStart) {
  var randomValues = randomStart;

  var pathBodies = [];

  var posFromMiddle = 0;

  var wallLeftStartPos = [422, 422.5, 417, 415, 415, 415, 415, 412.5, 412.5];

  var wallRightStartPos = [388, 387.5, 393, 395, 395, 395, 395, 397.5, 397.5];

  var wallXOffset = [35, 30, 27.5, 25, 22.5, 20, 20, 17.5, 17.5];

  var correctionalYOffset = [25, 25, 25, 20, 18, 18, 18, 14, 12];

  var leftWall, rightWall;

  for (var j = 0; j < randomValues.length; j++) {
    //right
    if (randomValues[j] > 0.5) {
      leftWall = Bodies.rectangle(
        wallRightStartPos[pegRows - 8] +
          posFromMiddle * wallXOffset[pegRows - 8],
        j * pegSpacing + yOffset - correctionalYOffset[pegRows - 8],
        pegSpacing,
        1,
        {
          render: { fillStyle: "transparent" },
          friction: 0,
          restitution: 1000,
          isStatic: true,
          collisionFilter: {
            mask: ballCatagories[currentBall],
          },
          label: "path-" + ballCatagories[currentBall],
        }
      );
      Matter.Body.rotate(leftWall, 60 * (Math.PI / 180));
      rightWall = Bodies.rectangle(
        wallRightStartPos[pegRows - 8] +
          (posFromMiddle + 2) * wallXOffset[pegRows - 8],
        j * pegSpacing + yOffset - correctionalYOffset[pegRows - 8],
        pegSpacing,
        1,
        {
          render: { fillStyle: "transparent" },
          friction: 0,
          restitution: 1000,
          isStatic: true,
          collisionFilter: {
            mask: ballCatagories[currentBall],
          },
          label: "path-" + ballCatagories[currentBall],
        }
      );
      Matter.Body.rotate(rightWall, 60 * (Math.PI / 180));

      posFromMiddle++;
    }
    //left
    else {
      leftWall = Bodies.rectangle(
        wallLeftStartPos[pegRows - 8] +
          posFromMiddle * wallXOffset[pegRows - 8],
        j * pegSpacing + yOffset - correctionalYOffset[pegRows - 8],
        pegSpacing,
        1,
        {
          render: { fillStyle: "transparent" },
          friction: 0,
          restitution: 1000,
          isStatic: true,
          collisionFilter: {
            mask: ballCatagories[currentBall],
          },
          label: "path-" + ballCatagories[currentBall],
        }
      );
      Matter.Body.rotate(leftWall, -60 * (Math.PI / 180));
      rightWall = Bodies.rectangle(
        wallLeftStartPos[pegRows - 8] +
          (posFromMiddle - 2) * wallXOffset[pegRows - 8],
        j * pegSpacing + yOffset - correctionalYOffset[pegRows - 8],
        pegSpacing,
        1,
        {
          render: { fillStyle: "transparent" },
          friction: 0,
          restitution: 1000,
          isStatic: true,
          collisionFilter: {
            mask: ballCatagories[currentBall],
          },
          label: "path-" + ballCatagories[currentBall],
        }
      );
      Matter.Body.rotate(rightWall, -60 * (Math.PI / 180));

      posFromMiddle--;
    }
    pathBodies.push(leftWall);
    pathBodies.push(rightWall);
  }

  ballEndPos = posFromMiddle;

  World.add(engine.world, pathBodies);
}

export function Particle(
  x,
  y,
  r,
  pegRows,
  maxParticles,
  resetMaxParticles,
  fairPath
) {
  if (currentBall >= ballCatagories.length) {
    maxParticles();
    return;
  }

  createPath(pegRows, fairPath);
  currentPegs = pegRows;

  var restitution = 0;
  if (pegRows < 10) {
    restitution = 0.6;
  } else {
    restitution = 0.5;
  }

  var body = Bodies.circle(x, y, r, {
    restitution: restitution,
    friction: 0,
    render: {
      fillStyle: "red",
      strokeStyle: "blue",
    },
    label: "ball-" + ballCatagories[currentBall],
    collisionFilter: {
      category: ballCatagories[currentBall],
      mask: defaultCategory | pegCategory,
      group: -1,
    },
  });
  World.add(engine.world, body);
  currentBall++;

  var interval = setInterval(() => {
    var ball = [];

    for (var i = 0; i < engine.world.bodies.length; i++) {
      if (engine.world.bodies[i].label.includes("ball")) {
        ball.push(engine.world.bodies[i]);
      }
    }
    if (ball.length <= 0) {
      currentBall = 0;
      resetMaxParticles();
      clearInterval(interval);
    }
  }, 100);
}

function Peg(x, y, r) {
  var options = {
    friction: 0,
    isStatic: true,
    render: {
      fillStyle: "black",
      strokeStyle: "black",
    },
    collisionFilter: {
      category: pegCategory,
    },
    label: "peg",
  };
  var body = Bodies.circle(x, y, r, options);
  World.add(engine.world, body);
}

//TODO move to own file as too big, But atm this breaks the path makes so look into it more in future
function createPegs(pegRows, pegs) {
  var radius = 10;
  var xNudges;
  if (pegRows === 8) {
    radius = 10;
    pegSpacing = 70;
    yOffset = 50;
    xOffset = 200;
    xNudges = [135, 100, 65, 30, -5, -40, -75, -110];
  } else if (pegRows === 9) {
    radius = 9;
    pegSpacing = 60;
    yOffset = 60;
    xOffset = 210;
    xNudges = [135, 105, 75, 45, 15, -15, -45, -75, -105];
  } else if (pegRows === 10) {
    radius = 8;
    pegSpacing = 55;
    yOffset = 50;
    xOffset = 215;
    xNudges = [135, 107.5, 80, 52.5, 25, -2.5, -30, -57.5, -85, -112.5];
  } else if (pegRows === 11) {
    radius = 7;
    pegSpacing = 50;
    yOffset = 50;
    xOffset = 220;
    xNudges = [135, 110, 85, 60, 35, 10, -15, -40, -65, -90, -115];
  } else if (pegRows === 12) {
    radius = 6;
    pegSpacing = 45;
    yOffset = 50;
    xOffset = 225;
    xNudges = [
      135,
      112.5,
      90,
      67.5,
      45,
      22.5,
      0,
      -22.5,
      -45,
      -67.5,
      -90,
      -112.5,
    ];
  } else if (pegRows === 13) {
    radius = 5.5;
    pegSpacing = 40;
    yOffset = 65;
    xOffset = 230;
    xNudges = [135, 115, 95, 75, 55, 35, 15, -5, -25, -45, -65, -85, -105];
  } else if (pegRows === 14) {
    radius = 5.5;
    pegSpacing = 40;
    yOffset = 30;
    xOffset = 230;
    xNudges = [
      135,
      115,
      95,
      75,
      55,
      35,
      15,
      -5,
      -25,
      -45,
      -65,
      -85,
      -105,
      -125,
    ];
  } else if (pegRows === 15) {
    radius = 5.5;
    pegSpacing = 35;
    yOffset = 55;
    xOffset = 235;
    xNudges = [
      135,
      117.4,
      100,
      82.5,
      65,
      47.5,
      30,
      12.5,
      -5,
      -22.5,
      -40,
      -57.5,
      -75,
      -92.5,
      -110,
    ];
  } else if (pegRows === 16) {
    radius = 5;
    pegSpacing = 35;
    yOffset = 20;
    xOffset = 235;
    xNudges = [
      135,
      117.4,
      100,
      82.5,
      65,
      47.5,
      30,
      12.5,
      -5,
      -22.5,
      -40,
      -57.5,
      -75,
      -92.5,
      -110,
      -127.5,
    ];
  }

  if (pegs.pegs.length > 0) {
    for (var i = 0; i < pegRows; i++) {
      for (var j = 0; j < pegs.pegs[i].length; j++) {
        var y = yOffset + i * pegSpacing;
        var x = xOffset + j * pegSpacing;
        if (i === 0) {
          new Peg(x + xNudges[0], y, radius);
        } else if (i === 1) {
          new Peg(x + xNudges[1], y, radius);
        } else if (i === 2) {
          new Peg(x + xNudges[2], y, radius);
        } else if (i === 3) {
          new Peg(x + xNudges[3], y, radius);
        } else if (i === 4) {
          new Peg(x + xNudges[4], y, radius);
        } else if (i === 5) {
          new Peg(x + xNudges[5], y, radius);
        } else if (i === 6) {
          new Peg(x + xNudges[6], y, radius);
        } else if (i === 7) {
          new Peg(x + xNudges[7], y, radius);
        } else if (i === 8) {
          new Peg(x + xNudges[8], y, radius);
        } else if (i === 9) {
          new Peg(x + xNudges[9], y, radius);
        } else if (i === 10) {
          new Peg(x + xNudges[10], y, radius);
        } else if (i === 11) {
          new Peg(x + xNudges[11], y, radius);
        } else if (i === 12) {
          new Peg(x + xNudges[12], y, radius);
        } else if (i === 13) {
          new Peg(x + xNudges[13], y, radius);
        } else if (i === 14) {
          new Peg(x + xNudges[14], y, radius);
        } else if (i === 15) {
          new Peg(x + xNudges[15], y, radius);
        }
      }
    }
  }
}

export function remakePegs(pegRows, pegs, risk, houseEdge) {
  if (engine.world.bodies.length > 0) {
    engine.world.bodies = [];
  }

  var gravity = 1;
  var timeScale = 1;
  if (pegRows < 10) {
    gravity = 0.8;
    timeScale = 1;
  } else {
    gravity = 0.7;
    timeScale = 0.8;
  }
  engine.world.gravity.y = gravity;
  engine.timing.timeScale = timeScale;

  createPegs(pegRows, pegs);
  createScores(pegRows, engine, risk, houseEdge);
}

const Game = (returnScore, risk, houseEdge, pegRows) => {
  // create a renderer

  engine = Engine.create();

  render = Render.create({
    element: document.getElementsByClassName("plinko-game")[0],
    engine: engine,
    options: {
      wireframes: false,
      background: "var(--dark-background)",
    },
  });

  render.canvas.style =
    "width: " + gameWidth + "px; height: " + gameHeight + "px;";
  render.canvas.id = "game";

  var gravity = 1;
  var timeScale = 1;
  if (pegRows < 10) {
    gravity = 1.2;
    timeScale = 1;
  } else {
    gravity = 1.0;
    timeScale = 0.4;
  }
  engine.world.gravity.y = gravity;
  engine.timing.timeScale = timeScale;

  //always start with 8 rows
  createScores(pegRows, engine, risk, houseEdge);

  //TODO move to backend as slowing client down
  Matter.Events.on(engine, "collisionStart", function (event) {
    var pathToRemove;
    var path;
    var ball;
    var score;

    var pairs = event.pairs;

    if (
      pairs[0].bodyA.label.includes("score") &&
      pairs[0].bodyB.label.includes("ball")
    ) {
      pathToRemove = pairs[0].bodyB.label.split("-")[1];
      path = [];
      for (var i = 0; i < engine.world.bodies.length; i++) {
        if (engine.world.bodies[i].label === "path-" + pathToRemove) {
          path.push(engine.world.bodies[i]);
        }
      }
      Matter.Composite.remove(engine.world, path);
      Matter.Composite.remove(engine.world, pairs[0].bodyB);

      score = pairs[0].bodyA.label.split("-")[1];
      score = score.substring(0, score.length - 1);
      returnScore(parseFloat(score), ballEndPos);
    }

    var pairs = event.pairs;
    var shadowSizes = [20, 18, 16, 14, 12, 10, 10, 10, 10];
    var pegShadow = null;
    if (
      pairs[0].bodyA.label.includes("peg") &&
      pairs[0].bodyB.label.includes("ball")
    ) {
      var peg = pairs[0].bodyA;
      pegShadow = Bodies.circle(
        peg.position.x,
        peg.position.y,
        shadowSizes[currentPegs - 8],
        {
          render: { fillStyle: "black", opacity: 0.4 },
          isStatic: true,
          isSensor: false,
          collisionFilter: { group: -1 },
        }
      );
      World.add(engine.world, pegShadow);

      setTimeout(() => {
        Matter.Composite.remove(engine.world, pegShadow);
      }, 150);
    } else if (
      pairs[0].bodyA.label.includes("path") &&
      pairs[0].bodyB.label.includes("ball")
    ) {
      var pegs = [];
      for (var i = 0; i < engine.world.bodies.length; i++) {
        if (engine.world.bodies[i].label.includes("peg")) {
          pegs.push(engine.world.bodies[i]);
        }
      }
      var x = pairs[0].bodyB.position.x,
        y = pairs[0].bodyB.position.y;
      var currentDistance = Infinity;
      var finalPeg;
      for (var j = 0; j < pegs.length; j++) {
        var yLine = y - pegs[j].position.y;
        var xLine = x - pegs[j].position.x;
        var newDistance = Math.sqrt(yLine * yLine + xLine * xLine);
        if (newDistance < currentDistance) {
          currentDistance = newDistance;
          finalPeg = pegs[j];
        }
      }

      pegShadow = Bodies.circle(
        finalPeg.position.x,
        finalPeg.position.y,
        shadowSizes[currentPegs - 8],
        {
          render: { fillStyle: "black", opacity: 0.4 },
          isStatic: true,
          isSensor: false,
          collisionFilter: { group: -1 },
        }
      );
      World.add(engine.world, pegShadow);

      setTimeout(() => {
        Matter.Composite.remove(engine.world, pegShadow);
      }, 150);
    }
  });
};

export function run(pegRows, pegs, risk, returnScore, houseEdge) {
  Game(returnScore, risk, houseEdge, pegRows);

  createPegs(pegRows, pegs);

  Engine.run(engine);

  Render.run(render);
}
