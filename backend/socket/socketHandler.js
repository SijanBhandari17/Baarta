const setUpSocket = (io)=>{
    io.on('connection' , (socket)=>{
        console.log('hi there the connection has been established')

        socket.on('host-connect' , (obj , str)=>{
            console.log(obj.msg)
            console.log(str)
        })
        
        socket.on('participant-connect' , (obj , str)=>{
            console.log(obj.msg)
            console.log(str)
        })

        socket.on('disconnect', (socket)=>{
            console.log('the user has been disconnected')
        })
    })
}

module.exports = setUpSocket