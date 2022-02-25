const users=[]
//addUser,removeUser,getUser,getUsersInRoom
const addUser=({id,username,room})=>{
 //clean the data
  username=username.trim().toLowerCase()
  room=room.trim().toLowerCase()
  //validate data
  console.log("ttttttttttttt",username,room)
  if(!username || !room){
      return{
          error:'Username and roomare required!'
      }
  }

  //check for existing user
  const existingUser=users.find((user)=>{
     return user.room===room && user.username==username
  })
  //validate username
  if(existingUser){
      return{
          error:'username is in use!'
      }
  }
  //store user
  const user={id,username,room}
  users.push(user)
  return {user}
}
const removeUser=(id)=>{
  const index=users.findIndex((user)=> user.id===id)
  if(index!==-1){
       return users.splice(index,1)[0]
  }
}
const getUser=(id)=>{
    return users.find((user)=>user.id===id)
}



const getUsersInRoom=(room)=>{
    room=room.trim().toLowerCase() 
    return  users.filter((user)=>user.room===room)
}
 
addUser({
   id:22,
   username:'Reshma',
   room:'Nalgonda'
})
addUser({
    id:32,
    username:'Reshma1',
    room:'Nalgonda1'
})
addUser({
    id:34,
    username:'Reshma2',
    room:'nalgonda2'
})
// const user=getUser(132)
// console.log('user',user)

// const userList=getUsersInRoom('fairmount ')
// console.log('userlist',userList)


module.exports={
    addUser,
    removeUser,
    getUser,
    getUsersInRoom

}