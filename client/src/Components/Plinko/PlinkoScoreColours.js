export default function makeColours(rows) {
  var newBackground = [],
    newShadow = [],
    offset,
    width,
    backgroundWidth,
    nudge,
    fontSize;

  if (rows === 8) {
    newBackground = [
      "#ff003f",
      "#ff302f",
      "#ff6020",
      "#ff9010",
      "#ffc000",
      "#ff9010",
      "#ff6020",
      "#ff302f",
      "#ff003f",
    ];

    newShadow = [
      "#7e0727",
      "#c80100",
      "#b93500",
      "#a95b00",
      "#997300",
      "#a95b00",
      "#b93500",
      "#c80100",
      "#7e0727",
    ];

    if (window.innerWidth > 950) {
      offset = 53;
      width = 30;
      backgroundWidth = 50;
      nudge = 20;
      fontSize = 15;
    } else {
      offset = 6.5;
      width = 10;
      backgroundWidth = 20;
      nudge = 10;
      fontSize = 10;
    }
  } else if (rows === 9) {
    newBackground = [
      "#ff003f",
      "#ff302f",
      "#ff6020",
      "#ff9010",
      "#ffc000",
      "#ffc000",
      "#ff9010",
      "#ff6020",
      "#ff302f",
      "#ff003f",
    ];

    newShadow = [
      "#7e0727",
      "#c80100",
      "#b93500",
      "#a95b00",
      "#997300",
      "#997300",
      "#a95b00",
      "#b93500",
      "#c80100",
      "#7e0727",
    ];

    if (window.innerWidth > 950) {
      offset = 46;
      width = 20;
      backgroundWidth = 40;
      nudge = 20;
      fontSize = 15;
    } else {
      offset = 2.75;
      width = 10;
      backgroundWidth = 20;
      nudge = 22;
      fontSize = 10;
    }
  } else if (rows === 10) {
    newBackground = [
      "#ff003f",
      "#ff2632",
      "#ff4d26",
      "#ff6020",
      "#ff9010",
      "#ffc000",
      "#ff9010",
      "#ff6020",
      "#ff4d26",
      "#ff2632",
      "#ff003f",
    ];

    newShadow = [
      "#7e0727",
      "#c80100",
      "#b93500",
      "#b24600",
      "#a95b00",
      "#997300",
      "#a95b00",
      "#b24600",
      "#b93500",
      "#c80100",
      "#7e0727",
    ];

    if (window.innerWidth > 950) {
      offset = 42;
      width = 20;
      backgroundWidth = 37;
      nudge = 20;
      fontSize = 15;
    } else {
      offset = 2.75;
      width = 10;
      backgroundWidth = 18;
      nudge = 20;
      fontSize = 10;
    }
  } else if (rows === 11) {
    newBackground = [
      "#ff003f",
      "#ff2632",
      "#ff4d26",
      "#ff6020",
      "#ff9010",
      "#ffc000",
      "#ffc000",
      "#ff9010",
      "#ff6020",
      "#ff4d26",
      "#ff2632",
      "#ff003f",
    ];

    newShadow = [
      "#7e0727",
      "#c80100",
      "#b93500",
      "#b24600",
      "#a95b00",
      "#997300",
      "#997300",
      "#a95b00",
      "#b24600",
      "#b93500",
      "#c80100",
      "#7e0727",
    ];

    if (window.innerWidth > 950) {
      offset = 37.5;
      width = 20;
      backgroundWidth = 33;
      nudge = 20;
      fontSize = 15;
    } else {
      offset = 2.75;
      width = 10;
      backgroundWidth = 16;
      nudge = 20;
      fontSize = 10;
    }
  } else if (rows === 12) {
    newBackground = [
      "#ff003f",
      "#ff2632",
      "#ff4d26",
      "#ff6020",
      "#ff9010",
      "#ffa00b",
      "#ffc000",
      "#ffa00b",
      "#ff9010",
      "#ff6020",
      "#ff4d26",
      "#ff2632",
      "#ff003f",
    ];

    newShadow = [
      "#7e0727",
      "#c80100",
      "#b93500",
      "#b24600",
      "#ae5000",
      "#865709",
      "#997300",
      "#865709",
      "#ae5000",
      "#b24600",
      "#b93500",
      "#c80100",
      "#7e0727",
    ];

    if (window.innerWidth > 950) {
      offset = 34;
      width = 20;
      backgroundWidth = 30;
      nudge = 20;
      fontSize = 15;
    } else {
      offset = 2;
      width = 10;
      backgroundWidth = 15;
      nudge = 22;
      fontSize = 7.5;
    }
  } else if (rows === 13) {
    newBackground = [
      "#ff003f",
      "#ff2632",
      "#ff4d26",
      "#ff6020",
      "#ff9010",
      "#ffa00b",
      "#ffc000",
      "#ffc000",
      "#ffa00b",
      "#ff9010",
      "#ff6020",
      "#ff4d26",
      "#ff2632",
      "#ff003f",
    ];

    newShadow = [
      "#7e0727",
      "#c80100",
      "#b93500",
      "#b24600",
      "#ae5000",
      "#865709",
      "#997300",
      "#997300",
      "#865709",
      "#ae5000",
      "#b24600",
      "#b93500",
      "#c80100",
      "#7e0727",
    ];

    if (window.innerWidth > 950) {
      offset = 30.25;
      width = 20;
      backgroundWidth = 28;
      nudge = 20;
      fontSize = 15;
    } else {
      offset = 2;
      width = 10;
      backgroundWidth = 13;
      nudge = 22;
      fontSize = 7.5;
    }
  } else if (rows === 14) {
    newBackground = [
      "#ff003f",
      "#ff1b36",
      "#ff372d",
      "#ff5224",
      "#ff6e1b",
      "#ff8912",
      "#ffa00b",
      "#ffc000",
      "#ffa00b",
      "#ff8912",
      "#ff6e1b",
      "#ff5224",
      "#ff372d",
      "#ff1b36",
      "#ff003f",
    ];

    newShadow = [
      "#7e0727",
      "#93071a",
      "#c80100",
      "#b93500",
      "#b24600",
      "#ae5000",
      "#865709",
      "#997300",
      "#865709",
      "#ae5000",
      "#b24600",
      "#b93500",
      "#c80100",
      "#93071a",
      "#7e0727",
    ];

    if (window.innerWidth > 950) {
      offset = 30;
      width = 20;
      backgroundWidth = 28;
      nudge = 20;
      fontSize = 15;
    } else {
      offset = 2;
      width = 10;
      backgroundWidth = 13;
      nudge = 20;
      fontSize = 7.5;
    }
  } else if (rows === 15) {
    newBackground = [
      "#ff003f",
      "#ff1b36",
      "#ff372d",
      "#ff5224",
      "#ff6e1b",
      "#ff8912",
      "#ffa00b",
      "#ffc000",
      "#ffc000",
      "#ffa00b",
      "#ff8912",
      "#ff6e1b",
      "#ff5224",
      "#ff372d",
      "#ff1b36",
      "#ff003f",
    ];

    newShadow = [
      "#7e0727",
      "#93071a",
      "#c80100",
      "#b93500",
      "#b24600",
      "#ae5000",
      "#865709",
      "#997300",
      "#997300",
      "#865709",
      "#ae5000",
      "#b24600",
      "#b93500",
      "#c80100",
      "#93071a",
      "#7e0727",
    ];

    if (window.innerWidth > 950) {
      offset = 26.25;
      width = 20;
      backgroundWidth = 25;
      nudge = 20;
      fontSize = 13;
    } else {
      offset = 1.25;
      width = 10;
      backgroundWidth = 12;
      nudge = 25;
      fontSize = 7.5;
    }
  } else if (rows === 16) {
    newBackground = [
      "#ff003f",
      "#ff1b36",
      "#ff372d",
      "#ff5224",
      "#ff6e1b",
      "#ff8912",
      "#ffa00b",
      "#ffa808",
      "#ffc000",
      "#ffa808",
      "#ffa00b",
      "#ff8912",
      "#ff6e1b",
      "#ff5224",
      "#ff372d",
      "#ff1b36",
      "#ff003f",
    ];

    newShadow = [
      "#7e0727",
      "#93071a",
      "#c80100",
      "#b93500",
      "#b24600",
      "#ae5000",
      "#865709",
      "#a16800",
      "#997300",
      "#a16800",
      "#865709",
      "#ae5000",
      "#b24600",
      "#b93500",
      "#c80100",
      "#93071a",
      "#7e0727",
    ];

    if (window.innerWidth > 950) {
      offset = 26.25;
      width = 20;
      backgroundWidth = 25;
      nudge = 17;
      fontSize = 11;
    } else {
      offset = 1.25;
      width = 10;
      backgroundWidth = 12;
      nudge = 25;
      fontSize = 5;
    }
  }

  return {
    newBackground,
    newShadow,
    offset,
    width,
    backgroundWidth,
    nudge,
    fontSize,
  };
}
