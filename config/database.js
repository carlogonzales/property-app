import mongoose from 'mongoose';

let connected = false;

const connectToDatabase = async () => {
    mongoose.set('strictQuery', true);

    if (connected) {
        console.log('Already connected to the database.');
        return;
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI);
        connected = true;
        console.log('Connected to the MongoDB successfully.');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
};

export default connectToDatabase;