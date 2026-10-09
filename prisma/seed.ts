import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

async function main() {
  // Path to JSON server (file)
  const jsonPath = path.join(process.cwd(), "server", "products.json");
  // Data as raw JSON string
  const rawData = fs.readFileSync(jsonPath, "utf-8");
  // Extract categories and products from the parsed JSON data
  const { categories, products } = JSON.parse(rawData);

  // Delete existing data to avoid conflicts
  await prisma.reviews.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  // Insert categories into the database, needs to be done before inserting products due to foreign key constraints
  await prisma.category.createMany({
    data: categories.map((cat: any) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      image: cat.image,
    })),
  });

  await prisma.$transaction(
    products.map((prod: any) =>
      prisma.product.create({
        data: {
          id: prod.id,
          title: prod.title,
          description: prod.description,
          // Category foreign key
          categoryId: prod.categoryId,
          price: prod.price,
          discountPercentage: prod.discountPercentage,
          rating: prod.rating,
          stock: prod.stock,
          tags: prod.tags || [],
          brand: prod.brand,
          sku: prod.sku,
          weight: prod.weight,
          // Flattened dimensions
          width: prod.dimensions?.width,
          height: prod.dimensions?.height,
          depth: prod.dimensions?.depth,
          warrantyInformation: prod.warrantyInformation,
          shippingInformation: prod.shippingInformation,
          availabilityStatus: prod.availabilityStatus,
          // Reviews handled separately in the nested create below
          returnPolicy: prod.returnPolicy,
          minimumOrderQuantity: prod.minimumOrderQuantity,
          // Flattened meta fields
          createdAt: prod.meta?.createdAt
            ? new Date(prod.meta.createdAt)
            : new Date(),
          updatedAt: prod.meta?.updatedAt
            ? new Date(prod.meta.updatedAt)
            : new Date(),
          barcode: prod.meta?.barcode,
          qrCode: prod.meta?.qrCode,
          images: prod.images || [],
          thumbnail: prod.thumbnail,

          reviews: {
            create: (prod.reviews || []).map((rev: any) => ({
              rating: rev.rating,
              comment: rev.comment,
              date: new Date(rev.date),
              reviewerName: rev.reviewerName,
              reviewerEmail: rev.reviewerEmail,
            })),
          },
        },
      }),
    ),
  );

  // Had to split them up (otherwise): 'ERROR: cannot insert multiple commands into a prepared statement'
  // Update PostgreSQL sequence counters for Category and Product tables
  await prisma.$executeRawUnsafe(`
    SELECT setval(pg_get_serial_sequence('"Category"', 'id'), coalesce(max(id), 1)) FROM "Category";
  `);

  await prisma.$executeRawUnsafe(`    
    SELECT setval(pg_get_serial_sequence('"Product"', 'id'), coalesce(max(id), 1)) FROM "Product";
  `);
}

main()
  .catch((e) => {
    console.error("Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
