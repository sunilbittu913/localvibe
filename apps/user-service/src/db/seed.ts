import { v4 as uuidv4 } from "uuid";
import { db, poolConnection } from "../config/database";
import { users, categories, subcategories } from "./schema";
import { PasswordService } from "../services/password.service";

/**
 * Database Seed Script
 *
 * Populates the database with initial data for development and testing.
 * Includes: admin user, sample categories, and subcategories relevant to India.
 *
 * Usage: npx tsx src/db/seed.ts
 */
async function seed(): Promise<void> {
  console.log("🌱 Seeding database...");

  try {
    // ============================================
    // SEED ADMIN USER
    // ============================================
    console.log("  → Creating admin user...");
    const adminPassword = await PasswordService.hash("Admin@123456");

    await db.insert(users).values({
      uuid: uuidv4(),
      email: "admin@localvibe.in",
      password: adminPassword,
      firstName: "LocalVibe",
      lastName: "Admin",
      phone: "9999999999",
      role: "admin",
      isActive: true,
      isEmailVerified: true,
      isPhoneVerified: true,
    });

    // ============================================
    // SEED CATEGORIES
    // ============================================
    console.log("  → Creating categories...");

    const categoryData = [
      { name: "Restaurants & Food", slug: "restaurants-food", description: "Restaurants, cafes, street food, and catering services", icon: "🍽️", sortOrder: 1 },
      { name: "Healthcare", slug: "healthcare", description: "Hospitals, clinics, pharmacies, and wellness centers", icon: "🏥", sortOrder: 2 },
      { name: "Education", slug: "education", description: "Schools, coaching centers, tutors, and training institutes", icon: "📚", sortOrder: 3 },
      { name: "Shopping & Retail", slug: "shopping-retail", description: "Shops, malls, supermarkets, and online stores", icon: "🛍️", sortOrder: 4 },
      { name: "Home Services", slug: "home-services", description: "Plumbing, electrical, cleaning, and home repair services", icon: "🔧", sortOrder: 5 },
      { name: "Beauty & Wellness", slug: "beauty-wellness", description: "Salons, spas, gyms, and beauty parlours", icon: "💇", sortOrder: 6 },
      { name: "Automotive", slug: "automotive", description: "Car dealers, mechanics, car wash, and auto parts", icon: "🚗", sortOrder: 7 },
      { name: "Real Estate", slug: "real-estate", description: "Properties, PG accommodations, and real estate agents", icon: "🏠", sortOrder: 8 },
      { name: "Professional Services", slug: "professional-services", description: "Lawyers, CAs, consultants, and financial advisors", icon: "💼", sortOrder: 9 },
      { name: "Events & Entertainment", slug: "events-entertainment", description: "Event planners, DJs, photographers, and venues", icon: "🎉", sortOrder: 10 },
      { name: "Travel & Tourism", slug: "travel-tourism", description: "Travel agencies, hotels, and tour operators", icon: "✈️", sortOrder: 11 },
      { name: "Technology & IT", slug: "technology-it", description: "IT services, software companies, and tech support", icon: "💻", sortOrder: 12 },
    ];

    await db.insert(categories).values(categoryData);

    // ============================================
    // SEED SUBCATEGORIES
    // ============================================
    console.log("  → Creating subcategories...");

    // Fetch inserted categories to get their IDs
    const insertedCategories = await db.query.categories.findMany();
    const categoryMap = new Map(insertedCategories.map((c) => [c.slug, c.id]));

    const subcategoryData = [
      // Restaurants & Food
      { categoryId: categoryMap.get("restaurants-food")!, name: "North Indian", slug: "north-indian", sortOrder: 1 },
      { categoryId: categoryMap.get("restaurants-food")!, name: "South Indian", slug: "south-indian", sortOrder: 2 },
      { categoryId: categoryMap.get("restaurants-food")!, name: "Chinese", slug: "chinese", sortOrder: 3 },
      { categoryId: categoryMap.get("restaurants-food")!, name: "Street Food", slug: "street-food", sortOrder: 4 },
      { categoryId: categoryMap.get("restaurants-food")!, name: "Bakery & Sweets", slug: "bakery-sweets", sortOrder: 5 },
      { categoryId: categoryMap.get("restaurants-food")!, name: "Cafes", slug: "cafes", sortOrder: 6 },

      // Healthcare
      { categoryId: categoryMap.get("healthcare")!, name: "Hospitals", slug: "hospitals", sortOrder: 1 },
      { categoryId: categoryMap.get("healthcare")!, name: "Clinics", slug: "clinics", sortOrder: 2 },
      { categoryId: categoryMap.get("healthcare")!, name: "Pharmacies", slug: "pharmacies", sortOrder: 3 },
      { categoryId: categoryMap.get("healthcare")!, name: "Dentists", slug: "dentists", sortOrder: 4 },
      { categoryId: categoryMap.get("healthcare")!, name: "Ayurveda & Homeopathy", slug: "ayurveda-homeopathy", sortOrder: 5 },

      // Education
      { categoryId: categoryMap.get("education")!, name: "Schools", slug: "schools", sortOrder: 1 },
      { categoryId: categoryMap.get("education")!, name: "Coaching Centers", slug: "coaching-centers", sortOrder: 2 },
      { categoryId: categoryMap.get("education")!, name: "Private Tutors", slug: "private-tutors", sortOrder: 3 },
      { categoryId: categoryMap.get("education")!, name: "Skill Training", slug: "skill-training", sortOrder: 4 },

      // Shopping & Retail
      { categoryId: categoryMap.get("shopping-retail")!, name: "Clothing & Fashion", slug: "clothing-fashion", sortOrder: 1 },
      { categoryId: categoryMap.get("shopping-retail")!, name: "Electronics", slug: "electronics", sortOrder: 2 },
      { categoryId: categoryMap.get("shopping-retail")!, name: "Grocery & Kirana", slug: "grocery-kirana", sortOrder: 3 },
      { categoryId: categoryMap.get("shopping-retail")!, name: "Furniture", slug: "furniture", sortOrder: 4 },

      // Home Services
      { categoryId: categoryMap.get("home-services")!, name: "Plumbing", slug: "plumbing", sortOrder: 1 },
      { categoryId: categoryMap.get("home-services")!, name: "Electrical", slug: "electrical", sortOrder: 2 },
      { categoryId: categoryMap.get("home-services")!, name: "Cleaning", slug: "cleaning", sortOrder: 3 },
      { categoryId: categoryMap.get("home-services")!, name: "Pest Control", slug: "pest-control", sortOrder: 4 },
      { categoryId: categoryMap.get("home-services")!, name: "Painting", slug: "painting", sortOrder: 5 },

      // Beauty & Wellness
      { categoryId: categoryMap.get("beauty-wellness")!, name: "Hair Salons", slug: "hair-salons", sortOrder: 1 },
      { categoryId: categoryMap.get("beauty-wellness")!, name: "Spas", slug: "spas", sortOrder: 2 },
      { categoryId: categoryMap.get("beauty-wellness")!, name: "Gyms & Fitness", slug: "gyms-fitness", sortOrder: 3 },
      { categoryId: categoryMap.get("beauty-wellness")!, name: "Yoga Centers", slug: "yoga-centers", sortOrder: 4 },
    ];

    await db.insert(subcategories).values(subcategoryData);

    console.log("✅ Database seeded successfully!");
    console.log("   Admin credentials: admin@localvibe.in / Admin@123456");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
  } finally {
    await poolConnection.end();
    process.exit(0);
  }
}

seed();
