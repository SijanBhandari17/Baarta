import socket from './socket'

let localStream;
// here changed - store multiple peer connections for multiple viewers
const peerConnections = new Map();

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

  // here changed - listen for new viewer connections instead of creating single connection
  socket.on('new-viewer-joined', async (viewerId) => {
    console.log('New viewer joined:', viewerId);
    
    // here changed - create separate peer connection for each viewer
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:stun.cloudflare.com:3478' },
      ],
    });

    // here changed - store psdeer connection with viewer ID
    peerConnections.set(viewerId, pc);

    // here changed - add all tracks to this specific peer connection
    localStream.getTracks().forEach(track => pc.addTrack(track, localStream));

    pc.onicecandidate = e => {
      if (!e.candidate) {
        // here changed - send offer to specific viewer
        socket.emit('send-offer-to-viewer', {
          offer: pc.localDescription,
          viewerId: viewerId,
          discussionId: discussionId // there is not point in sending this.
        });
        console.log('Offer sent to viewer:', viewerId, pc.localDescription);
      }
    };

    // here changed - handle answer from specific viewer
    socket.on(`answer-from-viewer-${viewerId}`, async (answer) => {
      try {
        await pc.setRemoteDescription(answer);
        console.log('Answer received from viewer:', viewerId);
      } catch (error) {
        console.error('Error setting remote description for viewer:', viewerId, error);
      }
    });

    // here changed - handle ICE candidates from specific viewer
    socket.on(`ice-candidate-from-viewer-${viewerId}`, async (candidate) => {
      try {
        await pc.addIceCandidate(candidate);
        console.log('ICE candidate added for viewer:', viewerId);
      } catch (error) {
        console.error('Error adding ICE candidate for viewer:', viewerId, error);
      }
    });

    // here changed - handle viewer disconnect
    socket.on(`viewer-disconnected-${viewerId}`, () => {
      console.log('Viewer disconnected:', viewerId);
      const pc = peerConnections.get(viewerId);
      if (pc) {
        pc.close();
        peerConnections.delete(viewerId);
      }
      // here changed - remove specific listener
      socket.off(`answer-from-viewer-${viewerId}`);
      socket.off(`ice-candidate-from-viewer-${viewerId}`);
      socket.off(`viewer-disconnected-${viewerId}`);
    });

    // here changed - create and send offer for this specific viewer
    try {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
    } catch (error) {
      console.error('Error creating offer for viewer:', viewerId, error);
    }
  });

  socket.emit('host-ready-to-stream', discussionId); // this is for sending the room ID to the host 
};

export { goLive, startStreaming };