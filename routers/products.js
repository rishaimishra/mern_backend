const express = require('express');
const { Category } = require('../models/category');
const router = express.Router();
const {Product} = require('../models/product')
const mongoose = require('mongoose')

router.get(`/`, async (req, res) => {
    // localhost:3000/api/v1/products?categories=2122,2422
    let filter = {}
    if (req.query.categories) {
        filter = {category: req.query.categories.split(',')};
    }
    const productList = await Product.find(filter).populate('category');

    if (!productList) {
        res.status(500).json({success:false})
    }
    res.send(productList);
})

// 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

//Select name and image and exclude id from list
router.get(`/name-image`, async (req, res) => {
    const productList = await Product.find().select('name image -_id');

    if (!productList) {
        res.status(500).json({success:false})
    }
    res.send(productList);
})

router.get('/:id', async (req, res) =>{
    const product = await Product.findById(req.params.id).populate('category');

    if (!product) {
        return res.status(500).json({success:false, message: 'The product with given ID was not found'});
    }

    return res.status(200).json({product})
})

router.post(`/`, async (req, res) => {

    try {

        let category = await Category.findById(req.body.category);
    if(!category) return res.status(400).send('Invalid Category');

    let product = new Product({
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: req.body.image,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        rating: req.body.rating,
        isFeatured: req.body.isFeatured,
        numReviews: req.body.numReviews,
        countInStock: req.body.countInStock
    }) 

    product = await product.save();

    if (!product) {
        return res.status(404).send('the product cannot be created')
   }

   res.send(product);
        
    } catch (error) {

        res.send(error)
        
    }
    
})

router.delete('/:id', (req, res)=>{
    Product.findByIdAndRemove(req.params.id).then(product=>{
        if (product) {
            return res.status(200).json({success:true, message: 'the product is deleted!'})
        } else{
            return res.status(404).json({success:false, message:'product not found!'})
        }
    }).catch(err=>{
        return res.status(400).json({success:true, error:err})
    })
})

router.put('/:id', async (req, res)=>{
    if (!mongoose.isValidObjectId(req.params.id)) {
        res.status(400).send('Invalid Product Id')
    }
    let category = await Category.findById(req.body.category);
    if(!category) return res.status(400).send('Invalid Category');


    let product = await Product.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            description: req.body.description,
            richDescription: req.body.richDescription,
            image: req.body.image,
            brand: req.body.brand,
            price: req.body.price,
            category: req.body.category,
            rating: req.body.rating,
            isFeatured: req.body.isFeatured,
            numReviews: req.body.numReviews,
            countInStock: req.body.countInStock
        },
        {new: true}
    )

    if (!product) {
        return res.status(500).json({success:false, message: 'The product with given ID was not found'});
    }

    return res.status(200).json({product})
   
})

router.get('/get/count', async (req, res) =>{
    let productCount = await Product.countDocuments();

    if (!productCount) {
        return res.status(500).json({success:false, message: 'The productCount  was not found'});
    }

    return res.status(200).json({productCount: productCount})
})

router.get('/get/featured', async (req, res) =>{
    let products = await Product.find({isFeatured: true});

    if (!products) {
        return res.status(500).json({success:false, message: 'The products  was not found'});
    }

    return res.status(200).json({products: products})
})

// Limit Featured Product
router.get('/get/featured/:count', async (req, res) =>{
    const count = req.params.count ? req.params.count : 0;
    let products = await Product.find({isFeatured: true}).limit(+count);

    if (!products) {
        return res.status(500).json({success:false, message: 'The products  was not found'});
    }

    return res.status(200).json({products: products})
})


module.exports= router;
