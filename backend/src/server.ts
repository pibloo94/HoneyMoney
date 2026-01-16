import { connectDB } from './config/database.js';
import { app } from './server-app.js';

const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
