export default function makeScores(
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
) {
  if (pegRows === 8) {
    yOffset = 590;
    canvasWidth = 90;
    canvasHeight = 50;
    fontSize = 15;
    width = 60;
    xOffSets = [125, 195, 265, 335, 407.5, 475, 545, 615, 685];
    if (risk === "high") {
      scores = [
        (30 * HOUSE_EDGE).toPrecision(2),
        (4.5 * HOUSE_EDGE).toPrecision(2),
        (2 * HOUSE_EDGE).toPrecision(2),
        (0.3 * HOUSE_EDGE).toPrecision(1),
        (0.2 * HOUSE_EDGE).toPrecision(1),
        (0.3 * HOUSE_EDGE).toPrecision(1),
        (2 * HOUSE_EDGE).toPrecision(2),
        (4.5 * HOUSE_EDGE).toPrecision(2),
        (30 * HOUSE_EDGE).toPrecision(2),
      ];
    } else if (risk === "medium") {
      scores = [
        (13.5 * HOUSE_EDGE).toPrecision(2),
        (3 * HOUSE_EDGE).toPrecision(2),
        (1.3 * HOUSE_EDGE).toPrecision(2),
        (0.7 * HOUSE_EDGE).toPrecision(1),
        (0.2 * HOUSE_EDGE).toPrecision(1),
        (0.7 * HOUSE_EDGE).toPrecision(1),
        (1.3 * HOUSE_EDGE).toPrecision(2),
        (3 * HOUSE_EDGE).toPrecision(2),
        (13.5 * HOUSE_EDGE).toPrecision(2),
      ];
    } else {
      scores = [
        (5.7 * HOUSE_EDGE).toPrecision(2),
        (2.1 * HOUSE_EDGE).toPrecision(2),
        (1.1 * HOUSE_EDGE).toPrecision(2),
        (1 * HOUSE_EDGE).toPrecision(1),
        (0.5 * HOUSE_EDGE).toPrecision(1),
        (1 * HOUSE_EDGE).toPrecision(1),
        (1.1 * HOUSE_EDGE).toPrecision(2),
        (2.1 * HOUSE_EDGE).toPrecision(2),
        (5.7 * HOUSE_EDGE).toPrecision(2),
      ];
    }
  } else if (pegRows === 9) {
    yOffset = 590;
    canvasWidth = 70;
    canvasHeight = 50;
    fontSize = 15;
    width = 55;
    xOffSets = [130, 192.5, 255, 317.5, 380, 440, 500, 560, 620, 680];
    if (risk === "high") {
      scores = [
        (43.5 * HOUSE_EDGE).toPrecision(2),
        (7 * HOUSE_EDGE).toPrecision(2),
        (2 * HOUSE_EDGE).toPrecision(2),
        (0.6 * HOUSE_EDGE).toPrecision(1),
        (0.2 * HOUSE_EDGE).toPrecision(1),
        (0.2 * HOUSE_EDGE).toPrecision(1),
        (0.6 * HOUSE_EDGE).toPrecision(2),
        (2 * HOUSE_EDGE).toPrecision(2),
        (7 * HOUSE_EDGE).toPrecision(2),
        (43.5 * HOUSE_EDGE).toPrecision(2),
      ];
    } else if (risk === "medium") {
      scores = [
        (18 * HOUSE_EDGE).toPrecision(2),
        (4 * HOUSE_EDGE).toPrecision(2),
        (1.7 * HOUSE_EDGE).toPrecision(2),
        (0.9 * HOUSE_EDGE).toPrecision(1),
        (0.5 * HOUSE_EDGE).toPrecision(1),
        (0.5 * HOUSE_EDGE).toPrecision(1),
        (0.9 * HOUSE_EDGE).toPrecision(2),
        (1.7 * HOUSE_EDGE).toPrecision(2),
        (4 * HOUSE_EDGE).toPrecision(2),
        (18 * HOUSE_EDGE).toPrecision(2),
      ];
    } else {
      scores = [
        (18 * HOUSE_EDGE).toPrecision(2),
        (4 * HOUSE_EDGE).toPrecision(2),
        (1.7 * HOUSE_EDGE).toPrecision(2),
        (0.9 * HOUSE_EDGE).toPrecision(2),
        (0.5 * HOUSE_EDGE).toPrecision(1),
        (0.5 * HOUSE_EDGE).toPrecision(1),
        (0.9 * HOUSE_EDGE).toPrecision(2),
        (1.7 * HOUSE_EDGE).toPrecision(2),
        (4 * HOUSE_EDGE).toPrecision(2),
        (18 * HOUSE_EDGE).toPrecision(2),
      ];
    }
  } else if (pegRows === 10) {
    yOffset = 590;
    canvasWidth = 70;
    canvasHeight = 50;
    fontSize = 14.5;
    width = 50;
    xOffSets = [130, 185, 240, 295, 350, 405, 460, 515, 570, 625, 680];
    if (risk === "high") {
      scores = [
        (78 * HOUSE_EDGE).toPrecision(2),
        (10 * HOUSE_EDGE).toPrecision(2),
        (3 * HOUSE_EDGE).toPrecision(2),
        (0.9 * HOUSE_EDGE).toPrecision(1),
        (0.3 * HOUSE_EDGE).toPrecision(1),
        (0.2 * HOUSE_EDGE).toPrecision(1),
        (0.3 * HOUSE_EDGE).toPrecision(1),
        (0.9 * HOUSE_EDGE).toPrecision(1),
        (3 * HOUSE_EDGE).toPrecision(2),
        (10 * HOUSE_EDGE).toPrecision(2),
        (78 * HOUSE_EDGE).toPrecision(2),
      ];
    } else if (risk === "medium") {
      scores = [
        (22 * HOUSE_EDGE).toPrecision(2),
        (5 * HOUSE_EDGE).toPrecision(2),
        (2 * HOUSE_EDGE).toPrecision(2),
        (1.4 * HOUSE_EDGE).toPrecision(2),
        (0.6 * HOUSE_EDGE).toPrecision(1),
        (0.4 * HOUSE_EDGE).toPrecision(1),
        (0.6 * HOUSE_EDGE).toPrecision(1),
        (1.4 * HOUSE_EDGE).toPrecision(2),
        (2 * HOUSE_EDGE).toPrecision(2),
        (5 * HOUSE_EDGE).toPrecision(2),
        (22 * HOUSE_EDGE).toPrecision(2),
      ];
    } else {
      scores = [
        (9 * HOUSE_EDGE).toPrecision(2),
        (3 * HOUSE_EDGE).toPrecision(2),
        (1.4 * HOUSE_EDGE).toPrecision(2),
        (1.1 * HOUSE_EDGE).toPrecision(2),
        (1 * HOUSE_EDGE).toPrecision(1),
        (0.5 * HOUSE_EDGE).toPrecision(1),
        (1 * HOUSE_EDGE).toPrecision(1),
        (1.1 * HOUSE_EDGE).toPrecision(2),
        (1.4 * HOUSE_EDGE).toPrecision(2),
        (3 * HOUSE_EDGE).toPrecision(2),
        (9 * HOUSE_EDGE).toPrecision(2),
      ];
    }
  } else if (pegRows === 11) {
    yOffset = 590;
    canvasWidth = 70;
    canvasHeight = 50;
    fontSize = 14;
    width = 45;
    xOffSets = [130, 180, 230, 280, 330, 380, 430, 480, 530, 580, 630, 680];
    if (risk === "high") {
      scores = [
        (122 * HOUSE_EDGE).toPrecision(3),
        (14.5 * HOUSE_EDGE).toPrecision(2),
        (5.5 * HOUSE_EDGE).toPrecision(2),
        (1.4 * HOUSE_EDGE).toPrecision(2),
        (0.4 * HOUSE_EDGE).toPrecision(1),
        (0.2 * HOUSE_EDGE).toPrecision(1),
        (0.2 * HOUSE_EDGE).toPrecision(1),
        (0.4 * HOUSE_EDGE).toPrecision(1),
        (1.4 * HOUSE_EDGE).toPrecision(2),
        (5.5 * HOUSE_EDGE).toPrecision(2),
        (14.5 * HOUSE_EDGE).toPrecision(2),
        (122 * HOUSE_EDGE).toPrecision(3),
      ];
    } else if (risk === "medium") {
      scores = [
        (25 * HOUSE_EDGE).toPrecision(2),
        (6 * HOUSE_EDGE).toPrecision(2),
        (3 * HOUSE_EDGE).toPrecision(2),
        (1.8 * HOUSE_EDGE).toPrecision(2),
        (0.7 * HOUSE_EDGE).toPrecision(1),
        (0.5 * HOUSE_EDGE).toPrecision(1),
        (0.5 * HOUSE_EDGE).toPrecision(1),
        (0.7 * HOUSE_EDGE).toPrecision(1),
        (1.8 * HOUSE_EDGE).toPrecision(2),
        (3 * HOUSE_EDGE).toPrecision(2),
        (6 * HOUSE_EDGE).toPrecision(2),
        (25 * HOUSE_EDGE).toPrecision(2),
      ];
    } else {
      scores = [
        (8.4 * HOUSE_EDGE).toPrecision(2),
        (3 * HOUSE_EDGE).toPrecision(2),
        (1.9 * HOUSE_EDGE).toPrecision(2),
        (1.3 * HOUSE_EDGE).toPrecision(2),
        (1 * HOUSE_EDGE).toPrecision(1),
        (0.7 * HOUSE_EDGE).toPrecision(1),
        (0.7 * HOUSE_EDGE).toPrecision(1),
        (1 * HOUSE_EDGE).toPrecision(1),
        (1.3 * HOUSE_EDGE).toPrecision(2),
        (1.9 * HOUSE_EDGE).toPrecision(2),
        (3 * HOUSE_EDGE).toPrecision(2),
        (8.4 * HOUSE_EDGE).toPrecision(2),
      ];
    }
  } else if (pegRows === 12) {
    yOffset = 590;
    canvasWidth = 50;
    canvasHeight = 50;
    fontSize = 14;
    width = 40;
    xOffSets = [
      135,
      180,
      225,
      270,
      315,
      360,
      405,
      450,
      495,
      540,
      585,
      630,
      675,
    ];
    if (risk === "high") {
      scores = [
        (175 * HOUSE_EDGE).toPrecision(3),
        (25 * HOUSE_EDGE).toPrecision(2),
        (8.5 * HOUSE_EDGE).toPrecision(2),
        (2 * HOUSE_EDGE).toPrecision(2),
        (0.7 * HOUSE_EDGE).toPrecision(2),
        (0.2 * HOUSE_EDGE).toPrecision(1),
        (0.2 * HOUSE_EDGE).toPrecision(1),
        (0.2 * HOUSE_EDGE).toPrecision(1),
        (0.7 * HOUSE_EDGE).toPrecision(2),
        (2 * HOUSE_EDGE).toPrecision(2),
        (8.5 * HOUSE_EDGE).toPrecision(2),
        (25 * HOUSE_EDGE).toPrecision(2),
        (175 * HOUSE_EDGE).toPrecision(3),
      ];
    } else if (risk === "medium") {
      scores = [
        (33 * HOUSE_EDGE).toPrecision(2),
        (11 * HOUSE_EDGE).toPrecision(2),
        (4 * HOUSE_EDGE).toPrecision(2),
        (2 * HOUSE_EDGE).toPrecision(2),
        (1.1 * HOUSE_EDGE).toPrecision(2),
        (0.6 * HOUSE_EDGE).toPrecision(1),
        (0.3 * HOUSE_EDGE).toPrecision(1),
        (0.6 * HOUSE_EDGE).toPrecision(1),
        (1.1 * HOUSE_EDGE).toPrecision(2),
        (2 * HOUSE_EDGE).toPrecision(2),
        (4 * HOUSE_EDGE).toPrecision(2),
        (11 * HOUSE_EDGE).toPrecision(2),
        (33 * HOUSE_EDGE).toPrecision(2),
      ];
    } else {
      scores = [
        (10 * HOUSE_EDGE).toPrecision(2),
        (3 * HOUSE_EDGE).toPrecision(2),
        (1.6 * HOUSE_EDGE).toPrecision(2),
        (1.4 * HOUSE_EDGE).toPrecision(2),
        (1.1 * HOUSE_EDGE).toPrecision(2),
        (1 * HOUSE_EDGE).toPrecision(1),
        (0.5 * HOUSE_EDGE).toPrecision(1),
        (1 * HOUSE_EDGE).toPrecision(1),
        (1.1 * HOUSE_EDGE).toPrecision(2),
        (1.4 * HOUSE_EDGE).toPrecision(2),
        (1.6 * HOUSE_EDGE).toPrecision(2),
        (3 * HOUSE_EDGE).toPrecision(2),
        (10 * HOUSE_EDGE).toPrecision(2),
      ];
    }
  } else if (pegRows === 13) {
    yOffset = 590;
    canvasWidth = 50;
    canvasHeight = 50;
    fontSize = 12;
    width = 35;
    xOffSets = [
      145,
      185,
      225,
      265,
      305,
      345,
      385,
      425,
      465,
      505,
      545,
      585,
      625,
      665,
    ];
    if (risk === "high") {
      scores = [
        (260 * HOUSE_EDGE).toPrecision(3),
        (37 * HOUSE_EDGE).toPrecision(2),
        (11 * HOUSE_EDGE).toPrecision(2),
        (4 * HOUSE_EDGE).toPrecision(2),
        (1.02 * HOUSE_EDGE).toPrecision(2),
        (0.2 * HOUSE_EDGE).toPrecision(1),
        (0.2 * HOUSE_EDGE).toPrecision(1),
        (0.2 * HOUSE_EDGE).toPrecision(1),
        (0.2 * HOUSE_EDGE).toPrecision(1),
        (1.02 * HOUSE_EDGE).toPrecision(2),
        (4 * HOUSE_EDGE).toPrecision(2),
        (11 * HOUSE_EDGE).toPrecision(2),
        (37 * HOUSE_EDGE).toPrecision(2),
        (260 * HOUSE_EDGE).toPrecision(3),
      ];
    } else if (risk === "medium") {
      scores = [
        (45 * HOUSE_EDGE).toPrecision(2),
        (15 * HOUSE_EDGE).toPrecision(2),
        (6 * HOUSE_EDGE).toPrecision(2),
        (3 * HOUSE_EDGE).toPrecision(2),
        (1.3 * HOUSE_EDGE).toPrecision(2),
        (0.7 * HOUSE_EDGE).toPrecision(1),
        (0.4 * HOUSE_EDGE).toPrecision(1),
        (0.4 * HOUSE_EDGE).toPrecision(1),
        (0.7 * HOUSE_EDGE).toPrecision(1),
        (1.3 * HOUSE_EDGE).toPrecision(2),
        (3 * HOUSE_EDGE).toPrecision(2),
        (6 * HOUSE_EDGE).toPrecision(2),
        (15 * HOUSE_EDGE).toPrecision(2),
        (45 * HOUSE_EDGE).toPrecision(2),
      ];
    } else {
      scores = [
        (8.3 * HOUSE_EDGE).toPrecision(2),
        (4 * HOUSE_EDGE).toPrecision(2),
        (3 * HOUSE_EDGE).toPrecision(2),
        (1.9 * HOUSE_EDGE).toPrecision(2),
        (1.2 * HOUSE_EDGE).toPrecision(2),
        (0.9 * HOUSE_EDGE).toPrecision(1),
        (0.7 * HOUSE_EDGE).toPrecision(1),
        (0.7 * HOUSE_EDGE).toPrecision(1),
        (0.9 * HOUSE_EDGE).toPrecision(1),
        (1.2 * HOUSE_EDGE).toPrecision(2),
        (1.9 * HOUSE_EDGE).toPrecision(2),
        (3 * HOUSE_EDGE).toPrecision(2),
        (4 * HOUSE_EDGE).toPrecision(2),
        (8.3 * HOUSE_EDGE).toPrecision(2),
      ];
    }
  } else if (pegRows === 14) {
    yOffset = 590;
    canvasWidth = 50;
    canvasHeight = 50;
    fontSize = 12.5;
    width = 35;
    xOffSets = [
      125,
      165,
      205,
      245,
      285,
      325,
      365,
      405,
      445,
      485,
      525,
      565,
      605,
      645,
      685,
    ];
    if (risk === "high") {
      scores = [
        (430 * HOUSE_EDGE).toPrecision(3),
        (60 * HOUSE_EDGE).toPrecision(2),
        (20 * HOUSE_EDGE).toPrecision(2),
        (5 * HOUSE_EDGE).toPrecision(2),
        (1.9 * HOUSE_EDGE).toPrecision(2),
        (0.3 * HOUSE_EDGE).toPrecision(1),
        (0.2 * HOUSE_EDGE).toPrecision(1),
        (0.2 * HOUSE_EDGE).toPrecision(1),
        (0.2 * HOUSE_EDGE).toPrecision(1),
        (0.3 * HOUSE_EDGE).toPrecision(1),
        (1.9 * HOUSE_EDGE).toPrecision(2),
        (5 * HOUSE_EDGE).toPrecision(2),
        (20 * HOUSE_EDGE).toPrecision(2),
        (60 * HOUSE_EDGE).toPrecision(2),
        (430 * HOUSE_EDGE).toPrecision(3),
      ];
    } else if (risk === "medium") {
      scores = [
        (60 * HOUSE_EDGE).toPrecision(2),
        (16 * HOUSE_EDGE).toPrecision(2),
        (7 * HOUSE_EDGE).toPrecision(2),
        (4 * HOUSE_EDGE).toPrecision(2),
        (1.9 * HOUSE_EDGE).toPrecision(2),
        (1 * HOUSE_EDGE).toPrecision(1),
        (0.5 * HOUSE_EDGE).toPrecision(1),
        (0.2 * HOUSE_EDGE).toPrecision(1),
        (0.5 * HOUSE_EDGE).toPrecision(1),
        (1 * HOUSE_EDGE).toPrecision(1),
        (1.9 * HOUSE_EDGE).toPrecision(2),
        (4 * HOUSE_EDGE).toPrecision(2),
        (7 * HOUSE_EDGE).toPrecision(2),
        (16 * HOUSE_EDGE).toPrecision(2),
        (60 * HOUSE_EDGE).toPrecision(2),
      ];
    } else {
      scores = [
        (7.2 * HOUSE_EDGE).toPrecision(2),
        (4 * HOUSE_EDGE).toPrecision(2),
        (1.9 * HOUSE_EDGE).toPrecision(2),
        (1.4 * HOUSE_EDGE).toPrecision(2),
        (1.3 * HOUSE_EDGE).toPrecision(2),
        (1.1 * HOUSE_EDGE).toPrecision(2),
        (1 * HOUSE_EDGE).toPrecision(1),
        (0.5 * HOUSE_EDGE).toPrecision(1),
        (1 * HOUSE_EDGE).toPrecision(1),
        (1.1 * HOUSE_EDGE).toPrecision(2),
        (1.3 * HOUSE_EDGE).toPrecision(2),
        (1.4 * HOUSE_EDGE).toPrecision(2),
        (1.9 * HOUSE_EDGE).toPrecision(2),
        (4 * HOUSE_EDGE).toPrecision(2),
        (7.2 * HOUSE_EDGE).toPrecision(2),
      ];
    }
  } else if (pegRows === 15) {
    yOffset = 590;
    canvasWidth = 50;
    canvasHeight = 50;
    fontSize = 10.5;
    width = 30;
    xOffSets = [
      142.5,
      177.5,
      212.5,
      247.5,
      282.5,
      317.5,
      352.5,
      387.5,
      422.5,
      457.5,
      492.5,
      527.5,
      562.5,
      597.5,
      632.5,
      667.5,
    ];
    if (risk === "high") {
      scores = [
        (630 * HOUSE_EDGE).toPrecision(3),
        (85 * HOUSE_EDGE).toPrecision(2),
        (28 * HOUSE_EDGE).toPrecision(2),
        (8 * HOUSE_EDGE).toPrecision(2),
        (3 * HOUSE_EDGE).toPrecision(2),
        (0.5 * HOUSE_EDGE).toPrecision(1),
        (0.2 * HOUSE_EDGE).toPrecision(1),
        (0.2 * HOUSE_EDGE).toPrecision(1),
        (0.2 * HOUSE_EDGE).toPrecision(1),
        (0.2 * HOUSE_EDGE).toPrecision(1),
        (0.5 * HOUSE_EDGE).toPrecision(1),
        (3 * HOUSE_EDGE).toPrecision(2),
        (8 * HOUSE_EDGE).toPrecision(2),
        (28 * HOUSE_EDGE).toPrecision(2),
        (85 * HOUSE_EDGE).toPrecision(2),
        (630 * HOUSE_EDGE).toPrecision(3),
      ];
    } else if (risk === "medium") {
      scores = [
        (90 * HOUSE_EDGE).toPrecision(2),
        (19 * HOUSE_EDGE).toPrecision(2),
        (11 * HOUSE_EDGE).toPrecision(2),
        (5 * HOUSE_EDGE).toPrecision(2),
        (3 * HOUSE_EDGE).toPrecision(2),
        (1.3 * HOUSE_EDGE).toPrecision(2),
        (0.5 * HOUSE_EDGE).toPrecision(1),
        (0.3 * HOUSE_EDGE).toPrecision(1),
        (0.3 * HOUSE_EDGE).toPrecision(1),
        (0.5 * HOUSE_EDGE).toPrecision(1),
        (1.3 * HOUSE_EDGE).toPrecision(2),
        (3 * HOUSE_EDGE).toPrecision(2),
        (5 * HOUSE_EDGE).toPrecision(2),
        (11 * HOUSE_EDGE).toPrecision(2),
        (19 * HOUSE_EDGE).toPrecision(2),
        (90 * HOUSE_EDGE).toPrecision(2),
      ];
    } else {
      scores = [
        (15 * HOUSE_EDGE).toPrecision(2),
        (8 * HOUSE_EDGE).toPrecision(2),
        (3 * HOUSE_EDGE).toPrecision(2),
        (2 * HOUSE_EDGE).toPrecision(2),
        (1.5 * HOUSE_EDGE).toPrecision(2),
        (1.1 * HOUSE_EDGE).toPrecision(2),
        (1 * HOUSE_EDGE).toPrecision(1),
        (0.7 * HOUSE_EDGE).toPrecision(1),
        (0.7 * HOUSE_EDGE).toPrecision(1),
        (1 * HOUSE_EDGE).toPrecision(1),
        (1.1 * HOUSE_EDGE).toPrecision(2),
        (1.5 * HOUSE_EDGE).toPrecision(2),
        (2 * HOUSE_EDGE).toPrecision(2),
        (3 * HOUSE_EDGE).toPrecision(2),
        (8 * HOUSE_EDGE).toPrecision(2),
        (15 * HOUSE_EDGE).toPrecision(2),
      ];
    }
  } else {
    yOffset = 590;
    canvasWidth = 50;
    canvasHeight = 50;
    fontSize = 10;
    width = 30;
    xOffSets = [
      125,
      160,
      195,
      230,
      265,
      300,
      335,
      370,
      405,
      440,
      475,
      510,
      545,
      580,
      615,
      650,
      685,
    ];
    if (risk === "high") {
      scores = [
        (1020.5 * HOUSE_EDGE).toFixed(0),
        (140 * HOUSE_EDGE).toPrecision(3),
        (27 * HOUSE_EDGE).toPrecision(2),
        (9 * HOUSE_EDGE).toPrecision(2),
        (4 * HOUSE_EDGE).toPrecision(2),
        (2 * HOUSE_EDGE).toPrecision(1),
        (0.2 * HOUSE_EDGE).toPrecision(1),
        (0.2 * HOUSE_EDGE).toPrecision(1),
        (0.2 * HOUSE_EDGE).toPrecision(1),
        (0.2 * HOUSE_EDGE).toPrecision(1),
        (0.2 * HOUSE_EDGE).toPrecision(1),
        (2 * HOUSE_EDGE).toPrecision(1),
        (4 * HOUSE_EDGE).toPrecision(2),
        (9 * HOUSE_EDGE).toPrecision(2),
        (27 * HOUSE_EDGE).toPrecision(2),
        (140 * HOUSE_EDGE).toPrecision(3),
        (1020.5 * HOUSE_EDGE).toFixed(0),
      ];
    } else if (risk === "medium") {
      scores = [
        (115 * HOUSE_EDGE).toPrecision(3),
        (43 * HOUSE_EDGE).toPrecision(2),
        (11 * HOUSE_EDGE).toPrecision(2),
        (5 * HOUSE_EDGE).toPrecision(2),
        (3 * HOUSE_EDGE).toPrecision(2),
        (1.5 * HOUSE_EDGE).toPrecision(2),
        (1 * HOUSE_EDGE).toPrecision(1),
        (0.5 * HOUSE_EDGE).toPrecision(1),
        (0.3 * HOUSE_EDGE).toPrecision(1),
        (0.5 * HOUSE_EDGE).toPrecision(1),
        (1 * HOUSE_EDGE).toPrecision(1),
        (1.5 * HOUSE_EDGE).toPrecision(2),
        (3 * HOUSE_EDGE).toPrecision(2),
        (5 * HOUSE_EDGE).toPrecision(2),
        (11 * HOUSE_EDGE).toPrecision(2),
        (43 * HOUSE_EDGE).toPrecision(2),
        (115 * HOUSE_EDGE).toPrecision(3),
      ];
    } else {
      scores = [
        (16 * HOUSE_EDGE).toPrecision(2),
        (9 * HOUSE_EDGE).toPrecision(2),
        (2 * HOUSE_EDGE).toPrecision(2),
        (1.4 * HOUSE_EDGE).toPrecision(2),
        (1.4 * HOUSE_EDGE).toPrecision(2),
        (1.2 * HOUSE_EDGE).toPrecision(2),
        (1.1 * HOUSE_EDGE).toPrecision(2),
        (1 * HOUSE_EDGE).toPrecision(1),
        (0.5 * HOUSE_EDGE).toPrecision(1),
        (1 * HOUSE_EDGE).toPrecision(1),
        (1.1 * HOUSE_EDGE).toPrecision(2),
        (1.2 * HOUSE_EDGE).toPrecision(2),
        (1.4 * HOUSE_EDGE).toPrecision(2),
        (1.4 * HOUSE_EDGE).toPrecision(2),
        (2 * HOUSE_EDGE).toPrecision(2),
        (9 * HOUSE_EDGE).toPrecision(2),
        (16 * HOUSE_EDGE).toPrecision(2),
      ];
    }
  }
  
  return {
    yOffset: yOffset,
    canvasWidth: canvasWidth,
    canvasHeight: canvasHeight,
    fontSize: fontSize,
    width: width,
    xOffSets: xOffSets,
    scores: scores,
  };
}
