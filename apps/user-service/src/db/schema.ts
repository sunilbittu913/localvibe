import {
  pgTable,
  pgEnum,
  varchar,
  text,
  integer,
  serial,
  boolean,
  timestamp,
  decimal,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ============================================
// ENUMS
// ============================================

/**
 * PostgreSQL enum for user roles.
 */
export const userRoleEnum = pgEnum("user_role", [
  "normal_user",
  "business_user",
  "admin",
]);

/**
 * PostgreSQL enum for job types.
 */
export const jobTypeEnum = pgEnum("job_type", [
  "full_time",
  "part_time",
  "contract",
  "internship",
  "freelance",
]);

/**
 * PostgreSQL enum for experience levels.
 */
export const experienceLevelEnum = pgEnum("experience_level", [
  "fresher",
  "junior",
  "mid",
  "senior",
  "lead",
]);

/**
 * PostgreSQL enum for message types.
 */
export const messageTypeEnum = pgEnum("message_type", [
  "text",
  "image",
  "file",
]);

/**
 * PostgreSQL enum for discount types.
 */
export const discountTypeEnum = pgEnum("discount_type", [
  "percentage",
  "flat",
  "bogo",
  "freebie",
]);

/**
 * PostgreSQL enum for post/listing approval status.
 * Used by Super Admin to control visibility of content in the mobile app.
 */
export const postStatusEnum = pgEnum("post_status", [
  "pending",
  "approved",
  "rejected",
]);

// ============================================
// USERS TABLE
// ============================================

/**
 * Users table - stores all registered users of the platform.
 * Supports three roles: normal_user, business_user, and admin.
 */
export const users = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    uuid: varchar("uuid", { length: 36 }).notNull().unique(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    phone: varchar("phone", { length: 20 }),
    password: varchar("password", { length: 255 }).notNull(),
    firstName: varchar("first_name", { length: 100 }).notNull(),
    lastName: varchar("last_name", { length: 100 }),
    avatar: varchar("avatar", { length: 500 }),
    role: userRoleEnum("role").notNull().default("normal_user"),
    isActive: boolean("is_active").notNull().default(true),
    isEmailVerified: boolean("is_email_verified").notNull().default(false),
    isPhoneVerified: boolean("is_phone_verified").notNull().default(false),
    lastLoginAt: timestamp("last_login_at"),
    refreshToken: text("refresh_token"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    emailIdx: uniqueIndex("email_idx").on(table.email),
    uuidIdx: uniqueIndex("uuid_idx").on(table.uuid),
    phoneIdx: index("phone_idx").on(table.phone),
    roleIdx: index("role_idx").on(table.role),
  })
);

// ============================================
// CATEGORIES TABLE
// ============================================

/**
 * Categories table - stores top-level business categories.
 * Examples: Restaurants, Healthcare, Education, etc.
 */
export const categories = pgTable(
  "categories",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 100 }).notNull().unique(),
    slug: varchar("slug", { length: 120 }).notNull().unique(),
    description: text("description"),
    icon: varchar("icon", { length: 255 }),
    isActive: boolean("is_active").notNull().default(true),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    slugIdx: uniqueIndex("slug_idx").on(table.slug),
    activeIdx: index("active_idx").on(table.isActive),
  })
);

// ============================================
// SUBCATEGORIES TABLE
// ============================================

/**
 * Subcategories table - stores subcategories under each main category.
 * Examples: Under "Restaurants" -> "North Indian", "South Indian", "Chinese", etc.
 */
export const subcategories = pgTable(
  "subcategories",
  {
    id: serial("id").primaryKey(),
    categoryId: integer("category_id").notNull(),
    name: varchar("name", { length: 100 }).notNull(),
    slug: varchar("slug", { length: 120 }).notNull(),
    description: text("description"),
    icon: varchar("icon", { length: 255 }),
    isActive: boolean("is_active").notNull().default(true),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    categoryIdx: index("category_idx").on(table.categoryId),
    slugIdx: index("subcategory_slug_idx").on(table.slug),
  })
);

// ============================================
// BUSINESSES TABLE
// ============================================

/**
 * Businesses table - stores business profiles created by business users.
 * Contains all business information including location data for geo-queries.
 */
