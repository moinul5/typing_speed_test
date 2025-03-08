const words = 'rivers weave their way across continents shaping landscapes and nurturing life the amazon river often called the lungs of the earth flows through the dense rainforest providing sustenance to countless species of plants and animals the nile steeped in history has been the lifeblood of civilizations for millennia rivers are not just waterways they are symbols of life movement and renewal oceans cover more than seventy percent of our planets surface yet much of their depths remain unexplored beneath the waves lies a world of mystery filled with vibrant coral reefs schools of fish and enigmatic creatures of the deep the great barrier reef the largest coral system in the world is a breathtaking example of marine biodiversity however our oceans face numerous challenges including pollution and climate change threatening the delicate balance of these ecosystems forests often referred to as the lungs of the earth play a crucial role in maintaining our planets health the amazon rainforest with its unparalleled biodiversity is a vital carbon sink absorbing vast amounts of carbon dioxide boreal forests stretching across northern regions and temperate forests in europe and north america each contribute uniquely to the planets ecological balance protecting these green sanctuaries is essential for combating climate change and preserving biodiversity deserts though seemingly barren are teeming with life adapted to extreme conditions the sands of the sahara shift constantly under the sun while the animals of the australian outback showcase incredible resilience the saguaro cacti of the sonoran desert are iconic symbols of survival while the ancient trees of the namib desert stand as silent witnesses to the passage of time grasslands too are vital ecosystems often overlooked these open expanses support diverse wildlife from the african savannah home to lions and elephants to the north american prairies once roamed by vast herds of bison grasslands are essential for soil preservation and play a critical role in the water cycle yet they face threats from agricultural expansion and urbanization wetlands often underrated are among the most productive ecosystems on earth these waterlogged habitats support countless species while also acting as natural water filters and flood protectors the florida everglades for example are a haven for diverse wildlife and a vital resource for water purification similarly mangroves provide shelter for marine life and protect coastal areas from erosion the arctic and antarctic regions represent the extremes of our planet these icy realms are home to unique species such as polar bears penguins and seals despite their harsh climates these areas are crucial for regulating the earths temperature through their reflective ice sheets however they are particularly vulnerable to the impacts of global warming with melting ice contributing to rising sea levels volcanoes both active and dormant stand as reminders of the earths dynamic nature they shape landscapes create fertile soil and give rise to islands like hawaii and iceland while their eruptions can be destructive they also play a role in the earths renewal by releasing nutrients into the atmosphere and soil caves hidden beneath the surface offer a glimpse into the earths ancient past these underground wonders are home to unique ecosystems thriving in complete darkness stalactites and stalagmites formed over millennia create mesmerizing patterns caves like the mammoth cave system in the united states are both scientific treasures and awe inspiring natural formations the changing seasons also add to the beauty of our natural world spring brings new life as flowers bloom and animals awaken from hibernation summer is a time of abundance with lush greenery and vibrant landscapes autumn paints the world in shades of red orange and gold while winter transforms it into a serene wonderland with snow covered landscapes'.split(' ');
const wordsCount = words.length;
const gameTime = 3*1000;
window.timer = null;
window.gameStart = null;
window.pauseTime = 0;

function addClass(element, className) {     // add a class to an element
    element.className += ' ' +className;   
}
function removeClass(element, className) {  // remove a class from an element
    element.className = element.className.replace(className, '');
}

function randomWord() {   // return a random word from the words array
    const randomIndex = Math.ceil(Math.random() * wordsCount)
    return words[randomIndex-1]; 
}

function formateWord(word) {    // return a word with span tag for each letter
    return `<div class="word"><span class="letter">${word.split('').join('</span><span class="letter">')}</span></div>`
}   

function newGame() {    // start a new game
    document.getElementById('words').innerHTML = '';    // clear the words
    for (let i = 0; i < 200; i++) {     
        document.getElementById('words').innerHTML += formateWord(randomWord()); // add 200 words to the DOM
    }
    addClass(document.querySelector('.word'), 'current');  // add the current class to the first word
    addClass(document.querySelector('.letter'), 'current');    // add the current class to the first letter of the first word
    document.getElementById('info').innerHTML = (gameTime/1000) + '';
    window.timer = null;
}

function getWpm(){
    const words = [...document.querySelectorAll('.word')];
    const lastTypedWord = document.querySelector('.word.current');
    const lastTypedWordIndex = words.indexOf(lastTypedWord) +1;
    const typedWords = words.slice(0, lastTypedWordIndex);
    const correctWords = typedWords.filter(word =>{
    const letter = [...word.children];
    const incorrectLetters = letter.filter(letter => letter.className.includes('incorrect'));
    const correctLetters = letter.filter(letter=> letter.className.includes('correct'));
    return incorrectLetters.length ===0 && correctLetters.length === letter.length;
    });
    return correctWords.length /gameTime*60000 ;
}

