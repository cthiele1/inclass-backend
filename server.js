const express = require("express");
const cors = require("cors");
const app = express();
const Joi = require("joi");
app.use(cors());
app.use(express.static("public"));
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

const house_plans = [
  {
    _id: 1,
    img_name: "images/cook1.jpg",
    name: "Ray Young",
    hometown: "Atlanta, GA",
    favorite_recipe: "Biscuits",
    rating: 4.7,
    goals: ["Help Others"],
  },
  {
    _id: 2,
    img_name: "images/cook2.jpg",
    name: "Earl Rayberry",
    hometown: "Charleston, SC",
    favorite_recipe: "Greenbeans",
    rating: 4.2,
    goals: ["Help Others"],
  },
  {
    _id: 3,
    img_name: "images/cook3.jpg",
    name: "Mark Bulhberg",
    hometown: "Oxford, MS",
    favorite_recipe: "Pulled Pork",
    rating: 4.1,
    goals: ["Help Others"],
  },
  {
    _id: 4,
    img_name: "images/cook4.jpg",
    name: "Jermey Goldstein",
    hometown: "Baton Rouge, LA",
    favorite_recipe: "Crawfish",
    rating: 4.7,
    goals: ["Help Others"],
  },
  {
    _id: 5,
    img_name: "images/cook5.jpg",
    name: "Chris Brownberry",
    hometown: "Columbia, SC",
    favorite_recipe: "Mac & Cheese",
    rating: 3.9,
    goals: ["Help Others"],
  },
  {
    _id: 6,
    img_name: "images/cook6.jpg",
    name: "Amy Bornwell",
    hometown: "Greenville, SC",
    favorite_recipe: "Grits",
    rating: 4.3,
    goals: ["Help Others"],
  },
  {
    _id: 7,
    img_name: "images/cook7.jpg",
    name: "Jack Dawson",
    hometown: "Raleigh, NC",
    favorite_recipe: "Cornbread",
    rating: 4.9,
    goals: ["Help Others"],
  },
  {
    _id: 8,
    img_name: "images/cook8.jpg",
    name: "Josh Cornberry",
    hometown: "Auburn, AL",
    favorite_recipe: "Pimento Cheese",
    rating: 5.0,
    goals: ["Help Others"],
  },
];
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/api/house_plans", (req, res) => {
  res.json(house_plans);
});

app.post("/api/house_plans", upload.single("img"), (req, res) => {
  console.log("In a post request");

  const result = validateHouse(req.body);

  if (result.error) {
    res.status(400).send(result.error.details[0].message);
    console.log("I have an error");
    return;
  }

  const house = {
    _id: house_plans.length + 1,
    name: req.body.name,
    hometown: req.body.hometown,
    favorite_recipe: req.body.favorite_recipe,
    rating: req.body.rating,
  };

  if (req.file) {
    house.img_name = req.file.filename;
  }

  house_plans.push(house);

  console.log(house);
  res.status(200).send(house);
});

const validateHouse = (house) => {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    hometown: Joi.string().required(),
    favorite_recipe: Joi.string().required(),
    rating: Joi.number().required(),
  });

  return schema.validate(house);
};

app.listen(3001, () => {
  console.log("Listening....");
});