export const businesses = pgTable(
  "businesses",
  {
    id: serial("id").primaryKey(),
    uuid: varchar("uuid", { length: 36 }).notNull().unique(),
    ownerId: integer("owner_id").notNull(),
    categoryId: integer("category_id").notNull(),
    subcategoryId: integer("subcategory_id"),
    name: varchar("name", { length: 200 }).notNull(),
    slug: varchar("slug", { length: 220 }).notNull().unique(),
    description: text("description"),
    phone: varchar("phone", { length: 20 }),
    email: varchar("email", { length: 255 }),
    website: varchar("website", { length: 500 }),

    // Address fields
    addressLine1: varchar("address_line_1", { length: 255 }),
    addressLine2: varchar("address_line_2", { length: 255 }),
    city: varchar("city", { length: 100 }),
    state: varchar("state", { length: 100 }),
    pincode: varchar("pincode", { length: 10 }),
    country: varchar("country", { length: 100 }).default("India"),

    // Location coordinates for geo-based queries
    latitude: decimal("latitude", { precision: 10, scale: 8 }),
    longitude: decimal("longitude", { precision: 11, scale: 8 }),

    // Business details
    logo: varchar("logo", { length: 500 }),
    coverImage: varchar("cover_image", { length: 500 }),
    openingTime: varchar("opening_time", { length: 10 }),
    closingTime: varchar("closing_time", { length: 10 }),
    workingDays: varchar("working_days", { length: 100 }),

    // Status and metrics
    isActive: boolean("is_active").notNull().default(true),
    isVerified: boolean("is_verified").notNull().default(false),
    status: postStatusEnum("status").notNull().default("pending"),
    rejectionReason: text("rejection_reason"),
    averageRating: decimal("average_rating", { precision: 3, scale: 2 }).default("0.00"),
    totalReviews: integer("total_reviews").notNull().default(0),

    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    ownerIdx: index("owner_idx").on(table.ownerId),
    categoryIdx: index("business_category_idx").on(table.categoryId),
    subcategoryIdx: index("business_subcategory_idx").on(table.subcategoryId),
    cityIdx: index("city_idx").on(table.city),
    stateIdx: index("state_idx").on(table.state),
    pincodeIdx: index("pincode_idx").on(table.pincode),
    activeIdx: index("business_active_idx").on(table.isActive),
    slugIdx: uniqueIndex("business_slug_idx").on(table.slug),
    latLngIdx: index("lat_lng_idx").on(table.latitude, table.longitude),
  })
);

// ============================================
// REVIEWS TABLE
// ============================================

/**
 * Reviews table - stores user reviews and ratings for businesses.
 * Each user can leave one review per business.
 */
export const reviews = pgTable(
  "reviews",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id").notNull(),
    businessId: integer("business_id").notNull(),
    rating: integer("rating").notNull(), // 1-5 stars
    title: varchar("title", { length: 200 }),
    comment: text("comment"),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    userIdx: index("review_user_idx").on(table.userId),
    businessIdx: index("review_business_idx").on(table.businessId),
    ratingIdx: index("review_rating_idx").on(table.rating),
  })
);

// ============================================
// JOBS TABLE
// ============================================

/**
 * Jobs table - stores job postings created by business users.
 * Supports various job types and salary ranges relevant to the Indian market.
 */
export const jobs = pgTable(
  "jobs",
  {
    id: serial("id").primaryKey(),
    uuid: varchar("uuid", { length: 36 }).notNull().unique(),
    businessId: integer("business_id").notNull(),
    title: varchar("title", { length: 200 }).notNull(),
    description: text("description").notNull(),
    jobType: jobTypeEnum("job_type").notNull().default("full_time"),
    experienceLevel: experienceLevelEnum("experience_level").default("fresher"),
    salaryMin: decimal("salary_min", { precision: 12, scale: 2 }),
    salaryMax: decimal("salary_max", { precision: 12, scale: 2 }),
    salaryCurrency: varchar("salary_currency", { length: 3 }).default("INR"),
    location: varchar("location", { length: 255 }),
    isRemote: boolean("is_remote").notNull().default(false),
    skills: text("skills"), // JSON array of required skills
    isActive: boolean("is_active").notNull().default(true),
    status: postStatusEnum("status").notNull().default("pending"),
    rejectionReason: text("rejection_reason"),
    expiresAt: timestamp("expires_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    businessIdx: index("job_business_idx").on(table.businessId),
    jobTypeIdx: index("job_type_idx").on(table.jobType),
    activeIdx: index("job_active_idx").on(table.isActive),
    statusIdx: index("job_status_idx").on(table.status),
    locationIdx: index("job_location_idx").on(table.location),
  })
);

// ============================================
// MESSAGES TABLE
// ============================================

/**
 * Messages table - stores chat messages between users and businesses.
 * Supports a conversation thread model with read receipts.
 */
