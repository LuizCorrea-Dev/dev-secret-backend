const shuffle = require('./shuffle')

module.exports = (participants) => {
    const result = []
    const shuffled = shuffle(participants) // resultado do embaralhamento
    const total = shuffled.lenght

    for (let i = 0; i < total-1; i++) { // limitado atá o penultimo = total-1
       result.push({ // para cada um deles fara um push
        giver: shuffled[i], // o cara que foi sorteado na posição i atual
        receiver: shuffled[i + 1], // array embaralhado na posição +1, isto é o seguinte
       }) 
    }
    

    result.push({
        giver: shuffled[total-1], // pega o penultimo
        receiver: shuffled[0], // sorteie o da primeira posição,  porque o o primeira posição não foi sorteado, só sorteou dentro do for
    })
    return result
}