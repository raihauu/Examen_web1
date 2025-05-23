/**
 * Point culture (en Français car je suis un peu obligé): 
 * Dans ce genre de jeu, un mot equivaut a 5 caractères, y compris les espaces. 
 * La precision, c'est le pourcentage de caractères tapées correctement sur toutes les caractères tapées.
 * 
 * Sur ce... Amusez-vous bien ! 
 */
let startTime = null, previousEndTime = null;
let currentWordIndex = 0;
const wordsToType = [];


const log= document.querySelector("i.user_log")
log.addEventListener("click",()=>{
    window.location.href="./login.html"
})

/**********************************************************************************************************************/
// élément de la page d'acceuil
const start = document.querySelector(".start")
const languageSelector=document.querySelector("#language")
const difficultySelector=document.querySelector("#difficulty")
const durationSelector=document.querySelector("#duration")


/**********************************************************************************************************************/
// éléments de la page principale
const wordDisplay = document.getElementById("word-display");
const inputField = document.getElementById("input-field");
const results_wpm = document.getElementById("results_wpm");
const results_acc = document.getElementById("results_acc");
console.log(results_acc);

let accuracies=[0]
let wpms=[0]


/**********************************************************************************************************************/
// élément de la page de résultat
const accuracyResult=document.querySelector(".span_accuracy")
const WPMResult=document.querySelector(".span_wpn")
const appre=document.querySelector(".span_appre")
const star=document.querySelector("i")
const mainMenuButton=document.querySelector(".main_menu_button")
const shareButton=document.querySelector(".share_button")
const replayButton=document.querySelector(".replay_button")


const words = {
    fr: {
      easy: [
        "clavier", "souris", "écran", "fichier", "dossier",
        "internet", "bug", "mail", "photo", "clic"
      ],
      medium: [
        "navigateur", "serveur", "réseau", "logiciel", "mémoire",
        "processeur", "programme", "algorithme", "système", "donnée"
      ],
      hard: [
        "compilateur", "encapsulation", "multithreading", "virtualisation", "intelligence",
        "intégration", "récursivité", "asynchrone", "machine virtuelle", "pointeur"
      ]
    },
    en: {
      easy: [
        "mouse", "screen", "keyboard", "file", "folder",
        "internet", "bug", "email", "photo", "click"
      ],
      medium: [
        "browser", "server", "network", "software", "memory",
        "processor", "program", "algorithm", "system", "data"
      ],
      hard: [
        "compiler", "encapsulation", "multithreading", "virtualization", "intelligence",
        "integration", "recursion", "asynchronous", "virtual machine", "pointer"
      ]
    },
    mg: {
      easy: [
        "tabilao", "sary", "fitanana", "fisie", "lahatahiry",
        "aotra", "boky", "finday", "kilika", "tariby"
      ],
      medium: [
        "navigatera", "mpizara", "tambajotra", "rindranasa", "fitadidiana",
        "mpanodina", "programa", "aligoritma", "rafitra", "angona"
      ],
      hard: [
        "fandikana", "fanaparitahana", "multithreading", "virtualisationa", "fahaizana artifisialy",
        "fitambaran-drafitra", "famerimberenana", "asa tsy miandry", "milina virtoaly", "mpanondro"
      ]
    }
  };
  




function average(tab) {
    
    let sum=0
    for (let numb of tab) {
        numb=Number(numb)
        sum+=numb
    }
    
    return ((sum)/(tab.length))
}
const calcAcc = (inputValue,word) => {
    let longer
    let shorter
    if (inputValue.length>=word.length) {
        longer=inputValue.length
        shorter=word.length
    }else{
        longer=word.length
        shorter=inputValue.length
    }
    let correct=0

    for (let i = 0; i < shorter; i++) {
        const char = word[i];
        const chartyped=inputValue[i]

        if (char==chartyped) {
            correct+=1
        }
    }
    return (correct/longer)*100
}
// Generate a random word from the selected mode
const getRandomWord = (language,difficulty) => {
    const wordList = words[language][difficulty];
    return wordList[Math.floor(Math.random() * wordList.length)];
};

// Initialize the typing test
const startTest = (wordCount = 25) => {
    let duration=localStorage.getItem("duration")
    document.querySelector(".duration").textContent=duration
    wordsToType.length = 0; // Clear previous words
    wordDisplay.innerHTML = ""; // Clear display
    currentWordIndex = 0;
    startTime = null;
    previousEndTime = null;
    
    let difficulty=localStorage.getItem("difficulty")||"easy"
    let language=localStorage.getItem("language")||"fr"
    if (!language || !difficulty || !words[language] || !words[language][difficulty]) {
        alert("Langue ou difficulté non sélectionnée ou invalide. Retour au menu.");
        window.location.href = "./index.html";
        return;
    }

    for (let i = 0; i < wordCount; i++) {
        wordsToType.push(getRandomWord(language,difficulty));
    }

    wordsToType.forEach((word, index) => {
        const span = document.createElement("span");
        span.textContent = word + "  ";
        if (index === 0) span.style.color = "#1110c1"; // Highlight first word
        wordDisplay.appendChild(span);
    });

    inputField.value = "";
    results_acc.textContent = "0.00 %";
    results_wpm.textContent = "0.00";
};

// Start the timer when user begins typing
const startTimer = () => {
    if (!startTime) startTime = Date.now();
};

