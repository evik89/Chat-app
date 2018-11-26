module.exports = (server) => {
    const
        io = require('socket.io')(server),
        moment = require('moment')

    let users = []
    const messages = []

    // when the page is loaded in the browser the connection event is fired
    io.on('connection', socket => {

        // on making a connection - load in the content already present on the server
        socket.emit('refresh-messages', messages)
        socket.emit('refresh-users', users)

        socket.on('join-user', userName => {
            let isMatched = false
            users.forEach(i=>{
                if(i.name.toLowerCase() === userName.toLowerCase())
                isMatched = true
            })
            if(isMatched == false){
            const user = {
                id: socket.id,
                name: userName,
                exist: isMatched,
                avatar: `https://robohash.org/${userName}?set=set3`
            }

            users.push(user)
            
            io.emit('failed-join',"")
            io.emit('successful-join', user)
        }
        else {
            io.emit('failed-join', "The name already exist!")
        }
        })

        socket.on('send-message', data => {
            const content = {
                user: data.user,
                message: data.message,
                date: moment(new Date()).format('MM/DD/YY h:mm a'),
                avatar: `https://robohash.org/${data.user.name}?set=set3`
            }
            messages.push(content)

            io.emit('successful-message', content)
        })

        socket.on('disconnect', () => {
            users = users.filter(user => {
                return user.id != socket.id
            })

            io.emit('refresh-users', users)
        })
    })
}
