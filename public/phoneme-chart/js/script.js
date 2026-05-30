/* --------------------------------- */
/* VARIABLES */
/* --------------------------------- */

var consonants = document.getElementsByClassName('consonant');
var vowels = document.getElementsByClassName('vowel');

var ipaPhonemes = document.getElementsByClassName('ipa');
var englishPhonemes = document.getElementsByClassName('english');
var chinesePhonemes = document.getElementsByClassName('chinese');

var languages = ['ipa', 'english', 'chinese'];
var phonemeCategories = ['consonants', 'vowels'];
var optionsButtons = [];

let buttonNormal = "#1a252f"; 
let buttonHover = "#3e5771";
let buttonSelected = "#4a6887";



/* --------------------------------- */
/* HIDE ALL VOWELS */
/* --------------------------------- */

var hideVowels = function(){
    
    Array.prototype.forEach.call(vowels, function(element){
        element.style.display='none';
    })
    
    
}
var hideConsonants = function(){
    
    Array.prototype.forEach.call(consonants, function(element){
        element.style.display='none';
    })
    
    
}

var phonemeDescription = function(html){
    let displayText = html.getElementsByClassName("tooltiptext")[0].innerHTML;
    document.getElementById("phoneme-description").innerHTML = displayText;

}

var activatePhoneme = function(element){
    Array.prototype.forEach.call(document.getElementsByClassName("active"), function(element){
        element.classList.remove("active");
    });
    element.className = "active phoneme tooltip"
}

var activateSpeaker = function(){
    console.log("Speaker is Active!")
    document.getElementById("speaker-icon").style="color:#e67e22;";
    setTimeout(() => {
        document.getElementById("speaker-icon").style="color:white;";
    }, 1500);

}

/* --------------------------------- */
/* DISPLAY SYMBOLS */
/* --------------------------------- */

//shows vowels based on radiobutton currently selected. Only one language can be displayed. Have considered having the capacity to show multiple languages at once for comparison. 
var display = function(){
    
    hideVowels();
    hideConsonants();
    
    
    languages.forEach(function(language){
        
        let phonemes = [];
        
        let radioButton = language + "-radio";
        let phonemeButton = language + "-button";

        //radio buttons map to a set of vowels
        if(radioButton=='ipa-radio'){phonemes=ipaPhonemes};
        if(radioButton=='english-radio'){phonemes=englishPhonemes};
        if(radioButton=='chinese-radio'){phonemes=chinesePhonemes};
        
        //show or hide symbols based on radio button selection
        if(document.getElementById(radioButton).checked==true){
            Array.prototype.forEach.call(phonemes, function(element){
                element.style.display='block';
                document.getElementById(phonemeButton).style.backgroundColor=buttonSelected;
            })
        }else{
            Array.prototype.forEach.call(phonemes, function(element){
                element.style.display='none';
                document.getElementById(phonemeButton).style.backgroundColor=buttonNormal;
            })
        }
    })

    phonemeCategories.forEach(function(phonemeCategory){

        let selectedPhonemeCategory;
        
        let radioButton = phonemeCategory + "-radio";
        let phonemeCategoryButton = phonemeCategory + "-button";

        if(radioButton=='vowels-radio'){selectedPhonemeCategory='vowels'};
        if(radioButton=='consonants-radio'){selectedPhonemeCategory='consonants'};
        

        if(document.getElementById(radioButton).checked==true){
            document.getElementById(selectedPhonemeCategory).style = "display:block;";
            document.getElementById(phonemeCategoryButton).style.backgroundColor=buttonSelected;
        }
        else{
            document.getElementById(selectedPhonemeCategory).style = "display:none;";
            document.getElementById(phonemeCategoryButton).style.backgroundColor=buttonNormal;
        }
        
    })
    

    
}

/* --------------------------------- */
/* MAIN FUNCTION */
/* --------------------------------- */

display();