// Calculate and return WPM & accuracy
const getCurrentStats = () => {
    const elapsedTime =Math.max(((Date.now() - previousEndTime) / 1000)-0.05,0); // 
    const wpm = (wordsToType[currentWordIndex].length / 5) / (elapsedTime / 60); // 5 chars = 1 word
    const accuracy = calcAcc(wordsToType[currentWordIndex], inputField.value);

    return { wpm: wpm.toFixed(2), accuracy: accuracy.toFixed(2) };
};

// Move to the next word and update stats only on spacebar press
const updateWord = (event) => {
    if (event.key === " ") { // Check if spacebar is pressed
        if (inputField.value.trim()!="") {
            if (!previousEndTime) previousEndTime = startTime;
            if (currentWordIndex<wordsToType.length-1) {
                const { wpm, accuracy } = getCurrentStats();
                results_wpm.textContent = `WPM: ${wpm}`;
                results_acc.textContent = `Accuracy: ${accuracy}%`

                wpms.push(wpm)
                accuracies.push(accuracy)

                currentWordIndex++;
                previousEndTime = Date.now();
                highlightNextWord(accuracy);

                inputField.value = ""; // Clear input field after space
                event.preventDefault(); // Prevent adding extra spaces
                console.log(currentWordIndex);
                console.log(average(wpms));
                console.log(average(accuracies));
            }else{
                console.log("fin");
                const { wpm, accuracy } = getCurrentStats();
                results_wpm.textContent = `WPM: ${wpm}%`;
                results_acc.textContent = `Accuracy: ${accuracy}%`

                wpms.push(wpm)
                accuracies.push(accuracy)
                
                let avg_wpm=String(average(wpms).toFixed(2))
                let avg_acc=String(average(accuracies).toFixed(2))

                localStorage.setItem("wpms",avg_wpm)
                localStorage.setItem("accuracies",avg_acc)

                console.log(avg_acc);
                console.log(avg_wpm);

                window.location.href="./result.html"
            }
            
        }
    }
};

// Highlight the current word in red
const highlightNextWord = (accuracy) => {
    const wordElements = wordDisplay.children;    
    if (currentWordIndex < wordElements.length) {
        if (currentWordIndex > 0) {
            if (accuracy==100) {
                wordElements[currentWordIndex - 1].style.color = "green";
            }
            else{
                wordElements[currentWordIndex - 1].style.color = "red";
            }
        }
        wordElements[currentWordIndex].style.color = "#1110c1";
    }
};


/**********************************************************************************************************************/
// logique de la page index.html
if (start) {
    start.addEventListener("click",()=>{
        console.log(languageSelector);
        console.log(difficultySelector);
        
        let language=languageSelector.value||"fr"
        let difficulty=difficultySelector.value||"easy"
        let duration=durationSelector.value||30
        
        localStorage.setItem("language",language)
        localStorage.setItem("difficulty",difficulty)
        localStorage.setItem("duration",duration)
        window.location.href = "./home.html"
    })
}




/**********************************************************************************************************************/
// logique de la page principale du jeu
else if(inputField){
    // Attach `updateWord` to `keydown` instead of `input`
    inputField.addEventListener("keydown", (event) => {            
        startTimer();
        updateWord(event);    
    
    });
    
    // Start the test
    startTest();

    setInterval(()=>{
        let duration=localStorage.getItem("duration")
        document.querySelector(".duration").textContent=duration

        if (startTime) {
            const startTimer=startTime
            let timer=Math.ceil((duration-((Date.now()-startTimer)/1000)))
            if (timer>0) {
                document.querySelector(".duration").textContent=timer
            }
            else{
                let avg_wpm=String(average(wpms).toFixed(2))
                let avg_acc=String(average(accuracies).toFixed(2))

                localStorage.setItem("wpms",avg_wpm)
                localStorage.setItem("accuracies",avg_acc)

                window.location.href="./result.html"
            }

        }
        
    },1000)
}


/**********************************************************************************************************************/
// logique de la page de résultat
else if (replayButton){
    
    const accuracyResult=document.querySelector(".span_accuracy")
    const WPMResult=document.querySelector(".span_wpn")
    const appre=document.querySelector(".span_appre")
    const star=document.querySelector("i")
    const mainButton=document.querySelector(".main_button")
    const shareButton=document.querySelector(".share_button")
    const replayButton=document.querySelector(".replay_button")

    let avg_wpm=localStorage.getItem("wpms")
    let avg_acc=localStorage.getItem("accuracies")


    console.log(avg_wpm);
    console.log(avg_acc);

    accuracyResult.textContent+=avg_acc
    WPMResult.textContent+=avg_wpm

    if (avg_acc<=10 || avg_wpm<=10) {
        appre.textContent+="Peut mieux faire"
        star.style.color="red"
    }else if(avg_acc<=60 || avg_wpm<=35){
        appre.textContent+="Passable"
        star.style.color="orange"
    }else if(avg_acc<=90 || avg_wpm<=45){
        appre.textContent+="Assez bien"
        star.style.color="green"
    }else if (avg_acc==100 && avg_wpm>=60) {
        appre.textContent+="Très bien"
        star.style.color="aqua"
    }else{
        appre.textContent+="bien"
        star.style.color="gold"
    }

    
    replayButton.addEventListener("click",()=>{
        window.location.href="./home.html"
    })
    shareButton.addEventListener("click",()=>{
        window.location.href="https://www.facebook.com/"
    })
    mainMenuButton.addEventListener("click",()=>{
        window.location.href="./index.html"
    })
}