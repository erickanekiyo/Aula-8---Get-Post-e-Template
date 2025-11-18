const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 80;

//Configurar EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

//"Banco de dados" em memória
let usuarios = [];

// ===== ROTAS PRINCIPAIS =====

// Rota padrão direciona para projetos
app.get('/', (req, res) => {
    res.redirect('/Projects.html');
});

// ===== ROTAS ESTÁTICAS =====

app.get('/Home.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/html/index.html'));
});

app.get('/Projects.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/html/projects.html'));
});

app.get('/Animation.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/html/animation.html'));
});

app.get('/Copy.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/html/copy.html'));
});

app.get('/Guess.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/html/guess.html'));
});

app.get('/Canvas.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/html/canvas.html'));
});

// ===== ROTAS DE CADASTRO E LOGIN =====

// Página de cadastro
app.get('/cadastra', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/html/cadastro.html'));
});

// Página de login
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/html/login.html'));
});

// Processar cadastro
app.post('/cadastrar', (req, res) => {
    const { nome, email, senha } = req.body;
    
    // Validar dados
    if (!nome || !email || !senha) {
        return res.render('resposta', { 
            status: 'erro',
            mensagem: 'Todos os campos são obrigatórios!',
            cor: '#ff4444'
        });
    }
    
    // Verificar se usuário já existe
    const usuarioExistente = usuarios.find(user => user.email === email);
    if (usuarioExistente) {
        return res.render('resposta', { 
            status: 'erro',
            mensagem: 'Este email já está cadastrado!',
            cor: '#ff4444'
        });
    }
    
    // Salvar usuário
    usuarios.push({ nome, email, senha });
    
    res.render('resposta', { 
        status: 'sucesso',
        mensagem: `Cadastro realizado com sucesso! Bem-vindo, ${nome}!`,
        cor: '#44ff44'
    });
});

// Processar login
app.post('/logar', (req, res) => {
    const { email, senha } = req.body;
    
    // Validar dados
    if (!email || !senha) {
        return res.render('resposta', { 
            status: 'erro',
            mensagem: 'Email e senha são obrigatórios!',
            cor: '#ff4444'
        });
    }
    
    // Verificar credenciais
    const usuario = usuarios.find(user => user.email === email && user.senha === senha);
    
    if (usuario) {
        res.render('resposta', { 
            status: 'sucesso',
            mensagem: `Login realizado com sucesso! Bem-vindo de volta, ${usuario.nome}!`,
            cor: '#44ff44'
        });
    } else {
        res.render('resposta', { 
            status: 'erro',
            mensagem: 'Email ou senha incorretos!',
            cor: '#ff4444'
        });
    }
});

// ===== ROTAS PARA ARQUIVOS ESTÁTICOS =====

app.get('/style.css', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/style/style.css'));
});

app.get('/img/:imageName', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/img', req.params.imageName));
});

// ===== ROTA DE FALLBACK =====
app.get('*', (req, res) => {
    res.status(404).send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Página Não Encontrada</title>
            <style>
                body { 
                    font-family: "Inter", sans-serif;
                    background: linear-gradient(180deg, #0f111a, #181b25);
                    color: #e4e6eb;
                    text-align: center;
                    padding: 50px;
                }
                h1 { color: #6ab7ff; }
                a { color: #6ab7ff; text-decoration: none; }
                a:hover { text-decoration: underline; }
            </style>
        </head>
        <body>
            <h1>Página Não Encontrada</h1>
            <p><a href="/">Voltar para a página inicial</a></p>
        </body>
        </html>
    `);
});

// ===== INICIAR SERVIDOR =====
app.listen(PORT, '0.0.0.0', () => {
    const localIP = getLocalIP();
    console.log('='.repeat(60));
    console.log('🚀 SISTEMA DE CADASTRO/LOGIN RODANDO!');
    console.log('='.repeat(60));
    console.log(`📍 Porta: ${PORT}`);
    console.log(`📍 Local: http://localhost:${PORT}`);
    console.log(`📍 Rede:  http://${localIP}:${PORT}`);
    console.log('='.repeat(60));
    console.log('📁 PÁGINAS DISPONÍVEIS:');
    console.log(`   • http://localhost:${PORT}/ (Redireciona para Projetos)`);
    console.log(`   • http://localhost:${PORT}/cadastra`);
    console.log(`   • http://localhost:${PORT}/login`);
    console.log(`   • http://localhost:${PORT}/Projects.html`);
    console.log('='.repeat(60));
});

function getLocalIP() {
    const { networkInterfaces } = require('os');
    const nets = networkInterfaces();
    
    for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
            if (net.family === 'IPv4' && !net.internal) {
                return net.address;
            }
        }
    }
    return 'SEU_IP_LOCAL';
}