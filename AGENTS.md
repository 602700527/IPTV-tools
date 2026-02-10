# AGENTS.md

This file contains comprehensive coding guidelines, build commands, and best practices for agentic development in this Cloudflare Workers TV streaming service project.

## Build and Development Commands

### Development Commands

```bash
# Start development server with hot reload
npm run dev
# Equivalent: wrangler dev

# Deploy to production
npm run deploy
# Equivalent: wrangler publish

# View real-time logs
npm run tail
# Equivalent: wrangler tail

# Initialize database (run once)
npm run init-db
# Equivalent: wrangler d1 execute tv-service-db --file=./schema.sql

# Database console access for manual queries
npm run db:console
# Equivalent: wrangler d1 execute tv-service-db --command

# Test database connectivity
curl -H "X-Admin-Key: admin-key-please-change-in-production" \
  http://localhost:8787/api/test/db?key=admin-key-please-change-in-production
```

### Testing Commands

```bash
# Test database connection
wrangler d1 execute tv-service-db "SELECT 1;" --command

# Test individual handlers (use curl with wrangler dev)
# Test admin functionality
curl -H "X-Admin-Key: admin-key-please-change-in-production" http://localhost:8787/admin/sources

# Test public API endpoints
curl http://localhost:8787/api/config
curl http://localhost:8787/api/channels

# Test authentication flow
curl -X POST http://localhost:8787/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'

# Test scheduled tasks (local development only)
curl http://localhost:8787/test/force-scheduled
curl http://localhost:8787/test/sync
curl http://localhost:8787/test/cache

# Run specific tests
npm test  # If test suite exists
```

## Code Conventions and Standards

### Import Patterns

```javascript
// Use consistent import patterns
import { getDB, createTables } from './database.js';
import { handleAdminRequest } from './handlers/admin.js';
import { ACCOUNT_HTML } from './account-page.js';

// Named imports for clarity
import { 
  getDB, 
  createTables, 
  fetchAndParseM3U 
} from './database.js';
```

### Variable Naming Conventions

```javascript
// Use camelCase for variables and functions
const adminKey = request.headers.get('X-Admin-Key');
const userInfo = await db.prepare('SELECT * FROM users WHERE id = ?').bind(userId).first();
const paymentConfig = await db.prepare('SELECT * FROM payment_methods WHERE type = ? AND enabled = 1').bind('paypal').first();

// Use descriptive names
const totalOrders = orderCountResult.count;
const isActive = source.is_active ? '启用' : '禁用';
const userSession = getUserSession(token);

// Constants use SCREAMING_SNAKE_CASE
const CACHE_TTL = 3600; // 1 hour
const MAX_FAILED_ATTEMPTS = 5;
const ADMIN_KEY_MIN_LENGTH = 32;
```

### Error Handling Patterns

```javascript
// Always handle errors gracefully and provide meaningful responses
try {
  const result = await apiRequest('/admin/mall/payment-methods');
  return new Response(JSON.stringify(result), {
    headers: { 'Content-Type': 'application/json' }
  });
} catch (error) {
  console.error('Failed to load payment methods:', error);
  return new Response(JSON.stringify({
    success: false,
    error: 'Failed to load payment methods'
  }), {
    status: 500,
    headers: { 'Content-Type': 'application/json' }
  });
}
```

### Response Format Standards

```javascript
// Success responses
return new Response(JSON.stringify({
  success: true,
  data: result,
  message: 'Operation completed successfully'
}), {
  headers: { 'Content-Type': 'application/json' }
});

// Error responses
return new Response(JSON.stringify({
  success: false,
  error: 'Specific error message',
  code: 'VALIDATION_ERROR' // Optional error codes
}), {
  status: 400, // Use appropriate HTTP status codes
  headers: { 'Content-Type': 'application/json' }
});
```

### Database Operations

```javascript
// Always use prepared statements for security
const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
const result = await stmt.bind(email).first();

// Use transactions for multiple operations
await db.batch([
  db.prepare('INSERT INTO user_orders (...)').bind(...),
  db.prepare('UPDATE codes SET status = ? WHERE id = ?').bind(...)
]);

// Handle database errors
try {
  await db.prepare('INSERT INTO payment_methods (...)').run();
} catch (error) {
  console.error('Database operation failed:', error);
  throw error;
}
```

