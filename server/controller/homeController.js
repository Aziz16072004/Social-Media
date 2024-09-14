const Product = require("../models/post");
const User = require("../models/user");

const getProducts = async (req, res) => {
    try {
        const products = await Product.find().sort();
        res.json(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
}


const addProduct = async (req, res) => {
    try {
    
        const data = {
            productName: req.body.productName,
            idUser: req.body.idUser,
        };

        const produit = await Product.insertMany([data]);
        res.json(produit);
    } catch (error) {
        console.error("Error adding product:", error);
        res.status(500).json(error);
    }
}

const addRating = async (req, res) => {
    try {
        function setAverageRating(){
            let totalRating = 0;
            for (let rating of product.ratings) {
                totalRating += rating.value;
            }
            product.averageRating = Number(totalRating / product.ratings.length).toFixed(1) || 0;
        }

        const { productId, value, userId } = req.body;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        

        const foundUser = product.ratings.find(rating => rating.idUser == userId);

        if (foundUser) {
            //Updating
            foundUser.value = value
            setAverageRating()
            await product.save()
            res.json("updating successfully")
        }
        else{
        user.ratings.push({ productId, value });
        product.ratings.push({ idUser: userId, value });

        await user.save();
        setAverageRating();
        await product.save();

        return res.json(user); // Consider sending only necessary data
    }
    } catch (error) {
        console.error("Error adding rating:", error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}
module.exports = { getProducts, addProduct , addRating };
