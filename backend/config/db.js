const mongoose = require('mongoose');
const dbURI = 'mongodb://localhost:27017/your_database_name'; // Replace with your MongoDB URI  

const connectDB = async () => {
    try {
        await mongoose.connect(dbURI, {
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
};

module.exports = connectDB;