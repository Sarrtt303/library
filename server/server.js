const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const bookRoutes = require('./routes/bookRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const User = require('./models/User'); // Example model for testing

dotenv.config();

// Initialize the app
const app = express();

// Apply CORS middleware globally 
app.use(cors({
    origin: ['http://127.0.0.1:5173'], // Specify allowed origins
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Specify allowed headers
    credentials: true // Handle cookies or HTTP authentication if necessary
}));

// Middleware for parsing JSON request bodies
app.use(express.json());

// MongoDB connection to library database
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};

let transactionConnection;
//Connact to transactions databse
const connectTransactionsDB = async () => {
    if (!transactionConnection) { // Only connect if there's no existing connection
      try {
        transactionConnection = mongoose.createConnection(process.env.MONGO_URI_TRANSACTIONS, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
        console.log(`Transactions Database Connected`);
      } catch (error) {
        console.error(`Error connecting to Transactions Database: ${error.message}`);
        throw error; // Propagate error
      }
    }
    return transactionConnection; // Return the existing connection
  };

// Connect to the database and start the server
(async () => {
  await connectDB();

  // Default route
  app.get('/', (req, res) => {
    res.send('Welcome to the Book Management API');
    
  });

  

  // Use routes
  app.use('/api/users', userRoutes);
  app.use('/api/books', bookRoutes);
  
  //handle connection for transaction route
  const transactionConnection=await connectTransactionsDB();
  app.use('/api/transactions',   transactionRoutes(transactionConnection));

  // Start the server
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
})();
