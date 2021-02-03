const Sub = require("../models/sub")
const Slugify = require('slugify')
const Product = require('../models/product')

exports.create = async (req,res) => {
    //create 
    try{
        const {name,parent} = req.body
        const sub = await new Sub({name,parent,slug: Slugify(name)}).save()
        res.json(sub)
    }catch(err){
        console.log('CREATE SUB ---->',err)
        res.status(400).send("Create category failed")
    }
}

exports.remove = async (req,res) => {
    //remove controller
    try{
        const deletedsub = await Sub.findOneAndDelete({slug:req.params.slug})
        res.json(deletedsub)
    }catch(err){
        res.status(400).send("Delete failed")
    }
}

exports.list = async (req,res) => {
    //list route
    const list = await Sub.find({}).sort({createdAt: -1}).exec()
    res.json(list)
}

exports.update = async(req,res) => {
    //update route
    const {name,parent} = req.body
    try{
        const updatedsub = await Sub.findOneAndUpdate({slug: req.params.slug},{name,parent, slug: Slugify(name)},{new:true})
        res.send(updatedsub)
    }catch(err){
        res.status(400).send("Sub cannot be updated")
    }
}

exports.read = async(req,res) => {
    //read route
    const sub = await Sub.findOne({slug: req.params.slug}).exec()
    const product = await Product.find({subs:sub})
    .populate("category")
    .exec()

    res.json({
        sub,
        product
    })
}