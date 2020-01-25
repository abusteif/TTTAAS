export const sleep = milliseconds => {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
};

export const remoteControlButtonMapping = key => {
  var buttonPressed = "";
  switch (key) {
    case "home":
    case "back":
    case "up":
    case "down":
    case "right":
    case "left":
      buttonPressed = key;
      break;
    case "ok":
      buttonPressed = "select";
      break;
    case "undo":
      buttonPressed = "InstantReplay";
      break;
    case "star":
      buttonPressed = "Info";
      break;
    default:
      return;
  }
  return buttonPressed;
};
