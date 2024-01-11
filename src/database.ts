import mongoose from 'mongoose';

const connectToDatabase = async () => {
    try {
        const MONGODB_URI = "mongodb+srv://vlodgalstyan:zECYoVpMxgvfKmeg@poems.gqiuc7d.mongodb.net/?retryWrites=true&w=majority"
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
};

export { connectToDatabase, mongoose };
