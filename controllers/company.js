const Company = require("../models/company.js");

module.exports.about = (req, res) => {
  let { id } = req.params;
  res.render("pages/aboutCompany.ejs", { id });
};

module.exports.addForm = (req, res) => {
  res.render("pages/addCompany.ejs");
};

module.exports.addCompany = async (req, res) => {
  try {
    let company = req.body.company;
    let newCompany = new Company(company);

    let logoDetails = req.files["company[file][image]"][0];
    let jdDetails = req.files["company[file][jd]"][0];

    let jdFilename = jdDetails.originalname;
    jdFilename = jdFilename.split(".");
    jdFileExt = jdFilename[1];
    jdFilename = jdFilename[0];
    jdFilename = jdFilename.replaceAll(" ", "_");

    let url = jdDetails.path;
    let urlArray = url.split("upload");
    url = urlArray[0] + "upload/fl_attachment:" + jdFilename + urlArray[1];
    jdFilename = jdFilename + `.${jdFileExt}`;

    newCompany.file.image.url = logoDetails.path;
    newCompany.file.image.filename = logoDetails.originalname;
    newCompany.file.jd.url = url;
    newCompany.file.jd.filename = jdFilename;

    let savedCompany = await newCompany.save();
    console.log("New Company added : " + savedCompany);
  } catch (error) {
    console.log(error);
  }
  res.redirect("/");
};

module.exports.editForm = async (req, res) => {
  let { id } = req.params;
  let company = await Company.findById(id);
  res.render("pages/editCompany.ejs", { company, pdf: process.env.PDF });
};

module.exports.editCompany = async (req, res) => {
  try {
    let { id } = req.params;

    let company = req.body.company;
    let newCompany = await Company.findByIdAndUpdate(id, { ...company });

    if (req.files["company[file][image]"] !== undefined) {
      let logoDetails = req.files["company[file][image]"][0];

      newCompany.file.image.url = logoDetails.path;
      newCompany.file.image.filename = logoDetails.originalname;
    }

    if (req.files["company[file][jd]"] !== undefined) {
      let jdDetails = req.files["company[file][jd]"][0];

      let jdFilename = jdDetails.originalname;
      jdFilename = jdFilename.split(".");
      jdFileExt = jdFilename[1];
      jdFilename = jdFilename[0];
      jdFilename = jdFilename.replaceAll(" ", "_");

      let url = jdDetails.path;
      let urlArray = url.split("upload");
      url = urlArray[0] + "upload/fl_attachment:" + jdFilename + urlArray[1];
      jdFilename = jdFilename + `.${jdFileExt}`;

      newCompany.file.jd.url = url;
      newCompany.file.jd.filename = jdFilename;
    }

    let savedCompany = await newCompany.save();
    console.log("Company Details edited : " + savedCompany);
  } catch (error) {
    console.log(error);
  }
  res.redirect("/");
};
