import cors from "cors";
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const db = require("./queries");
require("dotenv").config();

app.use(express.json());
app.use(cors());

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get("/", (request: any, response: any) => {
  response.json({ info: "Node.js, Express, and Postgres API" });
});

app.get("/pets", db.getPets);
app.post("/create-pet", db.createPet);
app.post("/add-vaccine", db.addVaccineRecord);
app.post("/add-allergy", db.addAllergyRecord);
app.get("/get-vaccines", db.getVaccinesForPet);
app.get("/get-allergies", db.getAllergiesForPet);
app.put("/edit-pet", db.editPet);

app.listen(process.env.PORT, () => {
  console.log(`App running on port ${process.env.PORT}.`);
});
