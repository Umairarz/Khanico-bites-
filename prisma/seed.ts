import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL || "admin@khanicobites.com";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || "ChangeMe123!";
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  await prisma.admin.upsert({
    where: { email: adminEmail },
    update: {},
    create: { name: "Khanico Admin", email: adminEmail, passwordHash },
  });

  const categories = [
    { name: "Burgers", slug: "burgers", sortOrder: 1 },
    { name: "Pizza", slug: "pizza", sortOrder: 2 },
    { name: "Fried Chicken", slug: "fried-chicken", sortOrder: 3 },
    { name: "Wraps & Rolls", slug: "wraps-rolls", sortOrder: 4 },
    { name: "Sides", slug: "sides", sortOrder: 5 },
    { name: "Beverages", slug: "beverages", sortOrder: 6 },
  ];

  const createdCategories: Record<string, string> = {};
  for (const c of categories) {
    const cat = await prisma.category.upsert({
      where: { slug: c.slug },
      update: {},
      create: c,
    });
    createdCategories[c.slug] = cat.id;
  }

  const products = [
    {
      name: "Chili Smash Burger",
      slug: "chili-smash-burger",
      description: "Double smashed beef patty, chili mayo, pickles, cheddar, brioche bun.",
      price: 850,
      imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800",
      categorySlug: "burgers",
      isFeatured: true,
    },
    {
      name: "Zinger Stack Burger",
      slug: "zinger-stack-burger",
      description: "Crispy fried chicken thigh, slaw, garlic sauce, toasted bun.",
      price: 780,
      imageUrl: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=800",
      categorySlug: "burgers",
      isFeatured: false,
    },
    {
      name: "Peri Peri Pizza",
      slug: "peri-peri-pizza",
      description: "Peri peri chicken, bell peppers, mozzarella, 12-inch hand-tossed base.",
      price: 1450,
      imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800",
      categorySlug: "pizza",
      isFeatured: true,
    },
    {
      name: "Tikka Loaded Pizza",
      slug: "tikka-loaded-pizza",
      description: "Chicken tikka, onions, jalapenos, cheese blend, 12-inch base.",
      price: 1550,
      imageUrl: "https://images.unsplash.com/photo-1548369937-47519962c11a?w=800",
      categorySlug: "pizza",
      isFeatured: false,
    },
    {
      name: "Crispy Fried Chicken Bucket",
      slug: "crispy-fried-chicken-bucket",
      description: "8-piece hand-breaded fried chicken, house spice blend.",
      price: 1900,
      imageUrl: "https://images.unsplash.com/photo-1562967914-608f82629710?w=800",
      categorySlug: "fried-chicken",
      isFeatured: true,
    },
    {
      name: "Spicy Chicken Wrap",
      slug: "spicy-chicken-wrap",
      description: "Grilled spicy chicken, lettuce, garlic sauce, soft tortilla.",
      price: 550,
      imageUrl: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=800",
      categorySlug: "wraps-rolls",
      isFeatured: false,
    },
    {
      name: "Loaded Cheese Fries",
      slug: "loaded-cheese-fries",
      description: "Crinkle-cut fries, melted cheddar, jalapenos, chili mayo drizzle.",
      price: 480,
      imageUrl: "https://images.unsplash.com/photo-1585109649139-366815a0d713?w=800",
      categorySlug: "sides",
      isFeatured: false,
    },
    {
      name: "Classic Soda 500ml",
      slug: "classic-soda-500ml",
      description: "Ice-cold soft drink, 500ml bottle.",
      price: 150,
      imageUrl: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=800",
      categorySlug: "beverages",
      isFeatured: false,
    },
  ];

  for (const p of products) {
    const { categorySlug, ...rest } = p;
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: { ...rest, categoryId: createdCategories[categorySlug] },
    });
  }

  console.log("Seed complete.");
  console.log(`Admin login -> email: ${adminEmail}  password: ${adminPassword}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
