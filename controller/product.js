const Product = require('../models/product')
const User = require('../models/user')
const slugify = require('slugify')

exports.create = async(req,res)=>{
    try{
        console.log(req.body)
        req.body.slug = slugify(req.body.title)
        const newProduct = await new Product(req.body).save()
        res.json(newProduct)
    }catch(err){
        // res.status(400).send("Create Product failed")
        res.status(400).json({
            err:err.message
        })
        console.log(err)

    }
}

exports.listAll = async (req,res)=>{
    let products = await Product.find({})
    .limit(parseInt(req.params.count))
    .populate("category")
    .populate("subs")
    .sort([["createdAt","desc"]])
    .exec()

    res.json(products)
}

exports.remove = async (req,res) => {
    try{
        const deletedproduct = await Product.findOneAndRemove({slug:req.params.slug}).exec()
        res.json(deletedproduct)
    }catch(err){
        res.status(400).send("Product Delete Failed")
        console.log(err)
    }
}

exports.read = async (req,res) => {
    let product = await Product.findOne({slug:req.params.slug})
    .populate("category")
    .populate("subs")
    .exec()

    res.json(product)
}

exports.update = async(req,res) => {
    try{
        if(req.body.title){
            req.body.slug = slugify(req.body.title)
        }
        const updatedproduct = await Product.findOneAndUpdate({slug:req.params.slug},req.body,{new:true}).exec()
        res.json(updatedproduct)
    }catch(err){
        res.status(400).json({
            err: err.message
        })
    }
}

//WITHOUT PAGINATION
// exports.list = async(req,res) => {
//     try{
//         const {sort,order,limit} = req.body
//         let products = await Product.find({})
//         .populate("category")
//         .populate("subs")
//         .sort([[sort,order]])
//         .limit(limit)
//         .exec()

//         res.json(products)
//     }catch(err){
//         console.log(err)
//     }
// }

//WITH PAGINATION
exports.list = async(req,res) => {
    try{
        const {sort,order,page} = req.body
        const currentPage = page || 1
        const perPage = 3
        let products = await Product.find({})
        .skip((currentPage - 1)*perPage)
        .populate("category")
        .populate("subs")
        .sort([[sort,order]])
        .limit(perPage)
        .exec()

        res.json(products)
    }catch(err){
        console.log(err)
    }
}


exports.count = async(req,res) => {
    try{
        const productcount = await Product.find({}).estimatedDocumentCount().exec()
        res.json(productcount)
    }catch(err){
        req.status(400)
    }
}

// exports.ratingProduct = async(req,res) => {
//     const product = await Product.findById(req.params.productId).exec()
//     const user = await User.findOne({email: req.user.email}).exec()
//     const {newRating} = req.body;

//     let existingRatingObject = product.ratings.find((ele)=> ele.postedBy == user._id)

//     //if the user have never left a rating before

//     if(existingRatingObject === undefined){
//         let ratingAdded = await Product.findByIdAndUpdate(product._id,{
//             $push: {ratings: {star:newRating,postedBy:user._id}}
//         },{new:true}).exec()
//         res.json(ratingAdded)

//         //if the user have a left a rating before
//     } else {
//         const ratingUpdated = await Product.updateOne(
//             {ratings: {$elemMatch: existingRatingObject}},
//             {$set:{"ratings.$.star": newRating}},
//             {new:true}
//         ).exec()
//         res.json(ratingUpdated)
//     }
// }

