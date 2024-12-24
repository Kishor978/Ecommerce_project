const express = require('express');
const { isLoggedIn, isAdmin } = require('../middlewares/user');
const { createProduct, getProducts, getSingleProducts, getPhotoProduct,deleteProduct,updateProduct } = require('../controllers/product');
const productRoute = express.Router()
const formidableMiddleware = require("express-formidable")


//the product route
//creating the product if the user is admin and loggedIn
productRoute.post("/products", formidableMiddleware(), createProduct)



//getting all the product if the user is admin and loggedIn
productRoute.get("/products", formidableMiddleware(), getProducts)

//getting the single product if the user is admin and loggedIn
productRoute.get("/products/:slug", formidableMiddleware(), getSingleProducts)
//for gettig the photto
productRoute.get("/products/photo/:productId", formidableMiddleware(), getPhotoProduct)
//for deleting the product as is loggedin and isAdmin is required
productRoute.delete("/products/:productId", deleteProduct)

//for updating the product
productRoute.put("/products/:productId",formidableMiddleware(), updateProduct)


module.exports = { productRoute }