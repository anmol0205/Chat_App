const mongoose = require('mongoose');

const connectToMongoDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://anmolgaur005:anmol%402005@mycluster01.jimvzb2.mongodb.net/Users', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 50000 // Increase timeout to 50 seconds
        });
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
};

module.exports = connectToMongoDB;