exports.productStar = async (req, res) => {
    const product = await Product.findById(req.params.productId).exec();
    const user = await User.findOne({ email: req.user.email }).exec();
    const { star } = req.body;
  
    // who is updating?
    // check if currently logged in user have already added rating to this product?
    let existingRatingObject = product.ratings.find(
      (ele) => ele.postedBy.toString() === user._id.toString()
    );
  
    // if user haven't left rating yet, push it
    if (existingRatingObject === undefined) {
      let ratingAdded = await Product.findByIdAndUpdate(
        product._id,
        {
          $push: { ratings: { star, postedBy: user._id } },
        },
        { new: true }
      ).exec();
      console.log("ratingAdded", ratingAdded);
      res.json(ratingAdded);
    } else {
      // if user have already left rating, update it
      const ratingUpdated = await Product.updateOne(
        {
          ratings: { $elemMatch: existingRatingObject },
        },
        { $set: { "ratings.$.star": star } },
        { new: true }
      ).exec();
      console.log("ratingUpdated", ratingUpdated);
      res.json(ratingUpdated);
    }
  };

  exports.listRelatedProduct = async(req,res) => {
      const product = await Product.findById(req.params.productId).exec()
      const related = await Product.find({
          _id: {$ne : product._id},
          category: product.category
      }).limit(3)
      .populate('subs')
      .populate('category')
      .populate('postedBy')

      res.json(related)
  }

  //search controller

  const handleQuery = async(req,res,query) => {
    const products = await Product.find({$text:{$search:query}})
    .populate("category")
    .populate("subs")
    .exec()

    res.json(products)
  }

  const handlePrice = async (req,res,price) => {
      try{
          let products = await Product.find({
              price:{
                  $gte:price[0],
                  $lte:price[1],
              }
          })
          .populate("category")
          .populate("subs")
          .exec()

          res.json(products)
      }
      catch(err){
          console.log(err)
      }
  }

  const handleCategory = async (req,res,category) => {
      try{
          let products = await Product.find({category})
          .populate("category")
          .populate("subs")
          .exec()

          res.json(products)
      }
      catch(err){
          console.log(err)
      }
  }

  const handleStar = (req, res, stars) => {
    Product.aggregate([
      {
        $project: {
          document: "$$ROOT",
          // title: "$title",
          floorAverage: {
            $floor: { $avg: "$ratings.star" }, // floor value of 3.33 will be 3
          },
        },
      },
      { $match: { floorAverage: stars } },
    ])
      .limit(12)
      .exec((err, aggregates) => {
        if (err) console.log("AGGREGATE ERROR", err);
        Product.find({ _id: aggregates })
          .populate("category", "_id name")
          .populate("subs", "_id name")
          .populate("postedBy", "_id name")
          .exec((err, products) => {
            if (err) console.log("PRODUCT AGGREGATE ERROR", err);
            res.send(products);
          });
      });
  };

  const handleSub = async(req,res,sub) => {
      try{
        let products = await Product.find({subs:sub})
        .populate("category")
        .populate("subs")
        .exec()
        res.json(products)
      }catch(err){
          console.log(err)
      }
  }

  const handleShipping = async(req,res,shipping) => {
    try{
        let products = await Product.find({shipping})
        .populate("category")
        .populate("subs")
        .exec()
        res.json(products)
      }catch(err){
          console.log(err)
      }
  }

  const handleBrand = async(req,res,brand) => {
    try{
        let products = await Product.find({brand})
        .populate("category")
        .populate("subs")
        .exec()
        res.json(products)
      }catch(err){
          console.log(err)
      }
  }

  const handleColor = async(req,res,color) => {
    try{
        let products = await Product.find({color})
        .populate("category")
        .populate("subs")
        .exec()
        res.json(products)
      }catch(err){
          console.log(err)
      }
  }

  exports.filterSearch = async(req,res) => {
      const {query,price,category,stars,sub,shipping,brand,color} = req.body
      if (query){
          await handleQuery(req,res,query)
      }

      if(price !== undefined){
          await handlePrice(req,res,price)
      }

      if(category){
          await handleCategory(req,res,category)
      }

      if(stars){
          await handleStar(req,res,stars)
      }

      if(sub){
          await handleSub(req,res,sub)
      }

      if(shipping){
          await handleShipping(req,res,shipping)
      }

      if(brand){
        await handleBrand(req,res,brand)
    }

    if(color){
        await handleColor(req,res,color)
    }
  }