### Security Best Practices

```javascript
// Validate admin key
const adminKey = request.headers.get('X-Admin-Key');
if (adminKey !== env.ADMIN_KEY) {
  return new Response('Unauthorized', { status: 401 });
}

// Sanitize user inputs
const email = sanitizeInput(requestData.email);
const description = sanitizeHtml(userInput.description);

// Use parameterized queries to prevent SQL injection
const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
```

### File Organization

```
cfworker2/
├── handlers/           # Request handlers
│   ├── admin.js        # Admin API endpoints
│   ├── auth.js         # Authentication & user management
│   ├── live.js        # Live streaming
│   ├── public.js       # Public APIs
│   ├── scheduler.js    # Scheduled tasks
│   ├── subscription-api.js  # Payment processing
│   └── freesub-api.js  # Free subscriptions
├── pages/             # Static HTML content
├── utils/              # Utility functions
│   ├── cache.js         # KV caching
│   └── channel-cache.js  # Channel caching
├── database.js          # Database operations
├── migrations/          # Database schema
├── assets.js           # Static assets (SVG, etc.)
├── worker.js            # Main entry point
└── *.html              # Page HTML content files
```

### Environment Variables

```bash
# Core configuration
ADMIN_KEY="your-admin-key"
DB="tv-service-db"
TIMEZONE="Asia/Shanghai"
APP_URL="https://your-domain.com"

# PayPal configuration (being migrated to database)
PAYPAL_CLIENT_ID="your-paypal-client-id"
PAYPAL_CLIENT_SECRET="your-paypal-secret"
PAYPAL_MODE="sandbox" # or "live"

# Email configuration
RESEND_API_KEY="your-resend-api-key"
FROM_EMAIL="support@your-domain.com"
```

## Development Workflow

### 1. Local Development
```bash
# Start with environment variables
wrangler dev --env .env

# Use wrangler.toml for complex configurations
wrangler dev --config wrangler.toml
```

### 2. Database Migrations
```bash
# Create new migration file
# 001_add_user_system.sql
# 002_add_payment_methods.sql
# etc.

# Run migration
wrangler d1 execute tv-service-db --file=./migrations/003_add_payment_methods.sql
```

### 3. Testing Strategy

```bash
# Test individual components
wrangler dev --test admin-key

# Integration testing
curl -X POST http://localhost:8787/api/admin/mall/payment-methods \
  -H "X-Admin-Key: admin-key-please-change-in-production" \
  -H "Content-Type: application/json" \
  -d '{"type":"alipay","name":"Alipay","enabled":true}'
```

## Code Style Guidelines

### Formatting Standards
- **2 spaces** for indentation (no tabs)
- **No trailing semicolons** 
- **Single quotes** for string literals, template literals for interpolation
- **Consistent spacing** around operators and after commas

### Naming Conventions
- **camelCase** for variables and functions: `getUserInfo()`, `const userName`
- **PascalCase** for classes/components: `UserAccount`, `AdminPanel`
- **SCREAMING_SNAKE_CASE** for constants: `MAX_ATTEMPTS`, `CACHE_TTL`
- **kebab-case** for URLs and headers: `/api/auth/login`, `X-Admin-Key`

### ES Modules
- Use `export` for all functions and constants
- Use `import` with explicit file paths
- Avoid global variables (use environment variables instead)

### Async/Await
```javascript
// Always use async/await for database operations
const users = await db.prepare('SELECT * FROM users').all();
const order = await db.prepare('SELECT * FROM user_orders WHERE id = ?').bind(orderId).first();

// Use Promise.all for parallel operations
const [user, orders] = await Promise.all([
  getUserById(userId),
  getOrdersByUserId(userId)
]);
```

### Logging
```javascript
// Use structured logging
console.log('[PayPal] Order created:', paypalOrderId, 'for user:', userId);

// Include timestamps and context
console.log(`[${new Date().toISOString()}] [Payment] Processing order ${orderId} for user ${userId}`);

// Error logging with context
console.error('[HandlerName] Operation failed:', error.message, error.stack);
```

