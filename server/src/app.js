
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');


// Middlewares
const errorHandler = require('./middleware/error.middleware');
const notFound = require('./middleware/notFound.middleware');

// Swagger Docs
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

const app = express();

const { API_VERSION } = require('./config/env')

// Trust Proxy (for rate limiting and secure cookies)
app.set('trust proxy', 1);

//  Security Headers

app.use(helmet());
app.use(hpp());

// CORS Configuration
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);

//  Rate Limiting

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests. Please try again later.',
  },
});

app.use('/api', apiLimiter);

// Compression

app.use(compression());

// Logging

app.use(
  morgan(
    process.env.NODE_ENV === 'production'
      ? 'combined'
      : 'dev'
  )
);

// Body Parsers

app.use(
  express.json({
    limit: '10mb',
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: '10mb',
  })
);

// Cookie Parser

app.use(cookieParser());

// Health Check Endpoint

app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    application: 'RentEase API',
    status: 'UP',
    environment: process.env.NODE_ENV || 'development',
    uptime: {
      seconds: Math.floor(process.uptime()),
    },
    timestamp: new Date().toISOString(),
  });
});

// Root Route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'RentEase API Running',
  });
});

// Swagger Docs
if (process.env.NODE_ENV !== 'production') {
  app.use(
    '/api/docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
  );
}

// Routes
app.use(`${API_VERSION}/auth`, require('./modules/auth/auth.routes'));

app.use(`${API_VERSION}/users`, require('./modules/users/user.routes'));

app.use(`${API_VERSION}/products`, require('./modules/products/product.routes'));

app.use(`${API_VERSION}/orders`, require('./modules/orders/order.routes'));

app.use(`${API_VERSION}/rentals`, require('./modules/rentals/rental.routes'));

app.use(`${API_VERSION}/maintenance`, require('./modules/maintenance/maintenance.routes'));
// 404 Handler
app.use(notFound);

// Global Error Handler 
app.use(errorHandler);

module.exports = app;