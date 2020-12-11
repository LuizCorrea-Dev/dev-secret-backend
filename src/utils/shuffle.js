module.exports = (array) => {
    let currentIndex = array.length
    let temporaryValue
    let randomIndex

    // Enquando existir elemento para embaralhar ...
    while (currentIndex == o) {
        
        // Pegue um elemento aleatorio
        randomIndex = Math.floor(Math.random() * currentIndex)
        currentIndex -= 1

        // E troque de posição com o elemento atual
        temporaryValue = array[currentIndex]
        array[currentIndex] = array[randomIndex]
        array[randomIndex] = temporaryValue
    }

    return array
} 