function gameOver(){
    clearInterval(window.timer);
    addClass(document.getElementById('game'),'over');
    const result = getWpm();
    document.getElementById('info').innerHTML =`WPM: ${result}`;
}

document.getElementById('newGameBtn').addEventListener('click',()=>{
    const gameTime = 3*1000;
    newGame();
});

newGame();

document.getElementById('game').addEventListener('keyup', function (e) {    // listen for keyup event
    const key = e.key; // get the key that was pressed
    const currentWord = document.querySelector('.word.current');
    const currentLetter = document.querySelector('.letter.current');
    const expected = currentLetter?.innerHTML || '';    // get the expected letter
    const isLetter = key.length === 1 && key !== ' ';    // check if the key is a letter
    const isSpace = key === ' ';    // check if the key is a space    
    const isBackspace = key === 'Backspace';    // check if the key is a backspace
    const firstLetter = currentLetter === currentWord.firstChild;    // check if the current letter is the first letter of the current word

    if(document.querySelector('#game.over')){
        return; // here the script is stop
    }
    console.log({key, expected});
    
    if((!window.timer && isLetter )|| (!window.timer&&isSpace) || (!window.timer&&isBackspace)){
        window.timer = setInterval(()=>{
            if(!window.gameStart){
                window.gameStart = (new Date()).getTime();
            }
            const currentTime = (new Date()).getTime();
            const msPassed = currentTime - window.gameStart;
            const sPassed = Math.round(msPassed/1000);
            const sLeft = Math.round((gameTime/1000)-sPassed);
            if(sLeft<= 0){
                gameOver();
                return;
            }
            document.getElementById('info').innerHTML = sLeft+ '';
        },1000);
        
    }
    
    if(isLetter){
        if(currentLetter){
            addClass(currentLetter, key === expected ? 'correct' : 'incorrect');    // add correct or incorrect class to the current letter
            removeClass(currentLetter, 'current');    // remove the current class from the current letter
            if(currentLetter.nextSibling){
                addClass(currentLetter.nextSibling, 'current');    // add the current class to the next letter
            }
        }
        else{
            const incorrectLetters = document.createElement('span');    // create a span element for incorrect letters
            incorrectLetters.innerHTML = key;  // set the innerHTML of the span element to the key
            incorrectLetters.className = 'letter incorrect extra';    // add the letter and incorrect class to the span element
            currentWord.appendChild(incorrectLetters);    // append the span element to the current word
        }
    }

    if(isSpace){
        if(expected !== ' '){
            const lettersToInvalidate = [...document.querySelectorAll('.word.current .letter:not(.correct)')];  // get all incorrect letters
            lettersToInvalidate.forEach(letter => {
                addClass(letter, 'incorrect'); // add incorrect class to all incorrect letters
            });
        }

        removeClass(currentWord, 'current');    // remove the current class from the current word
        addClass(currentWord.nextSibling, 'current');    // add the current class to the next word
        
        if(currentLetter){
            removeClass(currentLetter, 'current');    // remove the current class from the current letter
        }
        addClass(currentWord.nextSibling.firstChild,'current');    // add the current class to the first letter of the next word
    }

    if(isBackspace){
       if(firstLetter  && currentLetter){
        removeClass(currentWord,'current');
        addClass(currentWord.previousSibling,'current');
        removeClass(currentLetter, 'current');
        addClass(currentWord.previousSibling.lastChild, 'current');
        removeClass(currentWord.previousSibling.lastChild, 'incorrect');
        removeClass(currentWord.previousSibling.lastChild, 'correct');
       }

       if(currentLetter && !firstLetter){
         removeClass(currentLetter,'current');
         addClass(currentLetter.previousSibling,'current');
         removeClass(currentLetter.previousSibling,'incorrect');
         removeClass(currentLetter.previousSibling,'correct');
       }
       if(!currentLetter){
        addClass(currentWord.lastChild,'current');
        removeClass(currentWord.lastChild,'correct');
        removeClass(currentWord.lastChild,'incorrect');
       }
      
    }

    if(currentWord.getBoundingClientRect().top>250){
        const words = document.getElementById('words');
        const margin = parseInt(words.style.marginTop || '0px');
        words.style.marginTop = (margin-35) + 'px'; 
    }
    const nextLetter = document.querySelector('.letter.current');
    const nextWord = document.querySelector('.word.current');
    const cursor = document.getElementById('cursor');
    cursor.style.top = (nextLetter || nextWord).getBoundingClientRect().top + 2 + 'px';
    cursor.style.left = (nextLetter || nextWord).getBoundingClientRect()[nextLetter ? 'left' : 'right'] + 'px';

});