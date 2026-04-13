import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';
import taskRoutes from './routes/task.routes.js';
import './config/env.js';

const app = express();
const PORT = process.env.PORT || 3000;

// ==================== CONFIGURAÇÃO DO SWAGGER ====================
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'PulseTasks API',
      version: '1.0.0',
      description: 'API RESTful do gerenciador de tarefas PulseTasks',
    },
    servers: [
      { url: `https://pulsetasks-kedk.onrender.com` }
    ],
  },
  apis: ['./src/routes/*.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

// ==================== MIDDLEWARES ====================
app.use(cors());
app.use(express.json());

// ==================== ROTA RAIZ (para não dar Cannot GET /) ====================
app.get('/', (req, res) => {
  res.send(`
    <h1>🚀 PulseTasks API - Online</h1>
    <p>A API está funcionando corretamente.</p>
    <p><strong>Documentação Swagger:</strong> <a href="/api-docs" target="_blank">/api-docs</a></p>
    <p><strong>Endpoint de tarefas:</strong> /api/v1/tasks</p>
  `);
});

// ==================== DOCUMENTAÇÃO SWAGGER ====================
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// ==================== ROTAS ====================
app.use('/api/v1/tasks', taskRoutes);

// ==================== MIDDLEWARE DE ERRO ====================
app.use((err, req, res, next) => {
  console.error('❌ Erro:', err.message);
  if (err.message === 'NOT_FOUND') {
    return res.status(404).json({ error: 'Tarefa não encontrada' });
  }
  res.status(500).json({ error: 'Erro interno do servidor' });
});

// ==================== INICIAR SERVIDOR ====================
app.listen(PORT, () => {
  console.log(`🚀 Servidor PulseTasks rodando em http://localhost:${PORT}`);
  console.log(`📡 API disponível em https://pulsetasks-kedk.onrender.com/api/v1/tasks`);
  console.log(`📘 Documentação Swagger: https://pulsetasks-kedk.onrender.com/api-docs`);
});