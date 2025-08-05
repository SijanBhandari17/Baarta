import socket from './socket';

let localStream;
const goLive = async videoSource => {
  console.log(videoSource);
  localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  videoSource.srcObject = localStream;
};
const startStreaming = async () => {
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
  console.log('aohter hi');
  console.log(localStream);
  console.log(pc);

  pc.onicecandidate = e => {
    console.log('aohter a hi');
    if (!e.candidate) {
      socket.emit('host-connect', pc.localDescription);
      console.log(pc.localDescription);
      console.log('Hi');
    }
  };

  const offer = await pc.createOffer();
  await pc.setLocalDescription(offer);
};

export { goLive, startStreaming };
