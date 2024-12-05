const express = require("express");
const cors = require("cors");
const app = express();
const Joi = require("joi");
app.use(cors());
app.use("/uploads", express.static("uploads"));
app.use(express.json());
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
    img_name: "cook1.jpg",
    name: "Ray Young",
    hometown: "Atlanta, GA",
    favorite_recipe: "Biscuits",
    rating: 4.7,
  },
  {
    _id: 2,
    img_name: "cook2.jpg",
    name: "Earl Rayberry",
    hometown: "Charleston, SC",
    favorite_recipe: "Greenbeans",
    rating: 4.2,
  },
  {
    _id: 3,
    img_name: "cook3.jpg",
    name: "Mark Bulhberg",
    hometown: "Oxford, MS",
    favorite_recipe: "Pulled Pork",
    rating: 4.1,
  },
  {
    _id: 4,
    img_name: "cook4.jpg",
    name: "Jermey Goldstein",
    hometown: "Baton Rouge, LA",
    favorite_recipe: "Crawfish",
    rating: 4.7,
  },
  {
    _id: 5,
    img_name: "cook5.jpg",
    name: "Chris Brownberry",
    hometown: "Columbia, SC",
    favorite_recipe: "Mac & Cheese",
    rating: 3.9,
  },
  {
    _id: 6,
    img_name: "cook6.jpg",
    name: "Amy Bornwell",
    hometown: "Greenville, SC",
    favorite_recipe: "Grits",
    rating: 4.3,
  },
  {
    _id: 7,
    img_name: "cook7.jpg",
    name: "Jack Dawson",
    hometown: "Raleigh, NC",
    favorite_recipe: "Cornbread",
    rating: 4.9,
  },
  {
    _id: 8,
    img_name: "cook8.jpg",
    name: "Josh Cornberry",
    hometown: "Auburn, AL",
    favorite_recipe: "Pimento Cheese",
    rating: 5.0,
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

  const result = validateCook(req.body);

  if (result.error) {
    res.status(400).send(result.error.details[0].message);
    console.log("Error");
    return;
  }

  const cook = {
    id: house_plans.length + 1,
    name: req.body.name,
    hometown: req.body.hometown,
    favorite_recipe: req.body.favorite_recipe,
    rating: req.body.rating,
  };

  if (req.file) {
    cook.img_name = req.file.filename;
  }

  house_plans.push(cook);

  res.status(200).send(cook);
});

app.put("/api/house_plans/:id", (req, res) => {
  const { id } = req.params;
  const result = validateCook(req.body);

  if (result.error) {
    return res.status(400).send(result.error.details[0].message);
  }

  const cook = house_plans.find((h) => h._id === parseInt(id));
  if (!cook) {
    return res.status(404).send("The cook with the given ID was not found.");
  }
  cook.name = req.body.name;
  cook.hometown = req.body.hometown;
  cook.favorite_recipe = req.body.favorite_recipe;
  cook.rating = req.body.rating;

  res.status(200).send(cook);
});

app.delete("/api/house_plans/:id", (req, res) => {
  //const cook = house_plans.find((h) => h._id === parseInt(req.params.id));
  const { id } = req.params;
  let cook;
  house_plans.forEach((h) => {
    if (h._id === parseInt(id)) {
      cook = h;
      return;
    }
  });
  if (!cook) {
    res.status(404).send("The cook given id was not found");
  }
  const index = house_plans.indexOf(cook);
  house_plans.splice(index, 1);
  res.status(200).send(cook);
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
