const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

// Origins explicitly listed in CLIENT_URL env var (comma-separated)
const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',').map((o) => o.trim())
  : [];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow server-to-server / curl requests (no Origin header)
      if (!origin) return callback(null, true);

      const isAllowed =
        // Explicitly listed origins from env
        allowedOrigins.includes(origin) ||
        // Any localhost port (local dev)
        /^http:\/\/localhost:\d+$/.test(origin) ||
        /^http:\/\/127\.0\.0\.1:\d+$/.test(origin) ||
        // All Vercel deployments (preview + production)
        /^https:\/\/[\w-]+\.vercel\.app$/.test(origin) ||
        // All Render deployments
        /^https:\/\/[\w-]+\.onrender\.com$/.test(origin);

      if (isAllowed) {
        callback(null, true);
      } else {
        console.warn(`CORS blocked origin: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/resumes', require('./routes/resumeRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));

app.get('/', (req, res) => {
  res.send('Resumify API is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));