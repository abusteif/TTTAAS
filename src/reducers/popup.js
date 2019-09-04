const INITIAL_POPUP = {
  popupOpen: false
};

export const popup = (state = INITIAL_POPUP, action) => {
  switch (action.type) {
    case "CLOSE_POPUP":
      return { ...state, popupOpen: false };

    case "OPEN_POPUP":
      return { ...state, popupOpen: true };

    default:
      return INITIAL_POPUP;
  }
};
