const express = require("express");
const cors = require("cors");
const app = express();
const Joi = require("joi");
app.use(cors());
app.use("/uploads", express.static("uploads"));
app.use(express.json());
app.use(express.static("public"));
const multer = require("multer");
const mongoose = require("mongoose");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

mongoose
  .connect(
    "mongodb+srv://thielec2004:VZ1IP2ozSYzk3p6b@cluster0.wzcia.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    console.log("connected to mongodb");
  })
  .catch((error) => {
    console.log("couldn't connect to mongodb", error);
  });

const cookSchema = new mongoose.Schema({
  name: String,
  hometown: String,
  favorite_recipe: String,
  rating: String,
  img_name: String,
});

const house_plans = mongoose.model("Cook", cookSchema);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/api/house_plans", async (req, res) => {
  const house_plans = await Cook.find();
  res.send(house_plans);
});
app.get("/api/house_plans/:id", async (req, res) => {
  const house_plans = await Cook.findOne({ _id: id });
  res.send(house_plans);
});

app.post("/api/house_plans", upload.single("img"), async (req, res) => {
  const result = validateCook(req.body);

  if (result.error) {
    res.status(400).send(result.error.details[0].message);
    console.log("Error");
    return;
  }

  const cook = new cook ({
    name: req.body.name,
    hometown: req.body.hometown,
    favorite_recipe: req.body.favorite_recipe,
    rating: req.body.rating,
  });

  if (req.file) {
    cook.img_name = req.file.filename;
  }

  house_plans.push(cook);

  const newCook = await cook.save();
  res.send(newCook);
});

app.put("/api/house_plans/:id", async (req, res) => {
  const { id } = req.params;
  const result = validateCook(req.body);

  if (result.error) {
    return res.status(400).send(result.error.details[0].message);
  }

  const cook = house_plans.find((h) => h.id === parseInt(id));
  if (!cook) {
    return res.status(404).send("The cook with the given ID was not found.");
  }
  cook.name = req.body.name;
  cook.hometown = req.body.hometown;
  cook.favorite_recipe = req.body.favorite_recipe;
  cook.rating = req.body.rating;

  res.status(200).send(cook);
});

let fieldsToUpdate = {
  name: req.body.name,
  hometown: req.body.hometown,
  favorite_recipe: req.body.favorite_recipe,
  rating: req.body.rating,
};

if (req.file) {
  fieldsToUpdate.img = "images/" + req.file.filename;
}

const wentThrough = await Cook.updateOne(
  { id: req.params.id },
  fieldsToUpdate
);

const updatedCook = await.Cook.findOne({id,req,params,id });
res.send(updatedCook); 

app.delete("/api/house_plans/:id", async (req, res) => {
  const cook = await Cook.findByIdAndDelete(req.params.id);
  res.send(cook);
});

const validateCook = (cook) => {
  const schema = Joi.object({
    id: Joi.allow(""),
    name: Joi.string().min(3).required(),
    hometown: Joi.string().required(),
    favorite_recipe: Joi.string().required(),
    rating: Joi.number().required(),
  });

  return schema.validate(cook);
};

app.listen(3001, () => {
  console.log("Listening....");
});
