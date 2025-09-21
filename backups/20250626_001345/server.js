const express = require('express');
const morgan = require('morgan');
const app = express();
const port = process.env.PORT || 3000;

app.use(morgan('combined'));

// health check
app.get('/health', (_req, res) => res.status(200).send('OK'));

// root endpoint
app.get('/', (_req, res) => res.send('Hello from GotReferences!'));

app.listen(port, () => {
  console.log(`🚀 Listening on port ${port}`);
});
app.use(cors({ origin: "*" }));
