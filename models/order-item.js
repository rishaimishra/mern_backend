const mongoose = require('mongoose')



const OrderItemSchema = mongoose.Schema({
    quantity: {
        type: Number,
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    }
})

OrderItemSchema.virtual('id').get(function(){
    return this._id.toHexString();
});

OrderItemSchema.set('toJSON', {
    virtuals: true
})

exports.OrderItem = mongoose.model('OrderItem', OrderItemSchema);

