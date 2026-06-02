const mongoose = require("mongoose");
require("dotenv").config();

const Review = require("../models/Review");

const clearAndSeedReviews = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("[clearAndSeed] Connected to MongoDB");

    // Clear existing reviews
    await Review.deleteMany({});
    console.log("[clearAndSeed] Cleared all reviews");

    const defaultReviews = [
      {
        name: "Venkatesh",
        email: "venkatesh@example.com",
        service: "Printer Repair",
        rating: 5,
        message: "Very good service! They fixed my printer quickly and perfectly. The team is very helpful and professional. Highly recommended!",
        approved: true,
        featured: false,
        createdAt: new Date("2024-05-20"),
      },
      {
        name: "Ranjith",
        email: "ranjith@example.com",
        service: "Website Hosting",
        rating: 5,
        message: "Great website hosting service! My website is very fast and secure now. Excellent support team and very good customer service.",
        approved: true,
        featured: false,
        createdAt: new Date("2024-05-18"),
      },
      {
        name: "Pravalika",
        email: "pravalika@example.com",
        service: "Laptop Repair",
        rating: 4,
        message: "Good laptop repair service! They fixed my laptop very well and quickly. Very happy with their work and professional service.",
        approved: true,
        featured: false,
        createdAt: new Date("2024-05-16"),
      },
      {
        name: "Ganesh",
        email: "ganesh@example.com",
        service: "Hardware Changes",
        rating: 5,
        message: "Amazing work! They changed my laptop hardware perfectly. Very professional team and good quality parts. Very satisfied!",
        approved: true,
        featured: false,
        createdAt: new Date("2024-05-14"),
      },
    ];

    // Insert default reviews
    const result = await Review.insertMany(defaultReviews);
    console.log(`[clearAndSeed] Successfully seeded ${result.length} default reviews`);

    await mongoose.connection.close();
    console.log("[clearAndSeed] Database connection closed");
    process.exit(0);
  } catch (error) {
    console.error("[clearAndSeed] Error:", error.message || error);
    process.exit(1);
  }
};

clearAndSeedReviews();
