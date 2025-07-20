const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing  = require("../models/listing.js");
const smallInit = require("./small.js");

const MONGO_URL  = "mongodb://127.0.0.1:27017/wanderlust";
main()
.then((res) => {
    console.log("Connected to DB");
}).catch((err) => {
    console.log(err);
});
async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
    await Listing.deleteMany({});

    // initData.data = initData.data.map((obj) => ({...obj,owner: '6831fe2eef63a3852123d1a9'})) 
    // await Listing.insertMany(initData.data);

     smallInit.data = smallInit.data.map((obj) => ({...obj,owner: '6831fe2eef63a3852123d1a9'})) 
     await Listing.insertMany(smallInit.data);

    console.log("Data was initialized"); 
}
initDB();