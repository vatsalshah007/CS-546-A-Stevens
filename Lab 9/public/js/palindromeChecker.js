const palindromeChecker = (inputString) => {
    if(!inputString){
        throw `Please enter a string!`
    }
    inputString = inputString.trim()
    if (inputString.length == 0) {
        throw `Please enter a proper string and not just empty spaces!`
    }
    inputString = inputString.toLowerCase().replaceAll(" ", '').replace(/[^\w\s]/g,"")
    if (inputString.length == 0) {
        throw `Please enter a valid string!`
    }
    let firstHalf = inputString.slice(0, inputString.length / 2).split("").reverse().join(""), secondHalf
    if (inputString.length % 2 == 0) {
        secondHalf = inputString.slice(inputString.length / 2)   
    } else {
        secondHalf = inputString.slice((inputString.length / 2)+1)
    }
    if (firstHalf == secondHalf) {
        return true
    } else {
        return false
    }
}

const formElement = document.getElementById("palindromeForm")
const inputStr = document.getElementById("stringInput")
const olDiv = document.getElementById("palindromeAttempts")
const ol = document.getElementById("attempts")
const errorDiv = document.getElementById("errorDiv")

formElement.addEventListener('submit', (event) =>{ 
    event.preventDefault();
    try {
        inputStr.classList.remove("errorsExists")
        errorDiv.classList.add("hidden")

        const inputStrValue = inputStr.value
        
        const palindromeNode = document.createTextNode(inputStrValue)
        let isPalindrome = palindromeChecker(inputStrValue)
        // console.log(isPalindrome)
        olDiv.className = "palindromeAttempts"
        inputStr.value = ""
        
        li = document.createElement("li")
        li.appendChild(palindromeNode)

        if (isPalindrome) {
            li.className = "is-palindrome"
        } else {
            li.className = "not-palindrome"
        }

        ol.insertBefore(li, ol.childNodes[0]);
        
    } catch (e) {
        errorDiv.textContent = e
        errorDiv.classList.remove("hidden")
        inputStr.classList.add("errorsExists")
    }
    
})