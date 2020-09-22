require("dotenv").config();
const express = require("express");
const blogRouter = require("./routes/blog");
const Article = require("./models/article");
const app = express();
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");

app.set("view engine", "ejs");
app.set("views", "views");

//app.use(express.urlencoded({ extended: false }));
app.use(
  bodyParser.json({
    limit: "10mb",
  })
);

app.use(
  bodyParser.urlencoded({
    limit: "10mb",
    parameterLimit: 100000,
    extended: true,
  })
);

app.use("/public", express.static("public"));
app.use(methodOverride("_method")); // we will use to override the method

app.get("/", async (req, res) => {
  const articles = await Article.find().sort({ createdAt: "desc" });
  res.render("articles/index", { articles: articles });
});

app.use("/articles", blogRouter);

const PORT = process.env.PORT || 8000;

mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("Connected to Database!");
    app.listen(PORT);
  })
  .catch((err) => console.log(err));
