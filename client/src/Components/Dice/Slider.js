import {
  createMuiTheme,
  Slider,
  ThemeProvider,
  withStyles,
} from "@material-ui/core";
import React from "react";

let SLIDERWAY = true;

const styledBy = (property, mapping) => (props) => mapping[props[property]];

const PrettoSlider = withStyles({
  root: {
    marginBottom: "5px",
    padding: "20px 0",
    width: "100%",
    cursor: "grab",
    "&:active": {
      cursor: "grabbing",
    },
  },
  thumb: {
    height: 24,
    width: 24,
    borderRadius: 5,
    backgroundColor: "#fff",
    border: "2px solid currentColor",
    marginTop: -6,
    marginLeft: -12,
    "&:focus, &:hover, &$active": {
      boxShadow: "inherit",
    },
  },
  active: {},
  valueLabel: {
    left: "calc(-50% + 4px)",
    marginTop: "85px",
    "& *": {
      background: "var(--very-dark-back)",
      color: "#000",
      borderRadius: "50% 0 50% 50%",
    },
  },
  track: {
    height: 12,
    borderRadius: 4,
  },
  rail: {
    height: 12,
    borderRadius: 4,
    opacity: 1,
  },
})(Slider);

const overTheme = createMuiTheme({
  overrides: {
    MuiSlider: {
      track: {
        color: "red",
      },
      rail: {
        color: "green",
      },
    },
  },
});

const underTheme = createMuiTheme({
  overrides: {
    MuiSlider: {
      track: {
        color: "green",
      },
      rail: {
        color: "red",
      },
    },
  },
});

export default function DiceSlider(props) {
  return (
    <ThemeProvider theme={props.color !== "default" ? underTheme : overTheme}>
      <PrettoSlider
        valueLabelDisplay="on"
        aria-label="pretto slider"
        min={0}
        max={100}
        value={props.value}
        onChange={props.onChange}
        onChangeCommitted={props.onChangeCommitted}
        color={props.color}
      />
    </ThemeProvider>
  );
}
