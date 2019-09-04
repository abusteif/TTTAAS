const INITIAL_STREAM_STATE = {
  showStream: false,
  playbackStarted: false,
  showTakenPicture: false,
  picture: null
};

export const videoStream = (state = INITIAL_STREAM_STATE, action) => {
  switch (action.type) {
    case "SHOW_VIDEO_STREAM":
      return { ...state, showStream: action.payload };
    case "PLAYBACK_STARTED":
      return { ...state, playbackStarted: action.payload };
    case "SHOW_PICTURE":
      return { ...state, showTakenPicture: action.payload };
    case "UPDATE_PICTURE":
      return { ...state, picture: action.payload };

    default:
      return state;
  }
};
