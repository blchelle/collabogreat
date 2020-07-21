import express from 'express';

// Create app
const app = express();
app.use(express.json());
app.get('/api', (_, res) => res.status(200).json({ message: 'hello brock2' }));

export default app;
