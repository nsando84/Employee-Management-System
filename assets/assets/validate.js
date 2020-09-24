
validateText = (text) => {
    let checkText = text.split("")
    let validate = true
    checkText.forEach(e => e.match(/[a-zA-Z_ ]/i) ? "" : validate = false)
    checkText.length > 2 ? "" : validate = false
    return validate || "Inset valid text."
}


validateNum = (num) => {
    let validate = true
    num > 0 & !isNaN(num) ? "" : validate = false
    return validate || "insert valid number"
}

validateNum3 = (num) => {
    let validate = true
    num > 99 && !isNaN(num)  ? "" : validate = false
    return validate || "insert valid number"
}

console.log(validateNum3(55))
module.exports = {
    validateText: validateText,
    validateNum: validateNum,
    validateNum3: validateNum3
}

