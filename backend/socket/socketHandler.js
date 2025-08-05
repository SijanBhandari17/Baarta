const setUpSocket = (io)=>{
    io.on('connection' , (socket)=>{
        console.log('hi there the connection has been established')


        io.on('disconnect', (socket)=>{
            console.log('the user has been disconnected')
        })
    })
}

module.exports = setUpSocket