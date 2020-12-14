// arquivo para usar o serviço AWS localmente - usando SDK para node

const aws = require('aws-sdk'); // puxando a AWS
const ses = new aws.SES({ region: 'us-east-1' }) // iniciando no SES da AWS

// ownerEmail=remetente |  result.giver= destinatário | result.receiver= informa que ele tirou no amigo secreto
module.exports = (ownerEmail, giver, receiver) => {
  const params = {

    Destination: {
      ToAddresses: [giver.email], // uma array com uma pessoa apenas - envia um email por vez
    },

    Message: {
      Body: {
        Text: {
          Data: `Seu amigo secreto é o(a) ${receiver.name}`
        }
      },
      Subject: {
        Data: '[Dev]Secret - Amigo Secreto'
      },
    },
    
    Source: ownerEmail,
  }

  

  return ses.sendEmail(params).promise()
}