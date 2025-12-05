import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/mazeid';
    const maxRetries = 5;
    const retryDelay = 2000; // 2 seconds

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const conn = await mongoose.connect(mongoURI, {
                serverSelectionTimeoutMS: 5000,
            });
            console.log(`✓ MongoDB Connected: ${conn.connection.host}`);
            return;
        } catch (error) {
            console.error(`✗ MongoDB connection attempt ${attempt}/${maxRetries} failed: ${(error as Error).message}`);
            
            if (attempt === maxRetries) {
                console.error('\n❌ Failed to connect to MongoDB after all retry attempts.');
                console.error('\n💡 To fix this, try one of the following:');
                console.error('   1. Start MongoDB service: sudo systemctl start mongodb');
                console.error('   2. Run the helper script: ./start-mongodb.sh');
                console.error('   3. Use Docker: docker run -d -p 27017:27017 --name mongodb mongo:latest');
                console.error('   4. Start MongoDB manually: mongod --dbpath ~/mongo-data/db\n');
                process.exit(1);
            }
            
            console.log(`   Retrying in ${retryDelay / 1000} seconds...\n`);
            await new Promise(resolve => setTimeout(resolve, retryDelay));
        }
    }
};

export default connectDB;
