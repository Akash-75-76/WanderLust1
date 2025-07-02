const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const initData = require("./data.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("Connected to db");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}
const initDB = async () => {
  await Listing.deleteMany({});
  
  // Create a new array with owner field added
  const updatedData = initData.data.map((obj) => ({
    ...obj,
    owner: "6864e629e4dc6d8342be239b",
  }));

  await Listing.insertMany(updatedData);
  console.log("Data was initialized");
};

initDB();
;