const Category = require("../models/category")
const Slugify = require('slugify')
const Sub = require("../models/sub")
const Product = require("../models/product")


exports.create = async (req,res) => {
    //create 
    try{
        const {name} = req.body
        const category = await new Category({name,slug: Slugify(name)}).save()
        res.json(category)
    }catch{
        res.status(400).send("Create category failed")
    }
}

exports.remove = async (req,res) => {
    //remove controller
    try{
        const deletedcategory = await Category.findOneAndDelete({slug:req.params.slug})
        res.json(deletedcategory)
    }catch(err){ 
        res.status(400).send("Delete failed")
    }
}

exports.list = async (req,res) => {
    //list route
    const list = await Category.find({}).sort({createdAt: -1}).exec()
    res.json(list)
}

exports.update = async(req,res) => {
    //update route
    const {name} = req.body
    try{
        const updatedcategory = await Category.findOneAndUpdate({slug: req.params.slug},{name, slug: Slugify(name)},{new:true})
        res.send(updatedcategory)
    }catch(err){
        res.status(400).send("Category cannot be updated")
    }
}

exports.read = async(req,res) => {
    //read route
    const category = await Category.findOne({slug: req.params.slug}).exec()
    const products = await Product.find({category})
    .populate("category")
    .exec()
    res.json({
        category,
        products
    })
}

exports.getSubs = async(req,res) => {
    try{
        const sub = await  Sub.find({parent:req.params._id})
        res.send(sub)
    }catch(err){
        console.log(err)
        res.status(400).send("Cannot get Subs")
    }
}