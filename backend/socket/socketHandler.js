const setUpSocket = (io) => {
    io.on('connection', (socket) => {
        console.log('hi there the connection has been established', socket.id);
        
        // here changed - handle host ready to stream
        socket.on('host-ready-to-stream', (discussionId) => {
            console.log('Host ready to stream in room:', discussionId);
            socket.join(discussionId);
            // here changed - notify existing participants that host is ready
            socket.to(discussionId).emit('host-is-live');
        });

        // here changed - handle participant joining room
        socket.on('participant-connect', (room) => {
            console.log('Participant joining room:', room, socket.id);
            socket.join(room);
            
            // here changed - notify host about new viewer with unique ID
            socket.to(room).emit('new-viewer-joined', socket.id);
        });

        // here changed - handle offer being sent to specific viewer
        socket.on('send-offer-to-viewer', ({ offer, viewerId, discussionId }) => {
            console.log('Sending offer to viewer:', viewerId);
            // here changed - send offer to specific viewer
            io.to(viewerId).emit('receive-offer', { offer, hostId: socket.id });
        });

        // here changed - handle answer from viewer
        socket.on('send-answer-to-host', ({ answer, hostId, viewerId }) => {
            console.log('Sending answer from viewer to host:', viewerId, '->', hostId);
            // here changed - send answer to specific host with viewer ID
            io.to(hostId).emit(`answer-from-viewer-${viewerId}`, answer);
        });

        // here changed - handle ICE candidates from viewer
        socket.on('send-ice-candidate-to-host', ({ candidate, hostId, viewerId }) => {
            console.log('Sending ICE candidate from viewer to host:', viewerId, '->', hostId);
            // here changed - send ICE candidate to specific host with viewer ID
            io.to(hostId).emit(`ice-candidate-from-viewer-${viewerId}`, candidate);
        });

        // here changed - handle ICE candidates from host
        socket.on('send-ice-candidate-to-viewer', ({ candidate, viewerId }) => {
            console.log('Sending ICE candidate from host to viewer:', socket.id, '->', viewerId);
            // here changed - send ICE candidate to specific viewer
            io.to(viewerId).emit('receive-ice-candidate', { candidate, hostId: socket.id });
        });

        // here changed - handle disconnect
        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
            // here changed - notify all rooms about disconnection
            socket.broadcast.emit(`viewer-disconnected-${socket.id}`);
        });

        // here changed - remove old unused handlers
        // socket.on('host-connect' , (obj , roomName)=>{
        //     console.log(obj)
        //     console.log(roomName)
        //     socket.to(roomName).emit('receive-ice', obj)
        // })
        
        // socket.on('offered-from-client' , (obj)=>{
        //     console.log('this is offered form the client')
        //     console.log(obj)
        //     io.emit('taken-from-client' , obj)
        // })
    });
};

module.exports = setUpSocket;