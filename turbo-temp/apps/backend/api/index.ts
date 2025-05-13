import express from 'express';

const app = express();
const port = process.env.PORT || 3001;

app.get('/', (req, res) => {
  res.send('Web IDE Display API Server');
});

app.listen(port, () => {
  console.log(`API server listening on port ${port}`);
});