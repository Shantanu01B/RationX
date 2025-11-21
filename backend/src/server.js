require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

connectDB(process.env.MONGO_URI);

app.use(cors());
app.use(express.json());

// routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/health', require('./routes/health'));
// after other routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/auth', require('./routes/otpRoutes')); // add this line
app.use('/api/health', require('./routes/health'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/qr', require('./routes/qrRoutes'));
app.use("/api/dealer-stock", require("./routes/dealerStockRoutes"));
app.use('/api/slot', require('./routes/slotRoutes'));
app.use('/api/complaint', require('./routes/complaintRoutes'));
app.use('/api/admin/analytics', require('./routes/adminAnalyticsRoutes'));
app.use('/api/admin/auth', require('./routes/adminAuthRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));
app.use('/api/notification', require('./routes/notificationRoutes'));






app.get('/', (req, res) => res.send('RationX backend running'));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));