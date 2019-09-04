const INITIAL_TOOLTIP = {
  constHoverTimer: 2,
  hovered: false,
  coords: null,
  text: "",
  hoverTimer: 1.5,
  hoverIntervalFunction: null
};

export const tooltip = (state = INITIAL_TOOLTIP, action) => {
  switch (action.type) {
    case "UPDATE_TOOLTIP_FUNC":
      return { ...state, hoverIntervalFunction: action.payload };

    case "SHOW_TOOLTIP":
      return {
        ...state,
        hovered: true,
        coords: action.payload.coords,
        hoverTimer: state.constHoverTimer,
        text: action.payload.text
      };

    case "DECREMENT_TIMER":
      return {
        ...state,
        hoverTimer: state.hoverTimer - state.constHoverTimer / 10
      };

    case "HIDE_TOOLTIP":
      return {
        ...state,
        hovered: false
      };

    default:
      return INITIAL_TOOLTIP;
  }
};
