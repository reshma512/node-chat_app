const socket=io()

//Elements
const $messageForm=document.querySelector('#message-form')
const $messageFormInput=$messageForm.querySelector('input')
const $messageFormButton=$messageForm.querySelector('button')
const $sendLocationButton=document.querySelector('#send-location')
const $messages=document.querySelector('#messages')


//Templates
const messageTemplate=document.querySelector('#message_template').innerHTML
const LocationmessageTemplate=document.querySelector('#location_message_template').innerHTML
const sidebarTemplate=document.querySelector('#sidebar-template').innerHTML

//Options
const {username,room}=Qs.parse(location.search,{ignoreQueryPrefix:true})

const autoscroll=()=>{
  //new message element
  const $newMessage=$messages.lastElementChild

  //height of the new mwssage
  const newMessageStyles=getComputedStyle($newMessage)
  const newMessageMargin=parseInt(newMessageStyles.marginBottom)
 const newMessageHeight=$newMessage.offsetHeight+newMessageMargin

 //visible height
 const visibleHeight=$messages.offsetHeight

 //height of message container
 const containerHeight=$messages.scrollHeight

 //how far have i scroll
 const scrollOffset=$messages.scrollTop+visibleHeight

 if(containerHeight-newMessageHeight <=scrollOffset){
    $messages.scrollTop=$messages.scrollHeight
 }

 console.log(newMessageStyles)

}

socket.on('message',(msg)=>{
    console.log("New user",msg)
    const html=Mustache.render(messageTemplate,{
      username:msg.username,
     msg: msg.text,
     createdAt:moment(msg.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend',html)
    autoscroll()
})

socket.on('locationMessage',(message)=>{ 
  console.log("location",message)
  const html=Mustache.render(LocationmessageTemplate,{
    username:message.username,
    url:message.url,
    createdAt:moment(message.createdAt).format('h:mm a')
  })
  $messages.insertAdjacentHTML('beforeend',html)//add html to documet
  autoscroll()
})



socket.on('roomData',({room,users})=>{
  console.log("room",room)
  console.log("user",users)
  const html=Mustache.render(sidebarTemplate,{
    room,users
  })
  document.querySelector('#sidebar').innerHTML=html 
})

$messageForm.addEventListener('submit',(e)=>{
        e.preventDefault()
        $messageFormButton.setAttribute('disabled','disabled')
       // const message=document.querySelector('input').value
       const message=e.target.elements.message.value
         socket.emit('sendMessage',message,(error)=>{
          $messageFormButton.removeAttribute('disabled')
           $messageFormInput.value=''
           $messageFormInput.focus()

           if(error){
             return console.log(error)
           }
           console.log("the message was delivered")
         })//from client provide name for this event will call as increment
     })//provide fn as final argument when the event is acknowledged
 $sendLocationButton.addEventListener('click',()=>{
    if(!navigator.geolocation) {
      return alert('Geolocation is not supported by browser')
    }
    $sendLocationButton.setAttribute('disabled','disabled')

    navigator.geolocation.getCurrentPosition((position)=>{
     console.log(position)
     socket.emit('sendLocation',{
         latitude:position.coords.latitude,
         longitude:position.coords.longitude
        
     },()=>{
       $sendLocationButton.removeAttribute('disabled')
       console.log('Location shared')
     })
    }
 
    )
 })    

 socket.emit('join',{username,room},(error)=>{
   if(error){
     alert(error)
     location.href='/'
   }

 })
// socket.on('countUpdated',(count)=>{
//     console.log('count has been updated',count)
// })
// document.querySelector('#increment').addEventListener('click',()=>{
//     console.log('clicked')
//     socket.emit('increment')//from client provide name for this event will call as increment
// })