import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(
      `MongoDB connected to expense-tracker: ${conn.connection.host}`,
    );
  } catch (error) {
    console.error(`DB connection error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
