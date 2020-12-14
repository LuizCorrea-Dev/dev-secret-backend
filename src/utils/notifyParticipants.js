const sendEmail = require("../resources/ses/sendEmail")

module.exports = (drawResult, ownerEmail) => { 
  //drawResult envia | ownerEmail remetente
  const emails = drawResult.map(
    // ownerEmail=remetente |  result.giver= destinatário | result.receiver= informa que ele tirou no amigo secreto
    (result) => sendEmail(ownerEmail, result.giver, result.receiver)
  )
    // só para se todas as pessoas receberem o email
  return Promise.all(emails) // requisiçoes acincronas dentro no node
}

