const mongoose = require('mongoose')



const OrderSchema = mongoose.Schema({
    name: String,
    orderItems:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OrderItem',
        required: true
    }],
    shippingAddress1: {
        type: String,
        required: true
    },
    shippingAddress2: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    zip: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        default: 'Pending'
    },
    totalPrice: {
        type: Number
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    dateOrdered: {
        type: Date,
        default: Date.now
    }
})


OrderSchema.virtual('id').get(function(){
    return this._id.toHexString();
});

OrderSchema.set('toJSON', {
    virtuals: true
})

exports.Order = mongoose.model('Order', OrderSchema);

