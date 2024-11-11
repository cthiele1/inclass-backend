const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.static("public"));

const housePlans = [];

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/api/house_plans", (req, res) => {
  const house_plans = [
    [
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
    ],
  ];
  res.send(house_plans);
});

app.listen(3001, () => {
  console.log("Listening...");
});
