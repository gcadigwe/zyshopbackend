const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema

const CartSchema = new mongoose.Schema({
    products: [
        {
            product:{
                type: ObjectId,
                ref: 'Product',
            },
            count: Number,
            color: String,
            price: Number
        

        }
    ],
    totalCartPrice: Number,
    totalPriceAfterDiscount: Number,
    orderedBy: {
        type: ObjectId,
        ref: 'User'
    },
},{timestamps:true})

module.exports = mongoose.model("Cart",CartSchema)