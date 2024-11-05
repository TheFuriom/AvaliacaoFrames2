import express from 'express';
import houseRoutes from './routes/HouseRoutes.js';
import cors from 'cors';

const app = express();

// Usar CORS
app.use(cors());

// Usar JSON no corpo da requisição
app.use(express.json());

// Rota para o cadastro de casas
app.use('/houses', houseRoutes);

app.listen(5000, () => { 
    console.log('Servidor Express rodando na porta 5000'); 
});