export const messages = pgTable(
  "messages",
  {
    id: serial("id").primaryKey(),
    uuid: varchar("uuid", { length: 36 }).notNull().unique(),
    conversationId: varchar("conversation_id", { length: 36 }).notNull(),
    senderId: integer("sender_id").notNull(),
    receiverId: integer("receiver_id").notNull(),
    businessId: integer("business_id"),
    content: text("content").notNull(),
    messageType: messageTypeEnum("message_type").notNull().default("text"),
    isRead: boolean("is_read").notNull().default(false),
    readAt: timestamp("read_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => ({
    conversationIdx: index("conversation_idx").on(table.conversationId),
    senderIdx: index("message_sender_idx").on(table.senderId),
    receiverIdx: index("message_receiver_idx").on(table.receiverId),
    businessIdx: index("message_business_idx").on(table.businessId),
    readIdx: index("message_read_idx").on(table.isRead),
  })
);

// ============================================
// OFFERS TABLE
// ============================================

/**
 * Offers table - stores special offers and deals created by businesses.
 * Supports percentage and flat discount types with validity periods.
 */
export const offers = pgTable(
  "offers",
  {
    id: serial("id").primaryKey(),
    uuid: varchar("uuid", { length: 36 }).notNull().unique(),
    businessId: integer("business_id").notNull(),
    title: varchar("title", { length: 200 }).notNull(),
    description: text("description"),
    discountType: discountTypeEnum("discount_type").notNull().default("percentage"),
    discountValue: decimal("discount_value", { precision: 10, scale: 2 }),
    minOrderValue: decimal("min_order_value", { precision: 10, scale: 2 }),
    maxDiscount: decimal("max_discount", { precision: 10, scale: 2 }),
    couponCode: varchar("coupon_code", { length: 50 }),
    termsAndConditions: text("terms_and_conditions"),
    image: varchar("image", { length: 500 }),
    isActive: boolean("is_active").notNull().default(true),
    status: postStatusEnum("status").notNull().default("pending"),
    rejectionReason: text("rejection_reason"),
    startsAt: timestamp("starts_at").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    businessIdx: index("offer_business_idx").on(table.businessId),
    activeIdx: index("offer_active_idx").on(table.isActive),
    statusIdx: index("offer_status_idx").on(table.status),
    expiresIdx: index("offer_expires_idx").on(table.expiresAt),
    couponIdx: index("offer_coupon_idx").on(table.couponCode),
  })
);

// ============================================
// RELATIONS
// ============================================

/**
 * User relations - defines how users connect to other entities.
 */
export const usersRelations = relations(users, ({ many }) => ({
  businesses: many(businesses),
  reviews: many(reviews),
  sentMessages: many(messages, { relationName: "sender" }),
  receivedMessages: many(messages, { relationName: "receiver" }),
}));

/**
 * Category relations - categories have many subcategories and businesses.
 */
export const categoriesRelations = relations(categories, ({ many }) => ({
  subcategories: many(subcategories),
  businesses: many(businesses),
}));

/**
 * Subcategory relations - each subcategory belongs to one category.
 */
export const subcategoriesRelations = relations(subcategories, ({ one, many }) => ({
  category: one(categories, {
    fields: [subcategories.categoryId],
    references: [categories.id],
  }),
  businesses: many(businesses),
}));

/**
 * Business relations - businesses connect to owners, categories, reviews, jobs, etc.
 */
export const businessesRelations = relations(businesses, ({ one, many }) => ({
  owner: one(users, {
    fields: [businesses.ownerId],
    references: [users.id],
  }),
  category: one(categories, {
    fields: [businesses.categoryId],
    references: [categories.id],
  }),
  subcategory: one(subcategories, {
    fields: [businesses.subcategoryId],
    references: [subcategories.id],
  }),
  reviews: many(reviews),
  jobs: many(jobs),
  offers: many(offers),
  messages: many(messages),
}));

/**
 * Review relations - each review belongs to a user and a business.
 */
export const reviewsRelations = relations(reviews, ({ one }) => ({
  user: one(users, {
    fields: [reviews.userId],
    references: [users.id],
  }),
  business: one(businesses, {
    fields: [reviews.businessId],
    references: [businesses.id],
  }),
}));

/**
 * Job relations - each job belongs to a business.
 */
export const jobsRelations = relations(jobs, ({ one }) => ({
  business: one(businesses, {
    fields: [jobs.businessId],
    references: [businesses.id],
  }),
}));

/**
 * Message relations - messages connect senders, receivers, and optionally businesses.
 */
export const messagesRelations = relations(messages, ({ one }) => ({
  sender: one(users, {
    fields: [messages.senderId],
    references: [users.id],
    relationName: "sender",
  }),
  receiver: one(users, {
    fields: [messages.receiverId],
    references: [users.id],
    relationName: "receiver",
  }),
  business: one(businesses, {
    fields: [messages.businessId],
    references: [businesses.id],
  }),
}));

/**
 * Offer relations - each offer belongs to a business.
 */
export const offersRelations = relations(offers, ({ one }) => ({
  business: one(businesses, {
    fields: [offers.businessId],
    references: [businesses.id],
  }),
}));
