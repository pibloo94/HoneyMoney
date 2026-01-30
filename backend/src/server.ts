import { connectDB } from './config/database.js';
import { app } from './server-app.js';
import { seedAdmin } from './seed-admin.js';

const PORT = process.env.PORT || 3000;

// Connect to MongoDB and seed admin user
connectDB().then(() => {
  seedAdmin();
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
