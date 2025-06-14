import mongoose from "mongoose";

class Database {
  static async connection() {
    let dbUrl = process.env.DB_URL || "mongodb://127.0.0.1:27017/esite";
    try {
      await mongoose.connect(dbUrl);
      console.log("Database connected sucessfully");
    } catch (error) {
      console.log("Database Error", error);
    }
  }
}
export default Database;
