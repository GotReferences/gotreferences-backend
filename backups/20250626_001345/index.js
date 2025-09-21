function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Access denied" });
  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = user;
    next();
  });
}
import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import { authenticate } from './utils/cognitoAuth.js';
import { sequelize, models } from './db/index.js';

// Import your route modules
import userRoutes from './routes/users.js';
import projectRoutes from './routes/projects.js';
import blogRoutes from './routes/blog.js';

const app = express();

// Global middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('combined'));

// Public routes
app.get('/api/health', (req, res) => res.status(200).json({ status: 'ok' }));

// Cognito-protected API
app.use('/api/users', authenticate, userRoutes);
app.use('/api/projects', authenticate, projectRoutes);

// Blog routes (public read, auth write)
app.use('/api/blog', blogRoutes);

// Serve static frontend
app.use(express.static('public'));
app.get('*', (req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

// Sync DB and start server
sequelize.sync()
  .then(() => {
    console.log('DB synced.');
    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`Backend listening on ${port}`));
  })
  .catch(err => console.error('DB sync error:', err.message));

