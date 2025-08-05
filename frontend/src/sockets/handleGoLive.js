const goLive = async videoSource => {
  console.log(videoSource);
  const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  videoSource.srcObject = localStream;
};

export { goLive };
