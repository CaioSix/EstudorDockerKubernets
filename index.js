const express = require('express');
const { Client } = require('pg');
const { exec } = require('child_process');
const prometheus = require('prom-client');
const path = require('path');
const exphbs = require('express-handlebars'); // Importe o Handlebars

const app = express();
const port = 3000;

// Configuração do Handlebars
app.engine('handlebars', exphbs.engine({ defaultLayout: false })); // Define o mecanismo de template
app.set('view engine', 'handlebars'); // Define o mecanismo de visualização como Handlebars
app.set('views', path.join(__dirname, 'templates')); // Define o diretório dos templates

// Configuração do Prometheus
const register = new prometheus.Registry();
prometheus.collectDefaultMetrics({ register });

// Rota principal
app.get('/', async (req, res) => {
    const client = new Client({
        host: process.env.DATABASE_HOST,
        database: process.env.DATABASE_NAME,
        user: process.env.DATABASE_USER,
        port: process.env.DATABASE_PORT,
        password: process.env.DATABASE_PASS,
    });

    try {
        await client.connect();
        const testDb = "e Banco conectado com sucesso    ";

        exec('hostname', (error, stdout, stderr) => {
            if (error) {
                console.error(`Erro ao executar comando: ${error.message}`);
                return res.status(500).send('Erro ao executar comando');
            }

            const dCommand = stdout.trim();
            const dResult = dCommand + testDb;

            // Renderiza o template index.handlebars
            res.render('index', { d_output: dResult });
        });
    } catch (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        const errTestDb = " e o BANCO deu RUIM    ";

        exec('hostname', (error, stdout, stderr) => {
            if (error) {
                console.error(`Erro ao executar comando: ${error.message}`);
                return res.status(500).send('Erro ao executar comando');
            }

            const dCommand = stdout.trim();
            const dResult = dCommand + errTestDb;

            // Renderiza o template erro.handlebars
            res.render('erro', { d_output: dResult });
        });
    } finally {
        await client.end();
    }
});

// Rota para métricas do Prometheus
app.get('/metrics', async (req, res) => {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
});

// Iniciar o servidor
app.listen(port, '0.0.0.0', () => {
    console.log(`Servidor rodando em http://0.0.0.0:${port}`);
});