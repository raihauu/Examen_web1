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

const modeSelect = document.getElementById("mode");
const wordDisplay = document.getElementById("word-display");
const inputField = document.getElementById("input-field");
const results = document.getElementById("results");
const start = document.querySelector(".start")
let accuracies=[]
let wpms=[]


const words = {
    easy: ["apple", "banana", "grape", "orange", "cherry"],
    medium: ["keyboard", "monitor", "printer", "charger", "battery"],
    hard: ["synchronize", "complicated", "development", "extravagant", "misconception"]
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
const getRandomWord = (mode) => {
    const wordList = words[mode];
    return wordList[Math.floor(Math.random() * wordList.length)];
};

// Initialize the typing test
const startTest = (wordCount = 5) => {
    wordsToType.length = 0; // Clear previous words
    wordDisplay.innerHTML = ""; // Clear display
    currentWordIndex = 0;
    startTime = null;
    previousEndTime = null;

    for (let i = 0; i < wordCount; i++) {
        wordsToType.push(getRandomWord(modeSelect.value));
    }

    wordsToType.forEach((word, index) => {
        const span = document.createElement("span");
        span.textContent = word + " ";
        if (index === 0) span.style.color = "red"; // Highlight first word
        wordDisplay.appendChild(span);
    });

    inputField.value = "";
    results.textContent = "";
};

// Start the timer when user begins typing
const startTimer = () => {
    if (!startTime) startTime = Date.now();
};

// Calculate and return WPM & accuracy
const getCurrentStats = () => {
    const elapsedTime = (Date.now() - previousEndTime) / 1000; // Seconds
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
                results.textContent = `WPM: ${wpm}, Accuracy: ${accuracy}%`;

                wpms.push(wpm)
                accuracies.push(accuracy)

                currentWordIndex++;
                previousEndTime = Date.now();
                highlightNextWord(accuracy);

                inputField.value = ""; // Clear input field after space
                event.preventDefault(); // Prevent adding extra spaces
                console.log(currentWordIndex);
                
            }else{
                console.log("fin");
                const { wpm, accuracy } = getCurrentStats();
                results.textContent = `WPM: ${wpm}, Accuracy: ${accuracy}%`;

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
const highlightNextWord = () => {
    const wordElements = wordDisplay.children;

    if (currentWordIndex < wordElements.length) {
        if (currentWordIndex > 0) {
            wordElements[currentWordIndex - 1].style.color = "black";
        }
        wordElements[currentWordIndex].style.color = "red";
    }
};


/**********************************************************************************************************************/
// logique de la page index.html
if (start) {
    start.addEventListener("click",()=>{
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
    modeSelect.addEventListener("change", () => startTest());

    // Start the test
    startTest();
}


/**********************************************************************************************************************/
// logique de la page de résultat