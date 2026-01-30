# Deployment Guide

Complete guide for deploying HoneyMoney to production.

## Prerequisites

- Node.js 18+ installed
- MongoDB Atlas account (or self-hosted MongoDB)
- Git repository
- Domain name (optional)

---

## Backend Deployment

### Option 1: Heroku

1. **Create a Heroku app**:

```bash
heroku create honeymoney-api
```

2. **Set environment variables**:

```bash
heroku config:set MONGODB_URI="your-mongodb-connection-string"
heroku config:set JWT_SECRET="your-super-secret-key"
heroku config:set NODE_ENV=production
heroku config:set ADMIN_EMAIL="admin@yourdomain.com"
heroku config:set ADMIN_PASSWORD="secure-password"
```

3. **Deploy**:

```bash
git subtree push --prefix backend heroku main
```

### Option 2: Railway

1. **Connect your GitHub repo** at [railway.app](https://railway.app)
2. **Select the backend directory** as the root
3. **Add environment variables** in the Railway dashboard
4. **Deploy** automatically on push

### Option 3: DigitalOcean App Platform

1. **Create a new app** from your GitHub repo
2. **Configure build settings**:
   - Build Command: `npm install && npm run build`
   - Run Command: `npm start`
   - Source Directory: `/backend`
3. **Add environment variables**
4. **Deploy**

---

## Frontend Deployment

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI**:

```bash
npm i -g vercel
```

2. **Deploy**:

```bash
vercel
```

3. **Set environment variable**:
   - Go to Vercel dashboard → Settings → Environment Variables
   - Add `API_URL` with your backend URL

### Option 2: Netlify

1. **Build the app**:

```bash
npm run build
```

2. **Deploy**:

```bash
netlify deploy --prod --dir=dist/honey-money/browser
```

3. **Configure environment**:
   - Add `API_URL` in Netlify dashboard

### Option 3: GitHub Pages

1. **Update `angular.json`** base href:

```json
"baseHref": "/HoneyMoney/"
```

2. **Build**:

```bash
npm run build -- --base-href /HoneyMoney/
```

3. **Deploy with gh-pages**:

```bash
npx angular-cli-ghpages --dir=dist/honey-money/browser
```

---

## Environment Configuration

### Backend `.env` (Production)

```bash
PORT=3000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/honeymoney
NODE_ENV=production
JWT_SECRET=your-very-long-random-secret-key-min-32-chars
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=VerySecurePassword123!
```

### Frontend Environment

Update `src/environments/environment.ts`:

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://your-backend-url.com/api',
};
```

---

## MongoDB Atlas Setup

1. **Create a cluster** at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. **Whitelist IP addresses**:
   - Go to Network Access
   - Add `0.0.0.0/0` (allow from anywhere) or specific IPs
3. **Create database user**:
   - Go to Database Access
   - Create a user with read/write permissions
4. **Get connection string**:
   - Click "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password

---

## Security Checklist

- [ ] Change default admin password
- [ ] Use strong JWT secret (min 32 characters)
- [ ] Enable HTTPS on both frontend and backend
- [ ] Configure CORS to only allow your frontend domain
- [ ] Set up rate limiting (see Production Roadmap)
- [ ] Enable MongoDB authentication
- [ ] Use environment variables for all secrets
- [ ] Set `NODE_ENV=production`

---

## CORS Configuration

Update `backend/src/server-app.ts`:

```typescript
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'https://yourdomain.com',
    credentials: true,
  }),
);
```

Add to `.env`:

```bash
FRONTEND_URL=https://yourdomain.com
```

---

## Monitoring

### Backend Health Check

```bash
curl https://your-backend-url.com/health
```

Expected response:

```json
{
  "status": "ok",
  "message": "HoneyMoney API is running"
}
```

### Logging

The backend logs all requests with timestamps. In production, consider:

- **Winston** or **Pino** for structured logging
- **LogDNA**, **Papertrail**, or **Loggly** for log aggregation
- **Sentry** for error tracking

---

## Troubleshooting

### "Cannot connect to MongoDB"

- Check your MongoDB Atlas IP whitelist
- Verify connection string in `.env`
- Ensure database user has correct permissions

### "CORS error"

- Update CORS configuration to allow your frontend domain
- Check that `FRONTEND_URL` is set correctly

### "Invalid token"

- Verify `JWT_SECRET` is the same across all backend instances
- Check token expiration (default 7 days)

---

## Scaling

### Horizontal Scaling

- Use a load balancer (e.g., Nginx, AWS ALB)
- Deploy multiple backend instances
- Use Redis for session storage (if needed)

### Database Optimization

- Add indexes to frequently queried fields
- Use MongoDB connection pooling
- Consider read replicas for heavy read workloads

---

## Backup Strategy

### MongoDB Backups

- Enable automatic backups in MongoDB Atlas
- Schedule: Daily with 7-day retention
- Test restore process monthly

### Code Backups

- Use Git for version control
- Tag releases: `git tag v1.0.0`
- Keep production branch separate from development
