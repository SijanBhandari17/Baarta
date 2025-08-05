const setUpSocket = (io)=>{
    io.on('connection' , (socket)=>{
        console.log('hi there the connection has been established')

        socket.on('host-connect' , (obj , roomName)=>{
            console.log(obj)
            console.log(roomName)
            socket.to(roomName).emit('receive-ice', obj)
        })
        
        socket.on('participant-connect' , (room)=>{
            socket.join(room)   
        })

        socket.on('offered-from-client' , (obj)=>{
            console.log('this is offered form the client')
            console.log(obj)
            io.emit('taken-from-client' , obj)
        })
        socket.on('disconnect', (socket)=>{
            console.log('the user has been disconnected')
        })
    })
}

module.exports = setUpSocket