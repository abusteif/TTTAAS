export const updateTooltipFunc = func => {
  return {
    type: "UPDATE_TOOLTIP_FUNC",
    payload: func
  };
};

export const showToolTip = (hoverTimer, coords, text) => {
  return {
    type: "SHOW_TOOLTIP",
    payload: {
      hoverTimer,
      coords,
      text
    }
  };
};

export const decrementToolTipTimer = () => {
  return {
    type: "DECREMENT_TIMER"
  };
};

export const hideTooltip = () => {
  return {
    type: "HIDE_TOOLTIP"
  };
};
