const path=require('path')//load path directory,this i  core node module so  no need to instaal it
const http=require('http')//load http core mosdule
const express=require('express') //load express
const socketio=require('socket.io')
const Filter=require('bad-words')
const {generateMessage,generateLocationMessage}=require('./utils/message')
const {addUser, removeUser, getUser,getUsersInRoom}=require('./utils/users')



const app=express()//calling express fn to generate new application 
const server=http.createServer(app)//creste server out of node library
const io=socketio(server)//create socketio instactce passing server in

const port=process.env.PORT||3000
const publicDirectoryPath=path.join(__dirname,'../public')


//configure server
app.use(express.static(publicDirectoryPath))
//let count=0

//print message when new client connects
io.on('connection',(socket)=>{
  

    socket.on('join',(options,callback)=>{
        const {error,user }=addUser({id:socket.id, ...options})
          if(error){
             return  callback(error)
          }
         



     socket.join(user.room)
     socket.emit('message',generateMessage('Admin','Welcome')    )
     socket.broadcast.to(user.room).emit('message',generateMessage('Admin',`${user.username} has joined`))
     io.to(user.name).emit('roomData',{
         room:user.room,
         users:getUsersInRoom(user.room)
     })
     callback() 
    })
    

    socket.on('sendMessage',(message,callback)=>{
        const user=getUser(socket.id)
        const filter=new Filter()
        if(filter.isProfane(message)){
            return callback('Profanity is not allowed!')
        }
        io.to(user.room).emit('message',generateMessage(user.username,message))
        callback()//cal this to acknowledge the event
        //event listerner for event (msg was delivered)
    })
    // console.log('new web socket connection...')
    // socket.emit('countUpdated',count)
    // socket.on('increment',()=>{
    //     count++;
    //     socket.emit('countUpdated',count)
    // })
    socket.on('sendLocation',(coords,callback)=>{
        const user=getUser(socket.id)
        io.to(user.room).emit('locationMessage',generateLocationMessage(user.username,`https://google.com/maps?q=${coords.latitude},${coords.longitude}`)),
        callback()//to send message to client that it was received
    })
    socket.on('disconnect',()=>{
        const user=removeUser(socket.id)
        if(user){
            io.to(user.room).emit('message',generateMessage('Admin',`${user.username} jas left!`))
            io.to(user.room).emit('roomData',{
                room:user.room,
                users:getUsersInRoom(user.room)
            })
        }
    })
})

//start thr server
server.listen(port,()=>{
    console.log(`Server is up on port ${port}!`)
})
