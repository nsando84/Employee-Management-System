
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

module.exports = {
    validateText: validateText,
    validateNum: validateNum
}

