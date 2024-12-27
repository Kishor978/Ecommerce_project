const { Product } = require("../models/product");
const fs = require("fs")
const slugify = require("slugify")
//creating the new product
const createProduct = async (req, res) => {

    try {
        console.log(req.fields);

        //using the new package fomridable-express 
        const { name, description, price, quantity, shipping, category } = req.fields
        // console.log();
        const { photo } = req.files

        // console.log(photo);

        if (!name || !description || !price || !quantity || !category) {
            return res.status(404).json({ message: "name,description,price,quantity and category  of any product  are  required" })
        }
        // checking the size of photo
        console.log(photo.size);
        if (photo && photo.size > 2000000) {
            return res.status(400).json({ message: "The size of photo cannot be more than 2 MB" })

        }

        //creating the product ans storing in the database without photo
        const newProduct = await Product({
            name, slug: slugify(name), description, price, quantity, category, shipping
        })


        //creating the product ans storing in the database with photo
        if (photo) {
            //stpring the data of photo as buffer
            newProduct.photo.data = fs.readFileSync(photo.path)
            //stromg the extension as photp content type
            newProduct.photo.contentType = photo.type
        }


        //saving to the database
        await newProduct.save()
        // returing the product
        return res.status(200).json({ message: "Product was created", newProduct: newProduct })
    }

    catch (error) {
        res.status(500).send({ message: error.message })
    }


}

// all the product

const getProducts = async (req, res) => {


    try {
        // const { page = 1, limit = 1 } = req.query
        // // for the paginations
        // // console.log(page,limit)
        // //for the skip of teh page
        // const skip = (page - 1) * limit

        //select the field as required
        // const allProducts = await Product.find().select("-photo").limit(4).sort({createdAt:1})  //1 for  ascneding order or older first
        // const allProducts = await Product.find().select("-photo").limit(4).sort({ createdAt: -1 })  //-1 for  descending  order or newest first
        const allProducts = await Product.find().select("-photo")



        return res.status(201).json({ message: "All  the product was returned", allProducts: allProducts })

    }
    catch (error) {
        res.status(500).send({ message: error.message })
    }


}


const getProductsSpecific = async (req, res) => {


    try {
        const { page = 1, limit = 2 } = req.query
        // for the paginations
        // console.log(page,limit)
        //for the skip of teh page
        const skip = (page - 1) * limit

        // select the field as required
        // const allProducts = await Product.find().select("-photo").limit(4).sort({createdAt:1})  //1 for  ascneding order or older first
        // const allProducts = await Product.find().select("-photo").limit(4).sort({ createdAt: -1 })  //-1 for  descending  order or newest first
        const allProducts = await Product.find().select("-photo").skip(skip).limit(limit).sort({ createdAt: -1 })  //-1 aldo for the pagination
        console.log(allProducts);



        return res.status(201).json({ message: "All  the product was returned", allProducts: allProducts })

    }
    catch (error) {
        res.status(500).send({ message: error.message })
    }


}


//getting the single product on the basis of slug of product
const getSingleProducts = async (req, res) => {

    try {
        const { slug } = req.params
        console.log(slug);

        const singleProduct = await Product.findOne({ slug: slug })

        // )
        // console.log(singleProduct);


        return res.status(200).json({ message: "Single product was returned", singleProduct: singleProduct })
    }
    catch (error) {
        res.status(500).send({ message: error.message })
    }


}

//get photo of the availabe product

const getPhotoProduct = async (req, res) => {

    try {
        //    const {_id}=req.query
        const { productId } = req.params
        console.log(productId);

        //finding the photo of product
        const productData = await Product.findById({ _id: productId }).select("photo")
        console.log(productData)
        if (productData.photo.data) {

            res.set("content-Type", productData.photo.contentType);
            return res.send(productData.photo.data)
        }

        //for returning the photo
        return res.status(200).json({ message: "Single photo was returned", PhotoData: photoData })

    }
    catch (error) {
        res.status(500).send({ message: error.message })
    }


}


//for delelting the product

const deleteProduct = async (req, res) => {

    try {
        //for getting  the id ansd delete the product 
        const { productId } = req.params
        // console.log(productId);
        const deletedProduct = await Product.findByIdAndDelete({ _id: productId }).select("-photo")
        return res.status(200).json({ message: "The product was deleted", deletedProduct: deletedProduct })
    }
    catch (error) {
        res.status(500).send({ message: error.message })
    }


}
//updating the product
const updateProduct = async (req, res) => {

    try {
        const { productId } = req.params
        // console.log(productId);
        //for the photo
        const { photo } = req.files
        // console.log(photo);
        //using the new package fomridable-express 
        const { name, description, price, quantity, shipping, category } = req.fields

        // console.log(req.files)
        if (!name && !description && !price && !quantity && !category) {
            return res.status(404).json({ message: "name,description,price,quantity and category  of any product  are  required" })
        }
        // // checking the size of photo
        console.log(photo.size);
        if (photo && photo.size > 2000000) {
            return res.status(400).json({ message: "The size of photo cannot be more than 2 MB" })

        }
        // // //update the product
        const updatedProduct = await Product.findByIdAndUpdate({ _id: productId }, {
            name, slug: slugify(name), description, price, quantity, category, shipping
        }, { new: true })

        // console.log(updatedProduct);

        //creating the product ans storing in the database with photo
        if (photo) {
            //stpring the data of phot as buffer
            updatedProduct.photo.data = fs.readFileSync(photo.path)
            //stromg the extension as photp content type
            updatedProduct.photo.contentType = photo.type
        }


        //saving to the database
        await updatedProduct.save()
        //returing the product
        return res.status(200).json({ message: "Product was updated", updatedProduct: updatedProduct })
    }

    catch (error) {
        res.status(500).send({ message: error.message })
    }


}





const countProduct = async (req, res) => {
    try {//select the field as required
        const numberCountProduct = await Product.find().countDocuments()

        console.log(numberCountProduct)

        return res.status(200).json({ message: "Number of Product was returned", numberCountProduct: numberCountProduct })

    }
    catch (error) {
        res.status(500).send({ message: error.message })
    }



}

//for searching of the products

const searchProducts = async (req, res) => {

    try {
        //getting the value from params 
        const { searchValue } = req.params
        //searching the product the 
        console.log(searchValue)
        //for searching the product
        const searchedProducts = await Product.find({
            $or: [
                { name: { $regex: searchValue, $options: "i" } }, // i for case sensitive 
                { description: { $regex: searchValue, $options: "i" } } ,// i for case sensitive 
                { slug: { $regex: searchValue, $options: "i" } } // i for case sensitive 
            ]
        }).select("-photo")

        return res.status(200).send({ message: "Searched Product was returned", searchedProducts: searchedProducts })


    }
    catch (error) {
        res.status(500).send({ message: error.message })
    }


}




//exporting the module
module.exports = { createProduct, getProducts, getSingleProducts, getPhotoProduct, deleteProduct, updateProduct, countProduct, getProductsSpecific, searchProducts }