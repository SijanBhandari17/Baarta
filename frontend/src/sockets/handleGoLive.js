import socket from './socket';

let localStream;
// Store peer connections for each viewer
const peerConnections = {};

// Get media stream for broadcaster
const goLive = async videoSource => {
  console.log('Starting broadcast with video source:', videoSource);
  localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  videoSource.srcObject = localStream;
  return localStream;
};

// Start broadcasting to a room
const startStreaming = async discussionId => {
  if (!localStream) {
    console.error('No local stream available');
    return;
  }

  console.log(`Starting to broadcast in room: ${discussionId}`);

  // Announce this broadcaster to the server
  socket.emit('host-connect', discussionId);

  // Configuration for all peer connections
  const configuration = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      { urls: 'stun:stun.cloudflare.com:3478' },
    ],
  };

  // Handle new viewer connections
  socket.on('new-viewer', async (viewerId, roomName) => {
    console.log(`New viewer connected: ${viewerId} in room ${roomName}`);

    // Create a new peer connection for this viewer
    const pc = new RTCPeerConnection(configuration);
    peerConnections[viewerId] = pc;

    // Add local tracks to the connection
    localStream.getTracks().forEach(track => {
      pc.addTrack(track, localStream);
    });

    // Handle ICE candidates
    pc.onicecandidate = e => {
      if (e.candidate) {
        // Send ICE candidate to the specific viewer
        console.log(pc.localDescription);
        // showJoinNow
        socket.emit(
          'host-signal',
          {
            type: 'ice-candidate',
            candidate: e.candidate,
          },
          roomName,
          viewerId,
        );
      }
    };

    // Create and send offer to this viewer
    try {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      socket.emit(
        'host-signal',
        {
          type: 'offer',
          sdp: pc.localDescription,
        },
        roomName,
        viewerId,
      );
    } catch (error) {
      console.error('Error creating offer:', error);
    }
  });

  // Handle answers from viewers
  socket.on('viewer-answer', async (data, viewerId) => {
    console.log(`Received answer from viewer: ${viewerId}`);
    const pc = peerConnections[viewerId];

    if (!pc) {
      console.error(`No peer connection found for viewer ${viewerId}`);
      return;
    }

    try {
      if (data.type === 'answer') {
        await pc.setRemoteDescription(new RTCSessionDescription(data.sdp));
      } else if (data.type === 'ice-candidate') {
        await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
      }
    } catch (error) {
      console.error('Error handling viewer answer:', error);
    }
  });

  // Handle viewer disconnection
  socket.on('viewer-left', viewerId => {
    console.log(`Viewer ${viewerId} has left`);
    if (peerConnections[viewerId]) {
      peerConnections[viewerId].close();
      delete peerConnections[viewerId];
    }
  });
};

// For viewers to connect to a broadcast
const connectToBroadcast = async (discussionId, videoElement) => {
  console.log(`Connecting to broadcast in room: ${discussionId}`);

  // Join the room
  socket.emit('participant-connect', discussionId);

  const pc = new RTCPeerConnection({
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      { urls: 'stun:stun.cloudflare.com:3478' },
    ],
  });

  // Display the broadcaster's stream when tracks are received
  pc.ontrack = e => {
    console.log('Received track from broadcaster');
    videoElement.srcObject = e.streams[0];
  };

  // Handle ICE candidates
  pc.onicecandidate = e => {
    if (e.candidate) {
      socket.emit(
        'viewer-signal',
        {
          type: 'ice-candidate',
          candidate: e.candidate,
        },
        discussionId,
        null,
      ); // The server will route to correct broadcaster
    }
  };

  // Handle signals from the broadcaster
  socket.on('broadcaster-signal', async (data, hostId) => {
    try {
      if (data.type === 'offer') {
        console.log('Received offer from broadcaster');
        await pc.setRemoteDescription(new RTCSessionDescription(data.sdp));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        socket.emit(
          'viewer-signal',
          {
            type: 'answer',
            sdp: pc.localDescription,
          },
          discussionId,
          hostId,
        );
      } else if (data.type === 'ice-candidate') {
        console.log('Received ICE candidate from broadcaster');
        await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
      }
    } catch (error) {
      console.error('Error handling broadcaster signal:', error);
    }
  });

  // Handle broadcaster disconnection
  socket.on('broadcaster-left', () => {
    //handleNavigateBack
    console.log('Broadcaster has left');
    if (videoElement.srcObject) {
      videoElement.srcObject.getTracks().forEach(track => track.stop());
      videoElement.srcObject = null;
    }
    pc.close();
  });

  return pc;
};

export { goLive, startStreaming, connectToBroadcast };