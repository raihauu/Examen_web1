const nameInput=document.querySelector(".name_input")
const passwordInput=document.querySelector(".password_Input")
const logButton=document.querySelector(".log_button")
const alerte=document.querySelector(".alerte")
const back=document.querySelector(".back")

logButton.addEventListener("click",()=>{
    if ((passwordInput.value.trim()!="")&&(nameInput.value.trim()!="")) {
        window.location.href="./index.html"
    }
    else{       
        alerte.style.display="block"  
        setTimeout(()=>{
            alerte.style.display="none"
        },3000)
    }
})
back.addEventListener("click",()=>{
    window.location.href="./index.html"
})
