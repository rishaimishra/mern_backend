const express = require('express');
const router = express.Router();
const {Order} = require('../models/order')
const {OrderItem} = require('../models/order-item')
const {Product} = require('../models/product')

router.get(`/`, async (req, res) => {
    const orderList = await Order.find().populate('orderItems').populate('user', 'name').sort({'dateOrdered': -1});

    if (!orderList) {
        res.status(500).json({success:false})
    }
    res.send(orderList);
})

router.get(`/:id`, async (req, res) => {
    const order = await Order
        .findById(req.params.id)
        .populate({
             path: 'orderItems', populate: {
                path: 'product', populate: 'category'}
             })
        .populate('user', 'name');

    if (!order) {
        res.status(500).json({success:false})
    }
    res.send(order);
})

router.post(`/`, async (req, res) => {
    const orderItemsIds = Promise.all(req.body.orderItemsIds.map(async orderItem=>{
        let newOrderItem = new OrderItem({
            quantity: orderItem.quantity,
            product: orderItem.product
        })

        newOrderItem = await newOrderItem.save();

        // return newOrderItem._id.toString();
        return newOrderItem._id;
    }))

    const orderItemIdsResolved = await orderItemsIds;


    const totalPrices = await Promise.all(orderItemIdsResolved.map(async orderItemId=>{
        
        const orderItem = await OrderItem.findById(orderItemId).populate('product', 'price');
        const price = orderItem.product.price * orderItem.quantity;

        return price
        
    }))


    const totalPrice = totalPrices.reduce((a,b) => a+b, 0);


    let order = new Order({
        orderItems: orderItemIdsResolved,
        shippingAddress1: req.body.shippingAddress1,
        shippingAddress2: req.body.shippingAddress2,
        city: req.body.city,
        zip: req.body.zip,
        country: req.body.country,
        phone: req.body.phone,
        status: req.body.status,
        totalPrice: totalPrice,
        user: req.body.user,
    }) 

    order = await order.save();

    if (!order) {
        return res.status(404).send('the order cannot be created')
    }

    res.send(order);
})


router.put('/:id', async (req, res)=>{

    const order = await Order.findByIdAndUpdate(
        req.params.id,
        {
            status: req.body.status,
        },
        {new: true}
    )

    if (!order) {
        return res.status(500).json({success:false, message: 'The order with given ID was not found'});
    }

    return res.status(200).json({order})
   
})


router.delete('/:id', (req, res)=>{
    Order.findByIdAndRemove(req.params.id).then(async order=>{
        if (order) {
            await order.OrderItems.map(async orderItem => {
                await OrderItem.findByIdAndRemove(orderItem)
            })
            return res.status(200).json({success:true, message: 'the order is deleted!'})
        } else{
            return res.status(404).json({success:false, message:'order not found!'})
        }
    }).catch(err=>{
        return res.status(400).json({success:true, error:err})
    })
})

router.get('/get/totalsales', async(req, res) => {
    const totalSales = await Order.aggregate([
        { $group: {_id: null, totalsales: { $sum : '$totalPrice'}}}
    ])

    if (!totalSales) {
        return res.status(400).send('The order sales cannot be generated')
    }

    return res.send({totalSales: totalSales.pop().totalsales})
})

router.get('/get/count', async (req, res) =>{
    let OrderCount = await Order.countDocuments();

    if (!OrderCount) {
        return res.status(500).json({success:false, message: 'The OrderCount  was not found'});
    }

    return res.status(200).json({OrderCount: OrderCount})
})

module.exports= router;
