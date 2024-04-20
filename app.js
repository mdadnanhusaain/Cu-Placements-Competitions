require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const path = require("path");
const app = express();

const Company = require("./models/company.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.engine("ejs", ejsMate);

// MongoDB Connection
async function main() {
  // await mongoose.connect(process.env.ATLAS_URL);
  await mongoose.connect(`${process.env.MONGO_URL}/${process.env.DATABASE}`);
}

main()
  .then((res) => {
    console.log("Successfully connected to Database\n");
  })
  .catch((err) => {
    console.log(err);
  });

app.get("/", (req, res) => {
  res.render("pages/Home.ejs");
});

app.get("/company/:id", (req, res) => {
  let { id } = req.params;
  console.log(id);
  res.render("pages/aboutCompany.ejs", { id });
});

app.post("/company/:id", (req, res) => {
  let { id } = req.params;
  console.log(id);
  let company = { ...req.body.company };
  let newCompany = new Company(company);
  res.send(newCompany);
});

app.get("/profile", (req, res) => {
  res.render("pages/profile.ejs");
});

app.get("/Alogin", (req, res) => {
  res.render("user/ALogin.ejs");
});

app.get("/Asignup", (req, res) => {
  res.render("user/ASignup.ejs");
});

app.get("/Slogin", (req, res) => {
  res.render("user/SLogin.ejs");
});

app.get("/Ssignup", (req, res) => {
  res.render("user/SSignup.ejs");
});

app.listen(process.env.PORT, () => {
  console.log(`Server is listening on http://localhost:${process.env.PORT}`);
});
