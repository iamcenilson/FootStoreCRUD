const mysql = require('mysql');

// Configurações da conexão com o banco de dados
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'FutStore',
};

// Cria a conexão com o banco de dados
const connection = mysql.createConnection(dbConfig);

// Conecta ao banco de dados
connection.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados: ' + err.stack);
        return;
    }
    console.log('Bem conectado com a base de dados.');
});

module.exports = connection;