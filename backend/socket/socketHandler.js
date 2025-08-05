const setUpSocket = (io) => {
  // Store active broadcasters and their connections
  const broadcasters = {};

  io.on("connection", (socket) => {
    console.log("Connection established with socket ID:", socket.id);

    // Host/broadcaster connects
    socket.on("host-connect", (roomName) => {
      console.log(`Host ${socket.id} connected to room ${roomName}`);
      socket.join(roomName);
      broadcasters[roomName] = socket.id;
      console.log(`Current broadcasters:`, broadcasters);
    });

    // Host sends ICE candidate or offer to a specific viewer
    socket.on("host-signal", (data, roomName, viewerId) => {
      console.log(
        `Host ${socket.id} sending signal to viewer ${viewerId} in room ${roomName}`,
      );
      socket.to(viewerId).emit("broadcaster-signal", data, socket.id);
    });

    // Viewer joins a room
    socket.on("participant-connect", (roomName) => {
      console.log(`Viewer ${socket.id} joined room ${roomName}`);
      socket.join(roomName);

      // Let the host know about this new viewer
      const hostId = broadcasters[roomName];
      if (hostId) {
        console.log(`Notifying host ${hostId} about new viewer ${socket.id}`);
        io.to(hostId).emit("new-viewer", socket.id, roomName); // this is telling the host that this particular user is trying to this room Name.
      } else {
        console.log(`No host found for room ${roomName}`);
      }
    });

    // Viewer sends signal (answer) to host
    socket.on("viewer-signal", (data, roomName, hostId) => {
      console.log(
        `Viewer ${socket.id} sending signal to host ${hostId} in room ${roomName}`,
      );
      socket.to(hostId).emit("viewer-answer", data, socket.id);
    });

    // Handle disconnects
    socket.on("disconnect", () => {
      console.log(`Socket ${socket.id} disconnected`);

      // If a broadcaster disconnects, remove them
      for (const [roomName, hostId] of Object.entries(broadcasters)) {
        if (hostId === socket.id) {
          delete broadcasters[roomName];
          console.log(`Broadcaster for room ${roomName} has disconnected`);
          io.to(roomName).emit("broadcaster-left");
          break;
        }
      }

      // Notify host if a viewer disconnects
      for (const [roomName, hostId] of Object.entries(broadcasters)) {
        io.to(hostId).emit("viewer-left", socket.id);
      }
    });
  });
};

module.exports = setUpSocket;
