import express from 'express';
import cors from 'cors';

const server = express();
const PORT = 8000;

server.use(cors());
server.use(express.json());
server.use(express.urlencoded());


server.listen(PORT, ()=>{console.log(`listening on ${PORT}`)});