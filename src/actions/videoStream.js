export const showVideoStream = status => {
  return {
    type: "SHOW_VIDEO_STREAM",
    payload: status
  };
};
export const playbackStarted = status => {
  return {
    type: "PLAYBACK_STARTED",
    payload: status
  };
};

export const showPicture = status => {
  return {
    type: "SHOW_PICTURE",
    payload: status
  };
};

export const updatePictureTaken = pic => {
  return {
    type: "UPDATE_PICTURE",
    payload: pic
  };
};

export const updateVideoSyncFunc = newFunc => {
  return {
    type: "UPDATE_VIDEO_SYNC_FUNC",
    payload: newFunc
  };
};
