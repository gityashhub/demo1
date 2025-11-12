import "dotenv/config";

console.log("=== Environment Debug ===");
console.log("MONGO_URL:", process.env.MONGO_URL ? "EXISTS (length: " + process.env.MONGO_URL.length + ")" : "UNDEFINED");
console.log("JWT_SECRET:", process.env.JWT_SECRET ? "EXISTS" : "UNDEFINED");
console.log("PORT:", process.env.PORT || "not set");
console.log("========================");
