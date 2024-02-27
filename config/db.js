const mongoose = require('mongoose')

require('dotenv').config({ path: 'variables.env' })

const conectarDB = async () => {
    try {
        await mongoose.connect(process.env.DB_MONGO, {
        });
        console.log('DB Conectada');
    } catch (error) {
        console.log('Something went wrong');
        console.log(error);
        process.exit(1)
    }
}

module.exports = conectarDB;