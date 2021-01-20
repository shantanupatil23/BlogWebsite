//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const _ = require("lodash");

const homeStartingContent =
  "As you learn the fundamentals of web development and look to enhance your knowledge, it’s important to scour the internet to see what other people are doing and saying. While it’s great to stay up-to-date on trends through magazines and books, web development blogs provide you with an abundance of fresh, free content. Blogs have become increasingly more popular over the years and even though sports and fashion blogs led the charge at first, it’s now very likely that every topic out there has at least one blog dedicated to it. Web development blogs can be extremely helpful when looking to expand your knowledge in a particular web development niche. However, when searching it’s easy to get overwhelmed with the amount of content that is out there. How do you distinguish between good content and bad content? Because of this difficulty, we decided to compile some of our favorite blogs";
const aboutContent = homeStartingContent;
const contactContent = homeStartingContent;

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect(
  "mongodb+srv://admin-shantanu:pass1234@cluster0.t9vhn.mongodb.net/todolistDB",
  { useNewUrlParser: true }
);

const blogSchema = {
  title: String,
  content: String,
};

const Blog = mongoose.model("Blog", blogSchema);

let posts = [];

app.get("/", function (req, res) {
  Blog.find({}, function (err, foundBlogs) {
    res.render("home", {
      startingContent: homeStartingContent,
      posts: foundBlogs,
    });
  });
});

app.get("/about", function (req, res) {
  res.render("about", { aboutContent: aboutContent });
});

app.get("/contact", function (req, res) {
  res.render("contact", { contactContent: contactContent });
});

app.get("/compose", function (req, res) {
  res.render("compose");
});

app.post("/compose", function (req, res) {
  const post = new Blog({
    title: req.body.postTitle,
    content: req.body.postBody,
  });

  post.save();

  res.redirect("/");
});

app.get("/posts/:postName", function (req, res) {
  const requestedTitle = _.lowerCase(req.params.postName);

  Blog.findOne({ title: requestedTitle }, function (err, foundBlogs) {
    res.render("post", {
      title: foundBlogs.title,
      content: foundBlogs.content,
    });
  });
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
