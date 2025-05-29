// Import routes
const authRoutes = require('./routes/authRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const workspaceRoutes = require('./routes/workspaceRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const userRoutes = require('./routes/userRoutes');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/workspaces', workspaceRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/users', userRoutes); 