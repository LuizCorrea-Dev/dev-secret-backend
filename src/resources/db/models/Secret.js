const mongoose = require('mongoose');

const Schema = {
    owner: String, // nome de quem está criando esta base de dados ( amigo secreto)
    ownerEmail: String, // email do criador
    adminKey: String, // autenticação simples
    externalId: String, // boas práticas não será exibido o id original
    participants: [{ // array de lista de participantes
        _id: false, // no mongo é default criar um id para uma array
        externalId: String, // gera um id para cada participante
        email: String, // email do participante
        name: String, // nome do partidipante
    }], 
    drawResult: [{
        _id: false, // no mongo é default criar um id para uma array
        giver: String, // que tirou o papel dom o nome do amigo secreto ( que dá o presente )
        receiver: String, // é nome de que estava no papel ( quem recebe o presente )
    }], // array de resultado o sorteio do amigo secreto
    
}

module.exports = mongoose.model('Secret', Schema)