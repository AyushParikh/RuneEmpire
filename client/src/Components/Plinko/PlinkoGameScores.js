import Matter from "matter-js";
import makeScore from "./PlinkoGameScoresFunction";
import makeBuckets from "./PlinkoGameScoresBuckets";

//TODO SHORTEN THIS FILE ITS MASSIVE

let HOUSE_EDGE = 0.98; //100 - house edge percentage

var World = Matter.World,
  Bodies = Matter.Bodies;

var finalScores = [];

export function getScores() {
  return finalScores;
}

export default function createScores(pegRows, engine, risk, houseEdge) {
  HOUSE_EDGE = houseEdge;

  //score tiles from left to right of board
  var scores = [];

  var yOffset;
  var canvasWidth;
  var canvasHeight;
  var fontSize;
  var width;
  var xOffSets;

  var scoreResults = makeScore(
    HOUSE_EDGE,
    pegRows,
    yOffset,
    canvasWidth,
    canvasHeight,
    fontSize,
    width,
    xOffSets,
    scores,
    risk
  );

  scores = scoreResults.scores;
  yOffset = scoreResults.yOffset;
  canvasHeight = scoreResults.canvasHeight;
  canvasWidth = scoreResults.canvasWidth;
  fontSize = scoreResults.fontSize;
  width = scoreResults.width;
  xOffSets = scoreResults.xOffSets;

  finalScores = scores;

  const scoreOptions = {
    friction: 10,
    restitution: -1,
    isStatic: true,
    label: "score",
    render: {
      fillStyle: "transparent",
    },
  };

  var buckets = makeBuckets(
    scoreOptions,
    scores,
    xOffSets,
    yOffset,
    width,
    pegRows
  );
  World.add(engine.world, buckets);
}

//TODO change colour of score tiles
function createImage(
  $string,
  canvasWidth,
  canvasHeight,
  width,
  height,
  fontSize /*, colour*/
) {
  let drawing = document.createElement("canvas");

  drawing.width = canvasWidth.toString();
  drawing.height = canvasHeight.toString();

  let ctx = drawing.getContext("2d");

  ctx.fillStyle = "#927e61";
  ctx.lineWidth = 5;
  ctx.strokeStyle = "white";
  ctx.stroke();
  roundRect(ctx, 5, 5, width, height);
  // ctx.beginPath();
  // ctx.arc(75, 75, 20, 0, Math.PI * 2, true);
  // ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#000";
  ctx.font = "bold " + fontSize + "pt sans-serif";
  ctx.textAlign = "center";
  ctx.fillText($string, width / 1.6, height / 1.1, width + 5);
  // ctx.strokeText("Canvas Rocks!", 5, 130);

  return drawing.toDataURL("image/png");
}

//TODO move to own file
/**
 * Draws a rounded rectangle using the current state of the canvas.
 * If you omit the last three params, it will draw a rectangle
 * outline with a 5 pixel border radius
 * @param {CanvasRenderingContext2D} ctx
 * @param {Number} x The top left x coordinate
 * @param {Number} y The top left y coordinate
 * @param {Number} width The width of the rectangle
 * @param {Number} height The height of the rectangle
 * @param {Number} [radius = 5] The corner radius; It can also be an object
 *                 to specify different radii for corners
 * @param {Number} [radius.tl = 0] Top left
 * @param {Number} [radius.tr = 0] Top right
 * @param {Number} [radius.br = 0] Bottom right
 * @param {Number} [radius.bl = 0] Bottom left
 * @param {Boolean} [fill = false] Whether to fill the rectangle.
 * @param {Boolean} [stroke = true] Whether to stroke the rectangle.
 */
function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
  if (typeof stroke === "undefined") {
    stroke = true;
  }
  if (typeof radius === "undefined") {
    radius = 5;
  }
  if (typeof radius === "number") {
    radius = { tl: radius, tr: radius, br: radius, bl: radius };
  } else {
    var defaultRadius = { tl: 0, tr: 0, br: 0, bl: 0 };
    for (var side in defaultRadius) {
      radius[side] = radius[side] || defaultRadius[side];
    }
  }
  ctx.beginPath();
  ctx.moveTo(x + radius.tl, y);
  ctx.lineTo(x + width - radius.tr, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
  ctx.lineTo(x + width, y + height - radius.br);
  ctx.quadraticCurveTo(
    x + width,
    y + height,
    x + width - radius.br,
    y + height
  );
  ctx.lineTo(x + radius.bl, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
  ctx.lineTo(x, y + radius.tl);
  ctx.quadraticCurveTo(x, y, x + radius.tl, y);
  //ctx.closePath();
  if (fill) {
    ctx.fill();
  }
  if (stroke) {
    ctx.stroke();
  }
}
