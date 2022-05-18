let addbtn = document.querySelector('.add-btn')
let mainticket = document.querySelector('.main')
let modalcontainer = document.querySelector('.modal-cont')
let allprioritycolor = document.querySelectorAll('.priority-color')
let tasktext = document.querySelector('textarea')

let colorarr = ['pink','blue','green','black']
let modalcontconlor = colorarr[colorarr.length-1]
let removebtn = document.querySelector('.remove-btn')
let removerflag = false
let toolboxcolor = document.querySelectorAll('.color')

let lockopen =  "fa-lock-open"
let lock = "fa-lock"
let ticketArr = []




//retrive data from localstorage

if(localStorage.getItem('tickets')){
    ticketArr = JSON.parse(localStorage.getItem('tickets'))
    for(let i=0;i<ticketArr.length;i++){
        createticket(ticketArr[i].ticketColor,ticketArr[i].ticketMessage,ticketArr[i].ticketid)
    }
    
}

//filter
console.log(toolboxcolor[0].classList[0])

for(let i=0; i<toolboxcolor.length; i++){
  toolboxcolor[i].addEventListener('click', function(e){
    let ourcolor = toolboxcolor[i].classList[1]
    // console.log(ourcolor)

    let filterarr = ticketArr.filter(function(obj){
        return ourcolor==obj.ticketColor
    })

    let allticketcont = document.querySelectorAll('.ticket-cont')

    for(let i=0;i<allticketcont.length;i++){
        allticketcont[i].remove()
    }

    for(let i=0;i<filterarr.length;i++){
        createticket(filterarr[i].ticketColor,filterarr[i].ticketMessage,filterarr[i].ticketid)
    }

  })

  toolboxcolor[i].addEventListener('dblclick',function(e){
    let allticketcont = document.querySelectorAll('.ticket-cont')
    for(let i=0;i<allticketcont.length;i++){
        allticketcont[i].remove()
    }
    for(let i=0;i<ticketArr.length;i++){
        createticket(ticketArr[i].ticketColor,ticketArr[i].ticketMessage,ticketArr[i].ticketid)
    }
  })
}

addbtn.addEventListener('click',function(e){
   //Display the Modal
   
    modalcontainer.classList.toggle('shown')
})


allprioritycolor.forEach(function(colorelem){
    colorelem.addEventListener('click',function(e){
       allprioritycolor.forEach(function(element){
        element.classList.remove('active')
       })
       colorelem.classList.add('active')
       modalcontconlor = colorelem.classList[0]
    })
  
})



//create the ticket
modalcontainer.addEventListener('keydown',function(e){
    if(e.key=="Shift"){
       
        
      createticket(modalcontconlor,tasktext.value)
      modalcontainer.classList.toggle('shown')
      tasktext.value=""
    }
})

function createticket(ticketColor,ticketMessage,ticketid){
    let id = ticketid || shortid()
    let ticketcontainer =document.createElement('div')
    ticketcontainer.setAttribute('class','ticket-cont')
    ticketcontainer.innerHTML= `<div class="ticket-color ${ticketColor}"></div>
    <div class="ticket-id">${id}</div>
    <div class="taskarea" spellcheck="false">${ticketMessage}</div>
    <div class="ticket-lock">
    <i class="fa-solid fa-lock"></i>
</div>`
    mainticket.appendChild(ticketcontainer)
    handleremove(ticketcontainer,id)
    handlelock(ticketcontainer,id)
    handlecolor(ticketcontainer,id)

    if(!ticketid){
        ticketArr.push({ticketColor,ticketMessage,ticketid:id})
        localStorage.setItem('tickets',JSON.stringify(ticketArr))
    }
}

removebtn.addEventListener('click',function(){
    removerflag = !removerflag
    if(removerflag==true){
        removebtn.style.color='red'
    }else{
        removebtn.style.color=''

    }
})

function handleremove(removeticket,id){
    removeticket.addEventListener('click',function(){
        if(!removerflag){
            return
            // removeticket.remove()
        }

         let ouridx = getticketIdx(id)

         ticketArr.splice(ouridx,1)
        let strarr =JSON.stringify(ticketArr)

         localStorage.setItem('tickets',strarr)
         removeticket.remove()

    })
}

//lock and unlock

function handlelock(ticket,id){
    let ticketlock = ticket.querySelector('.ticket-lock')
    let taskarea  = ticket.querySelector('.taskarea')
    let ticketfirstelem = ticketlock.children[0]
    ticketfirstelem.addEventListener('click',function(e){
        let ourindex = getticketIdx(id)
        if(ticketfirstelem.classList.contains(lock)){
          ticketfirstelem.classList.remove(lock)
          ticketfirstelem.classList.add(lockopen)
          taskarea.setAttribute('contenteditable',true)
        }else{
            ticketfirstelem.classList.remove(lockopen)
            ticketfirstelem.classList.add(lock)
            taskarea.setAttribute('contenteditable',false)
        }

        ticketArr[ourindex].ticketMessage= taskarea.innerText
        localStorage.setItem('tickets',JSON.stringify(ticketArr ))
    })
  
}


//handle the color 


function handlecolor(ticket,id){
    let currenticketcolor = ticket.querySelector('.ticket-color')
    
  
    currenticketcolor.addEventListener('click',function(){
        let currentcolor = currenticketcolor.classList[1]
        let changecolorid = getticketIdx(id)
        let colorindex = colorarr.findIndex(function(color){
            if(currentcolor==color){
                return true
            }
        })
        let total = colorarr.length
        let nextindex = (colorindex+1)%total
        let ourcolor = colorarr[nextindex]
        
        currenticketcolor.classList.remove(currentcolor)
        currenticketcolor.classList.add(ourcolor)
        ticketArr[changecolorid].ticketColor = ourcolor
        localStorage.setItem('tickets',JSON.stringify(ticketArr ))
    })
}

//get ticketIdx

function getticketIdx(id){
    let ourindex = ticketArr.findIndex(function(obj){
        return obj.ticketid==id
    })
    return ourindex

}