const setUpSocket = (io)=>{
    io.on('connection' , (socket)=>{
        console.log('hi there the connection has been established')

        socket.on('host-connect' , (obj)=>{
            console.log(obj)
        })
        
        socket.on('participant-connect' , (obj , str)=>{
        })

        socket.on('disconnect', (socket)=>{
            console.log('the user has been disconnected')
        })
    })
}

module.exports = setUpSocket