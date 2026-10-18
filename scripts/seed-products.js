import { faker } from "@faker-js/faker";
import nextEnv from "@next/env";
import mongoose from "mongoose";
import CityModel from "../models/City.model.js";
import CountryModel from "../models/Country.model.js";
import MediaModel from "../models/Media.model.js";
import ProductModel from "../models/Product.Model.js";
import ShopCategoryModel from "../models/ShopCategory.model.js";
import ShopSubcategoryModel from "../models/ShopSubcategory.model.js";
import StateModel from "../models/State.model.js";
import UserModel from "../models/User.model.js";

nextEnv.loadEnvConfig(process.cwd());

const count = Number(process.argv[2] ?? 20);

function requireDocuments(documents, label) {
    if (!documents.length) {
        throw new Error(`No ${label} found. Add the required records before seeding products.`);
    }
    return documents;
}

async function seedProducts() {
    if (process.env.NODE_ENV === "production") {
        throw new Error("Refusing to seed fake products in production.");
    }
    if (!Number.isInteger(count) || count < 1 || count > 500) {
        throw new Error("Count must be a whole number between 1 and 500.");
    }

    const { connectDB } = await import("../lib/databaseConnection.js");
    await connectDB();

    const [provider, categories, subcategories, country] = await Promise.all([
        UserModel.findOne({ role: "provider", deletedAt: null }).select("_id").lean(),
        ShopCategoryModel.find({ deletedAt: null }).select("_id").lean(),
        ShopSubcategoryModel.find({ deletedAt: null }).select("_id shopCategory").lean(),
        CountryModel.findOne({ deletedAt: null }).select("_id").lean(),
    ]);

    if (!provider) {
        throw new Error("No active provider found. Create a provider account before seeding products.");
    }

    const categoryIds = new Set(requireDocuments(categories, "active shop categories").map(({ _id }) => String(_id)));
    const categoryPairs = requireDocuments(subcategories, "active shop subcategories")
        .filter(({ shopCategory }) => shopCategory && categoryIds.has(String(shopCategory)))
        .map(({ _id, shopCategory }) => ({ subcategory: _id, category: shopCategory }));
    requireDocuments(categoryPairs, "subcategory linked to an active category");

    if (!country) {
        throw new Error("No active country found. Add location records before seeding products.");
    }
    const state = await StateModel.findOne({ country: country._id, deletedAt: null }).select("_id").lean();
    if (!state) {
        throw new Error("No active state found for the selected country.");
    }
    const city = await CityModel.findOne({ state: state._id, deletedAt: null }).select("_id").lean();
    if (!city) {
        throw new Error("No active city found for the selected state.");
    }

    const productData = Array.from({ length: count }, () => {
        const name = faker.commerce.productName();
        const sku = `FAKE-${faker.string.alphanumeric(10).toUpperCase()}`;
        const imageUrl = faker.image.url({ width: 800, height: 800 });
        const { category, subcategory } = faker.helpers.arrayElement(categoryPairs);

        return {
            name,
            slug: `${faker.helpers.slugify(name).toLowerCase()}-${sku.toLowerCase()}`,
            category,
            subcategory,
            price: Number(faker.commerce.price({ min: 10, max: 1000, dec: 2 })),
            sku,
            discountPercentage: faker.number.int({ min: 0, max: 30 }),
            stockType: "in_stock",
            stockQuantity: faker.number.int({ min: 1, max: 100 }),
            processingTime: { value: faker.number.int({ min: 1, max: 7 }), unit: "days" },
            customizable: faker.datatype.boolean(),
            userId: provider._id,
            description: faker.commerce.productDescription(),
            country: country._id,
            state: state._id,
            city: city._id,
            status: "approved",
            approvedAt: new Date(),
            isFeatured: false,
            tags: ["fake", "seeded", faker.commerce.department().toLowerCase()],
            rating: faker.number.float({ min: 3, max: 5, fractionDigits: 1 }),
            reviewCount: faker.number.int({ min: 0, max: 80 }),
            soldCount: faker.number.int({ min: 0, max: 250 }),
            media: [],
            imageUrl,
        };
    });

    const media = await MediaModel.insertMany(productData.map(({ imageUrl, name }) => ({
        userId: provider._id,
        asset_id: faker.string.uuid(),
        public_id: `fake-products/${faker.string.uuid()}`,
        path: imageUrl,
        thumbnail_url: imageUrl,
        secure_url: imageUrl,
        alt: name,
        title: name,
    })));

    const products = await ProductModel.insertMany(productData.map(({ imageUrl, ...product }, index) => ({
        ...product,
        media: [media[index]._id],
    })));

    console.log(`Created ${products.length} fake products.`);
}

try {
    await seedProducts();
} catch (error) {
    console.error(error.message);
    process.exitCode = 1;
} finally {
    await mongoose.disconnect();
}