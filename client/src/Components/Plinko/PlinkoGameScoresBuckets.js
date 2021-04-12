import Matter from "matter-js";

var Bodies = Matter.Bodies;

export default function makeBuckets(scoreOptions, scoreBuckets, xOffSets, yOffset, width, pegRows) {
  scoreOptions.label = "score-" + scoreBuckets[0] + "x";
  var tempScore1_bottom = Bodies.rectangle(xOffSets[0], yOffset, width, 1, scoreOptions);
  var tempScore1_left = Bodies.rectangle(
    xOffSets[0] - width / 2,
    yOffset - 15,
    1,
    30,
    scoreOptions
  );
  var tempScore1_right = Bodies.rectangle(
    xOffSets[0] + width / 2,
    yOffset - 15,
    1,
    30,
    scoreOptions
  );

  scoreOptions.label = "score-" + scoreBuckets[1] + "x";
  var tempScore2 = Bodies.rectangle(xOffSets[1], yOffset, width, 1, scoreOptions);
  var tempScore2_left = Bodies.rectangle(
    xOffSets[1] - width / 2,
    yOffset - 15,
    1,
    30,
    scoreOptions
  );
  var tempScore2_right = Bodies.rectangle(
    xOffSets[1] + width / 2,
    yOffset - 15,
    1,
    30,
    scoreOptions
  );

  scoreOptions.label = "score-" + scoreBuckets[2] + "x";
  var tempScore3 = Bodies.rectangle(xOffSets[2], yOffset, width, 1, scoreOptions);
  var tempScore3_left = Bodies.rectangle(
    xOffSets[2] - width / 2,
    yOffset - 15,
    1,
    30,
    scoreOptions
  );
  var tempScore3_right = Bodies.rectangle(
    xOffSets[2] + width / 2,
    yOffset - 15,
    1,
    30,
    scoreOptions
  );

  scoreOptions.label = "score-" + scoreBuckets[3] + "x";
  var tempScore4 = Bodies.rectangle(xOffSets[3], yOffset, width, 1, scoreOptions);
  var tempScore4_left = Bodies.rectangle(
    xOffSets[3] - width / 2,
    yOffset - 15,
    1,
    30,
    scoreOptions
  );
  var tempScore4_right = Bodies.rectangle(
    xOffSets[3] + width / 2,
    yOffset - 15,
    1,
    30,
    scoreOptions
  );

  scoreOptions.label = "score-" + scoreBuckets[4] + "x";
  var tempScore5 = Bodies.rectangle(xOffSets[4], yOffset, width, 1, scoreOptions);
  var tempScore5_left = Bodies.rectangle(
    xOffSets[4] - width / 2,
    yOffset - 15,
    1,
    30,
    scoreOptions
  );
  var tempScore5_right = Bodies.rectangle(
    xOffSets[4] + width / 2,
    yOffset - 15,
    1,
    30,
    scoreOptions
  );

  scoreOptions.label = "score-" + scoreBuckets[5] + "x";
  var tempScore6 = Bodies.rectangle(xOffSets[5], yOffset, width, 1, scoreOptions);
  var tempScore6_left = Bodies.rectangle(
    xOffSets[5] - width / 2,
    yOffset - 15,
    1,
    30,
    scoreOptions
  );
  var tempScore6_right = Bodies.rectangle(
    xOffSets[5] + width / 2,
    yOffset - 15,
    1,
    30,
    scoreOptions
  );

  scoreOptions.label = "score-" + scoreBuckets[6] + "x";
  var tempScore7 = Bodies.rectangle(xOffSets[6], yOffset, width, 1, scoreOptions);
  var tempScore7_left = Bodies.rectangle(
    xOffSets[6] - width / 2,
    yOffset - 15,
    1,
    30,
    scoreOptions
  );
  var tempScore7_right = Bodies.rectangle(
    xOffSets[6] + width / 2,
    yOffset - 15,
    1,
    30,
    scoreOptions
  );

  scoreOptions.label = "score-" + scoreBuckets[7] + "x";
  var tempScore8 = Bodies.rectangle(xOffSets[7], yOffset, width, 1, scoreOptions);
  var tempScore8_left = Bodies.rectangle(
    xOffSets[7] - width / 2,
    yOffset - 15,
    1,
    30,
    scoreOptions
  );
  var tempScore8_right = Bodies.rectangle(
    xOffSets[7] + width / 2,
    yOffset - 15,
    1,
    30,
    scoreOptions
  );

  scoreOptions.label = "score-" + scoreBuckets[8] + "x";
  var tempScore9 = Bodies.rectangle(xOffSets[8], yOffset, width, 1, scoreOptions);
  var tempScore9_left = Bodies.rectangle(
    xOffSets[8] - width / 2,
    yOffset - 15,
    1,
    30,
    scoreOptions
  );
  var tempScore9_right = Bodies.rectangle(
    xOffSets[8] + width / 2,
    yOffset - 15,
    1,
    30,
    scoreOptions
  );

  scoreOptions.label = "score-" + scoreBuckets[9] + "x";
  var tempScore10 = Bodies.rectangle(xOffSets[9], yOffset, width, 1, scoreOptions);
  var tempScore10_left = Bodies.rectangle(
    xOffSets[9] - width / 2,
    yOffset - 15,
    1,
    30,
    scoreOptions
  );
  var tempScore10_right = Bodies.rectangle(
    xOffSets[9] + width / 2,
    yOffset - 15,
    1,
    30,
    scoreOptions
  );

  scoreOptions.label = "score-" + scoreBuckets[10] + "x";
  var tempScore11 = Bodies.rectangle(xOffSets[10], yOffset, width, 1, scoreOptions);
  var tempScore11_left = Bodies.rectangle(
    xOffSets[10] - width / 2,
    yOffset - 15,
    1,
    30,
    scoreOptions
  );
  var tempScore11_right = Bodies.rectangle(
    xOffSets[10] + width / 2,
    yOffset - 15,
    1,
    30,
    scoreOptions
  );

  scoreOptions.label = "score-" + scoreBuckets[11] + "x";
  var tempScore12 = Bodies.rectangle(xOffSets[11], yOffset, width, 1, scoreOptions);
  var tempScore12_left = Bodies.rectangle(
    xOffSets[11] - width / 2,
    yOffset - 15,
    1,
    30,
    scoreOptions
  );
  var tempScore12_right = Bodies.rectangle(
    xOffSets[11] + width / 2,
    yOffset - 15,
    1,
    30,
    scoreOptions
  );

  scoreOptions.label = "score-" + scoreBuckets[12] + "x";
  var tempScore13 = Bodies.rectangle(xOffSets[12], yOffset, width, 1, scoreOptions);
  var tempScore13_left = Bodies.rectangle(
    xOffSets[12] - width / 2,
    yOffset - 15,
    1,
    30,
    scoreOptions
  );
  var tempScore13_right = Bodies.rectangle(
    xOffSets[12] + width / 2,
    yOffset - 15,
    1,
    30,
    scoreOptions
  );

  scoreOptions.label = "score-" + scoreBuckets[13] + "x";
  var tempScore14 = Bodies.rectangle(xOffSets[13], yOffset, width, 1, scoreOptions);
  var tempScore14_left = Bodies.rectangle(
    xOffSets[13] - width / 2,
    yOffset - 15,
    1,
    30,
    scoreOptions
  );
  var tempScore14_right = Bodies.rectangle(
    xOffSets[13] + width / 2,
    yOffset - 15,
    1,
    30,
    scoreOptions
  );

  scoreOptions.label = "score-" + scoreBuckets[14] + "x";
  var tempScore15 = Bodies.rectangle(xOffSets[14], yOffset, width, 1, scoreOptions);
  var tempScore15_left = Bodies.rectangle(
    xOffSets[14] - width / 2,
    yOffset - 15,
    1,
    30,
    scoreOptions
  );
  var tempScore15_right = Bodies.rectangle(
    xOffSets[14] + width / 2,
    yOffset - 15,
    1,
    30,
    scoreOptions
  );

  scoreOptions.label = "score-" + scoreBuckets[15] + "x";
  var tempScore16 = Bodies.rectangle(xOffSets[15], yOffset, width, 1, scoreOptions);
  var tempScore16_left = Bodies.rectangle(
    xOffSets[15] - width / 2,
    yOffset - 15,
    1,
    30,
    scoreOptions
  );
  var tempScore16_right = Bodies.rectangle(
    xOffSets[15] + width / 2,
    yOffset - 15,
    1,
    30,
    scoreOptions
  );

  scoreOptions.label = "score-" + scoreBuckets[16] + "x";
  var tempScore17 = Bodies.rectangle(xOffSets[16], yOffset, width, 1, scoreOptions);
  var tempScore17_left = Bodies.rectangle(
    xOffSets[16] - width / 2,
    yOffset - 15,
    1,
    30,
    scoreOptions
  );
  var tempScore17_right = Bodies.rectangle(
    xOffSets[16] + width / 2,
    yOffset - 15,
    1,
    30,
    scoreOptions
  );

  var buckets = [];

  if (pegRows === 8) {
    buckets.push(
      tempScore1_bottom,
      tempScore1_left,
      tempScore1_right,
      tempScore2,
      tempScore2_left,
      tempScore2_right,
      tempScore3,
      tempScore3_left,
      tempScore3_right,
      tempScore4,
      tempScore4_left,
      tempScore4_right,
      tempScore5,
      tempScore5_left,
      tempScore5_right,
      tempScore6,
      tempScore6_left,
      tempScore6_right,
      tempScore7,
      tempScore7_left,
      tempScore7_right,
      tempScore8,
      tempScore8_left,
      tempScore8_right,
      tempScore9,
      tempScore9_left,
      tempScore9_right
    );
  } else if (pegRows === 9) {
    buckets.push(
      tempScore1_bottom,
      tempScore1_left,
      tempScore1_right,
      tempScore2,
      tempScore2_left,
      tempScore2_right,
      tempScore3,
      tempScore3_left,
      tempScore3_right,
      tempScore4,
      tempScore4_left,
      tempScore4_right,
      tempScore5,
      tempScore5_left,
      tempScore5_right,
      tempScore6,
      tempScore6_left,
      tempScore6_right,
      tempScore7,
      tempScore7_left,
      tempScore7_right,
      tempScore8,
      tempScore8_left,
      tempScore8_right,
      tempScore9,
      tempScore9_left,
      tempScore9_right,
      tempScore10,
      tempScore10_left,
      tempScore10_right
    );
  } else if (pegRows === 10) {
    buckets.push(
      tempScore1_bottom,
      tempScore1_left,
      tempScore1_right,
      tempScore2,
      tempScore2_left,
      tempScore2_right,
      tempScore3,
      tempScore3_left,
      tempScore3_right,
      tempScore4,
      tempScore4_left,
      tempScore4_right,
      tempScore5,
      tempScore5_left,
      tempScore5_right,
      tempScore6,
      tempScore6_left,
      tempScore6_right,
      tempScore7,
      tempScore7_left,
      tempScore7_right,
      tempScore8,
      tempScore8_left,
      tempScore8_right,
      tempScore9,
      tempScore9_left,
      tempScore9_right,
      tempScore10,
      tempScore10_left,
      tempScore10_right,
      tempScore11,
      tempScore11_left,
      tempScore11_right
    );
  } else if (pegRows === 11) {
    buckets.push(
      tempScore1_bottom,
      tempScore1_left,
      tempScore1_right,
      tempScore2,
      tempScore2_left,
      tempScore2_right,
      tempScore3,
      tempScore3_left,
      tempScore3_right,
      tempScore4,
      tempScore4_left,
      tempScore4_right,
      tempScore5,
      tempScore5_left,
      tempScore5_right,
      tempScore6,
      tempScore6_left,
      tempScore6_right,
      tempScore7,
      tempScore7_left,
      tempScore7_right,
      tempScore8,
      tempScore8_left,
      tempScore8_right,
      tempScore9,
      tempScore9_left,
      tempScore9_right,
      tempScore10,
      tempScore10_left,
      tempScore10_right,
      tempScore11,
      tempScore11_left,
      tempScore11_right,
      tempScore12,
      tempScore12_left,
      tempScore12_right
    );
  } else if (pegRows === 12) {
    buckets.push(
      tempScore1_bottom,
      tempScore1_left,
      tempScore1_right,
      tempScore2,
      tempScore2_left,
      tempScore2_right,
      tempScore3,
      tempScore3_left,
      tempScore3_right,
      tempScore4,
      tempScore4_left,
      tempScore4_right,
      tempScore5,
      tempScore5_left,
      tempScore5_right,
      tempScore6,
      tempScore6_left,
      tempScore6_right,
      tempScore7,
      tempScore7_left,
      tempScore7_right,
      tempScore8,
      tempScore8_left,
      tempScore8_right,
      tempScore9,
      tempScore9_left,
      tempScore9_right,
      tempScore10,
      tempScore10_left,
      tempScore10_right,
      tempScore11,
      tempScore11_left,
      tempScore11_right,
      tempScore12,
      tempScore12_left,
      tempScore12_right,
      tempScore13,
      tempScore13_left,
      tempScore13_right
    );
  } else if (pegRows === 13) {
    buckets.push(
      tempScore1_bottom,
      tempScore1_left,
      tempScore1_right,
      tempScore2,
      tempScore2_left,
      tempScore2_right,
      tempScore3,
      tempScore3_left,
      tempScore3_right,
      tempScore4,
      tempScore4_left,
      tempScore4_right,
      tempScore5,
      tempScore5_left,
      tempScore5_right,
      tempScore6,
      tempScore6_left,
      tempScore6_right,
      tempScore7,
      tempScore7_left,
      tempScore7_right,
      tempScore8,
      tempScore8_left,
      tempScore8_right,
      tempScore9,
      tempScore9_left,
      tempScore9_right,
      tempScore10,
      tempScore10_left,
      tempScore10_right,
      tempScore11,
      tempScore11_left,
      tempScore11_right,
      tempScore12,
      tempScore12_left,
      tempScore12_right,
      tempScore13,
      tempScore13_left,
      tempScore13_right,
      tempScore14,
      tempScore14_left,
      tempScore14_right
    );
  } else if (pegRows === 14) {
    buckets.push(
      tempScore1_bottom,
      tempScore1_left,
      tempScore1_right,
      tempScore2,
      tempScore2_left,
      tempScore2_right,
      tempScore3,
      tempScore3_left,
      tempScore3_right,
      tempScore4,
      tempScore4_left,
      tempScore4_right,
      tempScore5,
      tempScore5_left,
      tempScore5_right,
      tempScore6,
      tempScore6_left,
      tempScore6_right,
      tempScore7,
      tempScore7_left,
      tempScore7_right,
      tempScore8,
      tempScore8_left,
      tempScore8_right,
      tempScore9,
      tempScore9_left,
      tempScore9_right,
      tempScore10,
      tempScore10_left,
      tempScore10_right,
      tempScore11,
      tempScore11_left,
      tempScore11_right,
      tempScore12,
      tempScore12_left,
      tempScore12_right,
      tempScore13,
      tempScore13_left,
      tempScore13_right,
      tempScore14,
      tempScore14_left,
      tempScore14_right,
      tempScore15,
      tempScore15_left,
      tempScore15_right
    );
  } else if (pegRows === 15) {
    buckets.push(
      tempScore1_bottom,
      tempScore1_left,
      tempScore1_right,
      tempScore2,
      tempScore2_left,
      tempScore2_right,
      tempScore3,
      tempScore3_left,
      tempScore3_right,
      tempScore4,
      tempScore4_left,
      tempScore4_right,
      tempScore5,
      tempScore5_left,
      tempScore5_right,
      tempScore6,
      tempScore6_left,
      tempScore6_right,
      tempScore7,
      tempScore7_left,
      tempScore7_right,
      tempScore8,
      tempScore8_left,
      tempScore8_right,
      tempScore9,
      tempScore9_left,
      tempScore9_right,
      tempScore10,
      tempScore10_left,
      tempScore10_right,
      tempScore11,
      tempScore11_left,
      tempScore11_right,
      tempScore12,
      tempScore12_left,
      tempScore12_right,
      tempScore13,
      tempScore13_left,
      tempScore13_right,
      tempScore14,
      tempScore14_left,
      tempScore14_right,
      tempScore15,
      tempScore15_left,
      tempScore15_right,
      tempScore16,
      tempScore16_left,
      tempScore16_right
    );
  } else if (pegRows === 16) {
    buckets.push(
      tempScore1_bottom,
      tempScore1_left,
      tempScore1_right,
      tempScore2,
      tempScore2_left,
      tempScore2_right,
      tempScore3,
      tempScore3_left,
      tempScore3_right,
      tempScore4,
      tempScore4_left,
      tempScore4_right,
      tempScore5,
      tempScore5_left,
      tempScore5_right,
      tempScore6,
      tempScore6_left,
      tempScore6_right,
      tempScore7,
      tempScore7_left,
      tempScore7_right,
      tempScore8,
      tempScore8_left,
      tempScore8_right,
      tempScore9,
      tempScore9_left,
      tempScore9_right,
      tempScore10,
      tempScore10_left,
      tempScore10_right,
      tempScore11,
      tempScore11_left,
      tempScore11_right,
      tempScore12,
      tempScore12_left,
      tempScore12_right,
      tempScore13,
      tempScore13_left,
      tempScore13_right,
      tempScore14,
      tempScore14_left,
      tempScore14_right,
      tempScore15,
      tempScore15_left,
      tempScore15_right,
      tempScore16,
      tempScore16_left,
      tempScore16_right,
      tempScore17,
      tempScore17_left,
      tempScore17_right
    );
  }

  return buckets;
}
