const express = require('express');
const categoryRoute = express.Router()
const runValidation = require('../validation/index');
const { createCategory, getSingleCategory, getAllCategories, updateCategory, deleteCategory } = require("../controllers/category")
const { isLoggedIn, isAdmin } = require('../middlewares/user');
const { categoryValidator } = require('../validation/category');


//for the protected route as only the admin ca acess some route
categoryRoute.post("/categories", createCategory)

// for the getting the  all category
categoryRoute.get("/categories/", getAllCategories)

//for the getting the  sigle category
categoryRoute.get("/categories/:slug", getSingleCategory);


//for the updating the category

categoryRoute.put("/categories/:categoryId",updateCategory)

//for the deleting the category
categoryRoute.delete("/categories/:categoryId", deleteCategory)






module.exports = { categoryRoute }