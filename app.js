const mysql = require("mysql");
const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const connection = require('./db');
const raiz = "C:\Users\Cenilson Canguila\Desktop\SiteFutStore";

app.use(express.static(raiz))
app.use(express.static(path.join(raiz,"/views/public/home")))
app.use("/views", express.static("views"))
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use("/assets", express.static("assets"))
app.use("/home", express.static("home"))
app.use("/views", express.static("views"))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
bodyParser.urlencoded({ extended: true })
app.use(express.static(path.join(__dirname, 'public')))


// Redirecionar a raiz para a página de login
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});


//1 - PRIMEIRO CRUD: LOGIN AND REGISTER

// Rota padrão para o arquivo index.html
app.get('/index.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home', 'index.html'));
});

// Rota para processamento do login
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Verifica se o usuário e senha foram fornecidos
    if (!username || !password) {
        return res.status(400).json({ error: 'Nome de equipa e senha são obrigatórios' });
    }

    // Consulta ao banco de dados para buscar o usuário
    const query = 'SELECT * FROM equipas WHERE username = ? AND password = ?';
    connection.query(query, [username, password], (err, results) => {
        if (err) {
            console.error('Erro ao verificar equipa: ', err);
            return res.status(500).json({ error: 'Erro ao verificar equipa' });
        }

        // Se o usuário foi encontrado
        if (results.length > 0) {
            res.status(200).json({ success: 'Login bem-sucedido' });
        } else {
            res.status(401).json({ error: 'Nome de equipa ou senha inválidos' });
        }
    });
});



// Rota GET para servir o formulário de cadastro
app.get('/cadastro.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home','cadastro.html'));
});

app.post('/cadastro', (req, res) => {
    const { username, password, number } = req.body;

    // Verificação de campos obrigatórios
    if (!username || !password || !number) {
        console.log('Campos obrigatórios não preenchidos:', { username, password, number });
        return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    // Log dos dados recebidos
    console.log('Dados recebidos:', { username, password, number });

    const query = 'INSERT INTO equipas (username, password, number) VALUES (?, ?, ?)';

    connection.query(query, [username, password, number], (err, results) => {
        if (err) {
            console.error('Erro ao cadastrar equipa: ', err);
            return res.status(500).json({ error: 'Erro ao cadastrar equipa' });
        }

        console.log('Equipa cadastrado com sucesso:', results);
        res.status(201).json({ success: 'Equipa cadastrada com sucesso' });
    });
});

// Rota GET para visualizar equipas
app.get('/display', (req, res) => {
    const sql = 'SELECT * FROM equipas';
    connection.query(sql, (err, results) => {
        if (err) {
            console.error("Erro ao consultar Equipas: " + err.message);
            res.status(500).send("Erro ao consultar Equipas");
            return;
        }

        res.render('display', { equipas: results });
    });
});

// Rota GET para actualizar equipas
app.get('/update/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'SELECT * FROM equipas WHERE id = ?';
    connection.query(sql, [id], (err, results) => {
        if (err) {
            console.error("Erro ao consultar Equipas: " + err.message);
            res.status(500).send("Erro ao consultar Equipas");
            return;
        }

        res.render('update', { equipas: results });
    });
});

app.post('/updateData/:id', (req, res) => {
    const id = req.params.id;
    const username = req.body.username;
    const number = req.body.number;
    const password = req.body.password;

    const sql = 'UPDATE equipas SET username = ?, number = ?, password = ? WHERE id = ?';
    connection.query(sql, [username, number, password, id], (err, result) => {
        if (err) {
            console.error("Erro ao atualizar Equipa: " + err.message);
            res.status(500).send("Erro ao atualizar Equipa");
            return;
        }

        console.log("Equipa atualizado com sucesso.");
        res.redirect('/display');
    });
});


app.get('/delete/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'DELETE FROM equipas WHERE id = ?';
    connection.query(sql, [id], (err, result) => {
        if (err) {
            console.error("Erro ao deletar Equipa: " + err.message);
            res.status(500).send("Erro ao deletar Equipa");
            return;
        }

        console.log("Equipa deletado com sucesso.");
        res.redirect('/display');
    });
});

//2 - SEGUNDO CRUD: PRODUTO

// Rota GET para servir o formulário de cadastro
app.get('/cadastrar_produtos.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home', 'cadastrar_produtos.html'));
});

