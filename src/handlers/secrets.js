const { v4: uuidv4 } = require('uuid') // UUID é um identificador universalmente exclusivo utilizado para identificação de qualquer coisa no mundo da computação. O UUID é um número de 128 bits representado por 32 dígitos hexadecimais, exibidos em cinco grupos separados por hifens, na forma textual8-4-4-4-12 sendo um total de 36 caracteres (32 caracteres alfanuméricos e 4 hifens). Por exemplo: 3d0ca315-aff9–4fc2-be61–3b76b9a2d798

require('../resources/db/connection')() // função assincrona

// inserir documento na base, precisa do modelo
const SecretModel = require('../resources/db/models/Secret')
const draw = require('../utils/draw')


module.exports.create = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false; // reutilizar a conecção e nao fechar toda hora -- boas práticas usando Lambda
    
    const externalId = uuidv4();
    const adminKey = uuidv4();

    const { name, email } = JSON.parse(event.body) // é o obj que a Lambda vai receber - vem como string, o json é para mandar no formato correto para API

   

    try {
        await SecretModel.create({
            owner: name, // nome de quem criou o amigo secreto
            ownerEmail: email, // email  do criador 
            externalId,  // boas práticas não setá exibino o id original
            adminKey, // autenticação simples
        })

        return {
            statusCode: 201, // foi criado
            body: JSON.stringify({
                success: true,
                id: externalId, // id foi amigo secreto que foi criado
                adminKey,// a hach utilizada para fazer autenticação
            }),
        }

    } catch (error){
        //console.log(error)
        return {
            statusCode: 500,
            body: JSON.stringify({ // em formato de texto no Json
                success: false, // não teve sucesso na requisição
            }),
        }
    }
};

module.exports.get = async (event, context) => { // recebe a lista de que está participando
    context.callbackWaitsForEmptyEventLoop = false; // reutilizar a conecção e nao fechar toda hora -- boas práticas usando Lambda

    const { id: externlId } =  event.pathParameters // pegar o id dos parametros
    const incomingAdminKey = event.headers['admin-key']

    try { 
        // o adminkey indica se é o usuário que criou e poderá alterar tudo.
        const { participants, adminKey, drawResult } = await SecretModel.findOne({
             // query que vai executar a base
             externalId,
        }).select('-_id participants adminKey drawResult').lean() // não recebe o id, mas recebe os outros 3 e a função lean é para exclui toda referencia que omongoose tiver e retorna um obj limpo.

        //verifica se é o admin que está fazendo a requisição ou não, é verificado se passa pela chave incomingAdminKey e se é igual a chave que temos na base
        const isAdmin = !!(incomingAdminKey && incomingAdminKey === adminKey) // o !! conferte para boolean

        const result = {
            participants,
            hasDrew: !!drawResult.length, // para saber se foi sorteado ou não:  se for 0 = false , se for => 1 = true.
            isAdmin,
        }

        return {
            statusCode: 200,
            body: JSON.stringify(result),
        }

    } catch (error){
        //console.log(error)
        return {
            statusCode: 500,
            body: JSON.stringify({ // em formato de texto no Json
                success: false, // não teve sucesso na requisição
            }),
        }
    }
};

module.exports.draw = async (event, context) => { 
    context.callbackWaitsForEmptyEventLoop = false; // reutilizar a conecção e nao fechar toda hora -- boas práticas usando Lambda

    const { id: externalId } = event.pathParameters
    const adminKey = event.headers['admin-Key']

    try { 

        // obert os participantes deste amigo secreto
        const secret = await SecretModel.findOne(
            {
                externalId,
                adminKey,
            }
        ).select('participants ownerEmail').lean()

        if (!secret) {
            throw new Error()
        }

        const drawResult = draw(secret.participants) // são os participantes guardada na base
        const drawMap = drawResult.map((result) => { // do drawMap será o drawResult, para cada item o array irá chamar a função
            return {
                giver: result.giver.externalId,
                receiver: result.receiver.externalId,
            }
        })

         // armazenamento dos resultados
        await SecretModel.updateOne(
            {
                _id: secret._id,
            },
            {
                drawResult: drawMap,
            }
        )

        return {
            statusCode: 200,
            body: JSON.stringify({
                drawResult, 
                success: true,
            }),
        }

    } catch (error){
        //console.log(error)
        return {
            statusCode: 500,
            body: JSON.stringify({ // em formato de texto no Json
                success: false, // não teve sucesso na requisição
            }),
        }
    }
};

