import AI from './ai.js';
import express from 'express';

const server = express();
server.use(express.json());

server.post('/wines', async (req, res) => {
  if (process.env.NODE_ENV !== 'test') {
    console.log(`Request to /wines received: ${req.body.message}`);
  }
  
  try {
    const completionResponse = await AI.send(req.body.message);
    res.json(completionResponse);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default server;