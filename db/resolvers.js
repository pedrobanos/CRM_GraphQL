const Usuario = require('../models/Usuario')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
require('dotenv').config({ path: 'variables.env' })

const crearToken = (usuario, secreta, expiresIn) => {
    // console.log((usuario));
    const { id, email, nombre, apellido } = usuario

    return jwt.sign({ id, email, nombre, apellido }, secreta, { expiresIn })
}
// Resolvers

const resolvers = {
    Query: {
        obtenerUsuario: async (_, { token }) => {
            const usuarioID = await jwt.verify(token, process.env.SECRETA)
            
            return usuarioID
        }
    },
    Mutation: {
        nuevoUsuario: async (_, { input }) => {
            const { email, password } = input
            //Revisar primero si el usuario ya esta registrado
            const existeUsuario = await Usuario.findOne({ email })
            if (existeUsuario) {
                throw new Error('El usuario ya está registrado')
            }
            //hashear la password
            const salt = 10
            input.password = await bcrypt.hash(password, salt)
            //guardarlo en la base de datos 
            try {
                const usuario = new Usuario(input)

                usuario.save() // lo guarda

                return usuario;

            } catch (error) {
                console.log(error);

            }
        },
        autenticarUsuario: async (_, { input }) => {
            const { email, password } = input
            //revisar si el usuario existe
            const existeUsuario = await Usuario.findOne({ email })
            if (!existeUsuario) {
                throw new Error('El usuario no existe')
            }
            //Revisar si el password es correcto
            const passwordCorrecto = await bcrypt.compare(password, existeUsuario.password);
            if (!passwordCorrecto) {
                throw new Error('email or password incorrect')
            }
            //Crear el token
            return {
                token: crearToken(existeUsuario, process.env.SECRETA, '24h')
            }
        }
    }
}

module.exports = resolvers;