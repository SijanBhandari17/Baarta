import socket from './socket';

let localStream;
const goLive = async videoSource => {
  console.log(videoSource);
  localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  videoSource.srcObject = localStream;
  return localStream;
};
const startStreaming = async discussionId => {
  console.log('hi');
  if (!localStream) {
    console.error('No local stream available');
    return;
  }

  const pc = new RTCPeerConnection({
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      { urls: 'stun:stun.cloudflare.com:3478' },
    ],
  });
  localStream.getTracks().forEach(track => pc.addTrack(track, localStream));

  pc.onicecandidate = e => {
    if (!e.candidate) {
      socket.emit('host-connect', pc.localDescription, discussionId);
      console.log(pc.localDescription);
    }
  };

  const offer = await pc.createOffer();
  await pc.setLocalDescription(offer);

  socket.on('taken-from-client', async data => {
    await pc.setRemoteDescription(data);
  });
};

export { goLive, startStreaming };
