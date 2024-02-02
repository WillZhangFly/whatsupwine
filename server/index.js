import server from './server.js';
import express from 'express';

server.use(express.static('./public'));
server.use(express.static('./dist'));

const PORT = process.env.PORT || 7000;

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});