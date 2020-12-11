const { v4: uuidv4 } = require('uuid') 
require('../resources/db/connection')() 
const SecretModel = require('../resources/db/models/Secret')


module.exports.create = async (event, context) => { 
    context.callbackWaitsForEmptyEventLoop = false; // reutilizar a conecção e nao fechar toda hora -- boas práticas usando Lambda

    const { id: secretId } = event.pathParameters  //para qual amigo secreto será inserido este participante
    const { name, email } = JSON.parse(event.body)
    const externalId = uuidv4() // id esterno para o participante


    try { 
        const result = await SecretModel.updateOne(
            { // 1º parametro query que fará o math no documento
                externalId: secretId,
                'participants.email': { $ne: email } // não permite email duplicado
            },
            { // 2º parametro inserir um item dentro de um array
                $push: {
                    participants: { // dá um push dentro de participantes passando os itens
                        externalId,
                        name,
                        email,
                    }
                }
            }
        ) // inserir um novo obj dentro do doc que existe na colection do mongoDB

        if (!result.nModified) { //retorna a quantidade de vezes que foi modificado
            throw new Error() // se não terornar nenhum retistro então dará erro
        }

        // caso contrário
        return {
            statusCode: 201,
            body: JSON.stringify({
                success: true,
                id: externalId,
            })
        }

    } catch (error){
        //console.log(error)
        return{
            statusCode: 500,
            body: JSON.stringify({ // em formato de texto no Json
                success: false, // não teve sucesso na requisição
            }),
        }
    }
}

module.exports.delete = async (event, context) => { 
    context.callbackWaitsForEmptyEventLoop = false; // reutilizar a conecção e nao fechar toda hora -- boas práticas usando Lambda
    const { id: secretId, participantId} = event.pathParameters
    const adminKey = event.headers['admin-key'] // só o admin pode remover
    
    try { 
        const result = await SecretModel.updateOne(
            {
                externalId: secretId,
                adminKey,                
            },

            {
                $pull: {
                    participants: {
                        externalId: participantId,
                    }
                }
            }
        )

        if (!result.nModified) {
            throw new Error()
        }

        return {
            statusCode: 204,            
        }

    } catch (error){
        //console.log(error)
        return{
            statusCode: 500,
            body: JSON.stringify({ // em formato de texto no Json
                success: false, // não teve sucesso na requisição
            }),
        }
    }
}
