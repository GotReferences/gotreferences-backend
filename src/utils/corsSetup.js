const cors = require('cors');

const corsOptions = {
  origin: ['http://localhost:3001', 'https://gotreferences.org', 'https://www.gotreferences.org'],
  credentials: true,
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
};

module.exports = cors(corsOptions);
