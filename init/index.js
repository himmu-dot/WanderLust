require("dotenv").config({ path: "../.env" });

const mongoose = require("mongoose");
const Listing  = require("../models/listing.js");
const smallInit = require("./small.js");

const dbUrl = process.env.ATLASDB_URL;

async function main() {
    try {
        await mongoose.connect(dbUrl);
        console.log("Connected to DB");

        await Listing.deleteMany({});
        console.log("🗑 Old data deleted");

        smallInit.data = smallInit.data.map((obj) => ({
            ...obj,
            owner: '6831fe2eef63a3852123d1a9'
        }));

        await Listing.insertMany(smallInit.data);
        console.log("🚀 Data was initialized");

        mongoose.connection.close();
    } catch (err) {
        console.log("❌ ERROR:", err);
    }
}

main();