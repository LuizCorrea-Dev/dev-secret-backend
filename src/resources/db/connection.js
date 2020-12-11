const mongoose = require('mongoose');
// Replace <password> with the password for the secret user. Replace <dbname> with the name of the database that connections will use by default

// passwordDtCaJuuDfNA3TeOC
// Clusters : mongodb+srv://secret:<password>@cluster0.wgyui.mongodb.net/<dbname>?retryWrites=true&w=majority

let conn = null // variável de conexão

const URI = 'mongodb+srv://secret:DtCaJuuDfNA3TeOC@cluster0.wgyui.mongodb.net/secret?retryWrites=true&w=majority' // stand de conexão

module.exports = async () => {
    if (!conn) { // se não existe conexão ainda
        conn = mongoose.connect(URI, {
            useNewUrlParser: true,  // um formato novo na string de conexão
            useCreateIndex: true, // um formato novo na string de conexão
        })
        await conn 
    }
}