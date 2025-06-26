const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing=require("./models/listing.js");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

async function main() {
  await mongoose.connect(MONGO_URL);
}

main()
  .then(() => {
    console.log("Connected to db");
  })
  .catch((err) => {
    console.log(err);
  });
app.get("/", (req, res) => {
  res.send("Hi");
});

app.get("/testListing", async(req,res)=>{
    let sampleListing=new Listing({
        title:"My new villa",
        decription:"By the beach",
        price:1200,
        location:"Goa",
        country:"India"
    });
    await sampleListing.save();
console.log("Sample was saved");
res.send("Good");

})


app.listen(8080, () => {
  console.log("Server is listening on port 8080");
});
