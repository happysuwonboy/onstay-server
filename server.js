import express from 'express';
import cors from 'cors'

const server = express();
const port = 8000

server.use(cors())
server.use(express.json());
server.use(express.urlencoded());


server.listen(8000, ()=>{console.log(`listening on ${port}`)})