const Review = require("../models/Review");

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

const seedReviews = async () => {
  try {
    // Check if reviews already exist
    const existingReviews = await Review.countDocuments();
    
    if (existingReviews === 0) {
      console.log("[seedReviews] Seeding default reviews...");
      const result = await Review.insertMany(defaultReviews);
      console.log(`[seedReviews] Successfully seeded ${result.length} default reviews`);
    } else {
      console.log(`[seedReviews] Database already contains ${existingReviews} reviews, skipping seed`);
    }
  } catch (error) {
    console.error("[seedReviews] Error seeding reviews:", error.message || error);
  }
};

module.exports = seedReviews;
