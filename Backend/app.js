const express = require('express');
// Middleware, procesa solicitudes json y codificados en url
const bodyParser = require('body-parser');
const connection = require('./conexionBD');
// Módulo para manejar rutas de archivos
const path = require('path'); 

const app = express();
const PORT = process.env.PORT || 3000;

// Se configura express para usar (bodyParser) y permite que pueda trabajar con solicitudes json y codificados url
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Servir archivos estáticos desde el directorio 'frontend'
app.use(express.static(path.join(__dirname, '../frontend')));

// Ruta principal del backend
app.get('/', (req, res) => {
    res.send('API de calculadora');
});

// Endpoint para realizar cálculos y guardar en la base de datos
app.post('/calcular', (req, res) => {
    const { operacion, resultado } = req.body;

    // Se guarda la operación en la base de datos
    const sql = 'INSERT INTO historial_calculadora (operacion, resultado) VALUES (?, ?)';
    connection.query(sql, [operacion, resultado], (err, result) => {
        if (err) {
            console.error('Error al insertar en la base de datos:', err);
            return res.status(500).send('Error interno al guardar la operación');
        }
        console.log('Operación guardada en la base de datos:', result);
        res.status(200).send('Operación guardada correctamente');
    });
});

// Endpoint para obtener el historial de operaciones
app.get('/historial', (req, res) => {
    connection.query('SELECT * FROM historial_calculadora', (err, rows) => {
        if (err) {
            console.error('Error al consultar la base de datos:', err);
            return res.status(500).send('Error interno al obtener el historial');
        }
        res.json(rows); // Devolver los registros del historial en formato JSON
    });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor backend de calculadora iniciado en http://localhost:${PORT}`);
});