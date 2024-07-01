// Se importa el módulo mysql (Biblioteca de node.js)
const mysql = require ('mysql');

const conexion = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12345678',
    database: 'calculadora'
});

// Se establece la conexión de la BD
conexion.connect((error) => {
    if (error) {
        console.error('Error de conexión:', error.stack);
        return;
    }
    console.log('Conexión establecida con el ID:', conexion.threadId);
});

// Exporta la conexión creada como un módulo
module.exports = conexion;