// Rota POST para inserir dados na tabela produtos
app.post('/cadastrar_produto', (req, res) => {
    const { nome, descricao, preco, estoque, id_fornecedores, id_categorias_produto } = req.body;

    // Verificação de campos obrigatórios
    if (!nome || !descricao || !estoque || !id_fornecedores || !id_categorias_produto) {
        console.log('Campos obrigatórios não preenchidos:', { nome, descricao, preco, estoque, id_fornecedores, id_categorias_produto });
        return res.status(400).json({ error: 'Todos os campos obrigatórios devem ser preenchidos' });
    }

    // Log dos dados recebidos
    console.log('Dados recebidos:', { nome, descricao, preco, estoque, id_fornecedores, id_categorias_produto });

    const query = 'INSERT INTO produtos (nome, descricao, preco, estoque, id_fornecedores, id_categorias_produto) VALUES (?, ?, ?, ?, ?, ?)';

    connection.query(query, [nome, descricao, preco, estoque, id_fornecedores, id_categorias_produto], (err, results) => {
        if (err) {
            console.error('Erro ao cadastrar produto: ', err);
            return res.status(500).json({ error: 'Erro ao cadastrar produto' });
        }

        console.log('Produto cadastrado com sucesso:', results);
        res.status(201).json({ success: 'Produto cadastrado com sucesso' });
    });
});


// Rota para exibir todos os produtos
app.get('/display1', (req, res) => {
    const sql = 'SELECT * FROM produtos';
    connection.query(sql, (err, results) => {
        if (err) {
            console.error("Erro ao consultar Produtos: " + err.message);
            res.status(500).send("Erro ao consultar Produtos");
            return;
        }

        console.log('Produtos recuperados:', results); // Para depuração
        res.render('display1', { produtos: results });
    });
});


// Rota GET para actualizar equipas
app.get('/update1/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'SELECT * FROM produtos WHERE id = ?';
    connection.query(sql, [id], (err, results) => {
        if (err) {
            console.error("Erro ao consultar Produtos: " + err.message);
            res.status(500).send("Erro ao consultar Produtos");
            return;
        }

        res.render('update1', { produtos: results });
    });
});


// Rota para atualizar um produto
app.post('/update1Data/:id', (req, res) => {
    const id = req.params.id;
    const { nome, descricao, preco, estoque, id_fornecedores, id_categorias_produto } = req.body;

    const sql = 'UPDATE produtos SET nome = ?, descricao = ?, preco = ?, estoque = ?, id_fornecedores = ?, id_categorias_produto = ? WHERE id = ?';
    connection.query(sql, [nome, descricao, preco, estoque, id_fornecedores, id_categorias_produto, id], (err, result) => {
        if (err) {
            console.error("Erro ao atualizar Produto: " + err.message);
            res.status(500).send("Erro ao atualizar Produto");
            return;
        }

        console.log("Produto atualizado com sucesso.");
        res.redirect('/display1');
    });
});

// Rota para deletar um produto
app.get('/delete1/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'DELETE FROM produtos WHERE id = ?';
    connection.query(sql, [id], (err, result) => {
        if (err) {
            console.error("Erro ao deletar Produto: " + err.message);
            res.status(500).send("Erro ao deletar Produto");
            return;
        }

        console.log("Produto deletado com sucesso.");
        res.redirect('/display1');
    });
});


// Rota padrão para o arquivo painel.html
app.get('/painel.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home', 'painel.html'));
});

app.get('/cadastrar_produtos.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home', 'cadastrar_produtos.html'));
});

app.get('/produtos_fornecedores', (req, res) => {
    const sql = 'SELECT * FROM view_produtos_fornecedores';
    connection.query(sql, (err, results) => {
        if (err) {
            console.error("Erro ao consultar a view: " + err.message);
            res.status(500).send("Erro ao consultar a view");
            return;
        }

        res.render('produtos_fornecedores', { produtos_fornecedores: results });
    });
});

//Procedimento de alterar preço do produto
app.get('/alterar_preco_produto', (req, res) => {
    connection.query('CALL alterar_preco_produto', (error, results) => {
        if (error) {
            return res.status(500).send(err);
        }
        res.json(results[0]);
    });
});

// Iniciar o servidor Express na porta 
const PORT = process.env.PORT || 5000;
app.listen(PORT, function () {
    console.log(`Servidor tá lá bem ligado na porta: http://localhost:${PORT}/`);
});