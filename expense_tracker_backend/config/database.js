import mongoose from 'mongoose';

const MONGODB_URI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}/${process.env.DB_NAME}`;
const connectDb = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`Database connected successfully ${conn.connection.host}`);
        console.log(`Database name ${conn.connection.name}`);
    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
        process.exit(1);
    }
};

process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('🔴 MongoDB connection closed due to app termination');
    process.exit(0);
});

export default connectDb;