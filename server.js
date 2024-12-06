const express = require("express");
const cors = require("cors");
const Joi = require("joi");
const multer = require("multer");
const mongoose = require("mongoose");

const app = express();

app.use(cors());
app.use("/uploads", express.static("uploads"));
app.use(express.json());
app.use(express.static("public"));

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

const Cook = mongoose.model("Cook", cookSchema);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/api/house_plans", async (req, res) => {
  try {
    const cooks = await Cook.find();
    res.send(cooks);
  } catch (err) {
    res.status(500).send("Error fetching data: " + err);
  }
});

app.get("/api/house_plans/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const cook = await Cook.findById(id);
    if (!cook) {
      return res.status(404).send("Cook not found");
    }
    res.send(cook);
  } catch (err) {
    res.status(500).send("Error fetching cook: " + err);
  }
});

app.post("/api/house_plans", upload.single("img"), async (req, res) => {
  const result = validateCook(req.body);

  if (result.error) {
    return res.status(400).send(result.error.details[0].message);
  }

  const cook = new Cook({
    name: req.body.name,
    hometown: req.body.hometown,
    favorite_recipe: req.body.favorite_recipe,
    rating: req.body.rating,
    img_name: req.file ? req.file.filename : undefined,
  });

  try {
    const newCook = await cook.save();
    res.send(newCook);
  } catch (err) {
    res.status(500).send("Error creating cook: " + err);
  }
});

app.put("/api/house_plans/:id", upload.single("img"), async (req, res) => {
  const { id } = req.params;
  const result = validateCook(req.body);

  if (result.error) {
    return res.status(400).send(result.error.details[0].message);
  }

  const fieldsToUpdate = {
    name: req.body.name,
    hometown: req.body.hometown,
    favorite_recipe: req.body.favorite_recipe,
    rating: req.body.rating,
  };

  if (req.file) {
    fieldsToUpdate.img_name = req.file.filename;
  }

  try {
    const updatedCook = await Cook.findByIdAndUpdate(id, fieldsToUpdate, {
      new: true,
    });
    if (!updatedCook) {
      return res.status(404).send("Cook not found");
    }
    res.send(updatedCook);
  } catch (err) {
    res.status(500).send("Error updating cook: " + err);
  }
});

app.delete("/api/house_plans/:id", async (req, res) => {
  const cook = await Cook.findByIdAndDelete(req.params.id);
  res.status(200).send(cook);
});

const validateCook = (cook) => {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    hometown: Joi.string().required(),
    favorite_recipe: Joi.string().required(),
    rating: Joi.number().required(),
  });

  return schema.validate(cook);
};

app.listen(3001, () => {
  console.log("Listening on port 3001...");
});
