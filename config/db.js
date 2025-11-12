import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const mongoUrl = process.env.MONGO_URL;
    
    console.log("🔍 Debug: Checking MongoDB URL...");
    console.log("MONGO_URL exists:", mongoUrl ? "YES" : "NO");
    
    if (!mongoUrl) {
      console.log("❌ MONGO_URL environment variable is not set!");
      console.log("Available env vars starting with 'M':", 
        Object.keys(process.env).filter(key => key.startsWith('M')).join(', ') || 'none');
      process.exit(1);
    }
    
    await mongoose.connect(mongoUrl);
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.log("❌ MongoDB Connection Error:", error.message);
    process.exit(1);
  }
};

export default connectDB;
