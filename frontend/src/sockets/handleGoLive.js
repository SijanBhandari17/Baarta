import socket from './socket';

let localStream;
const goLive = async videoSource => {
  console.log(videoSource);
  localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  videoSource.srcObject = localStream;
};
const startStreaming = async () => {
  const pc = new RTCPeerConnection({
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
  });
  localStream.getTracks().forEach(track => pc.addTrack(track, localStream));
  pc.onicecandidate = e => {
    if (!e.candidate) {
      socket.emit('host-connect', pc.localDescription);
    }
  };
};

export { goLive, startStreaming };