## API Design Patterns

### RESTful Endpoints
```javascript
// Admin endpoints
GET  /admin/sources           // List sources
POST /admin/sources          // Create source
PUT  /admin/sources/{id}      // Update source
DELETE /admin/sources/{id}   // Delete source

// User endpoints  
POST /api/auth/login        // User authentication
GET  /api/auth/user          // Get user info
POST /api/auth/register      // User registration

// Mall endpoints
GET  /admin/mall/settings     // Get mall settings
PUT  /admin/mall/settings     // Update mall settings
GET  /admin/mall/payment-methods  // List payment methods
POST /admin/mall/payment-methods // Create payment method
PUT /admin/mall/payment-methods/{id} // Update payment method
DELETE /admin/mall/payment-methods/{id} // Delete payment method
```

## Performance Optimization

### Caching Strategy
```javascript
// Cache frequently accessed data
const CACHE_TTL = 3600; // 1 hour
const cacheKey = `config:${configType}`;

// Implement cache invalidation
await env.KV.delete(cacheKey);
```

### Bundle Optimization
```javascript
// Dynamic imports for better tree-shaking
const { getDB } = await import('./database.js');

// Use wrangler bundle analysis
wrangler dev --compatibility-date=2023-01-01
```

### Database Operations
- Batch inserts: Every batch of 500 records
- Index optimization: Create indexes on key fields
- Connection pool: Singleton pattern for connection management

### Concurrency Handling
- Async operations: ctx.waitUntil() for non-blocking responses
- Batch operations: Reduce API call frequency
- Connection reuse: Singleton database connection

## Security Considerations

### 1. Input Validation
```javascript
// Always validate and sanitize inputs
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function sanitizeInput(input) {
  if (typeof input !== 'string') return '';
  return input.replace(/<[^>]*>?/g, '').trim();
}
```

### 2. Authentication & Authorization
```javascript
// Use strong admin keys
const ADMIN_KEY_MIN_LENGTH = 32;
const ADMIN_KEY_REQUIRED_ENTROPY = true;

// Implement session management
const SESSION_EXPIRE_SECONDS = 3600; // 1 hour
const MAX_FAILED_ATTEMPTS = 5;
```

### 3. Error Handling
```javascript
// Never expose internal error details to clients
const ERROR_MESSAGES = {
  INTERNAL_ERROR: 'An internal error occurred',
  VALIDATION_ERROR: 'Invalid input provided',
  UNAUTHORIZED: 'Authentication required'
};

// Use generic error responses
return new Response(JSON.stringify({
  success: false,
  error: ERROR_MESSAGES.VALIDATION_ERROR
}), { status: 400 });
```

## Testing Checklist

### Before Deploying
- [ ] Database migrations tested locally
- [ ] Admin functions tested manually
- [ ] Payment processing tested in sandbox
- [ ] Authentication flow verified
- [ ] CORS headers properly configured
- [ ] Environment variables validated
- [ ] Error handling tested with invalid inputs

### Performance Testing
- [ ] Load tested with 1000+ records
- [ ] Concurrent user requests tested
- [ ] Cache hit/miss ratios measured
- [ ] Database query optimization verified
- [ ] Memory usage monitored during development

## Notes for Agentic Development

### Agent Coordination
This project is well-structured for agentic development with clear separation between:

1. **Admin Interface** (`handlers/admin.js`) - Configuration management
2. **User Management** (`handlers/auth.js`) - Authentication and accounts  
3. **Payment Processing** (`handlers/subscription-api.js`) - PayPal integration
4. **Public APIs** (`handlers/public.js`) - External access
5. **Database Layer** (`database.js`) - Data persistence
6. **Static Content** (`*.html` files) - Frontend pages

### Key Files for Agent Understanding
- `worker.js` - Main router and request handling
- `database.js` - Schema and data operations
- `admin-page.js` - Admin interface HTML and JavaScript
- `handlers/admin.js` - Admin API implementation
- `handlers/subscription-api.js` - Payment method management

This project uses Cloudflare Workers with D1 database and KV storage, making it ideal for serverless deployment with proper error handling and caching strategies.