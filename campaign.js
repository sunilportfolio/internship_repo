const express = require("express");
const mongoose = require("mongoose");

const shop_app = express();
const port = 3000;

shop_app.use(express.json());
mongoose
  .connect("mongodb://localhost:27017/test")
  .then(() => console.log("Database connected"))
  .catch((e) => console.log(e));

const campaignSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  productId: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: false },
  amount: { type: Number, required: true },
  percentage: { type: String, required: true },
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, required: true },
});

const Campaign = mongoose.model("Campaign", campaignSchema);

const productSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, required: false },
  price: { type: Number, required: true },
  category: {
    type: String,
    required: true,
    enum: ["Electronics", "Clothing", "Food"],
  },
  url: { type: String, required: false },
  stock: { type: String, required: true },
  size: { type: String, required: true },
  composition: { type: String, required: true },
  color: { type: String, required: true },
  weight: { type: String, required: true },
  images: { type: String, required: true },
  campaign_Id: { type: String, required: true },
});

const Product = mongoose.model("Product", productSchema);
shop_app.post("/products", async (req, res) => {
  try {
    const campaign_Id = Math.floor(Math.random() * 1000);
    const productId = Math.floor(Math.random() * 1000);
    const campaign = new Campaign({
      id: campaign_Id,
      productId,
      name: req.body.campaign.name,
      description: req.body.campaign.description,
      amount: req.body.campaign.amount,
      percentage: req.body.campaign.percentage,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await campaign.save();

    const product = new Product({
      id: productId,
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      url: req.body.url,
      stock: req.body.stock,
      size: req.body.size,
      composition: req.body.composition,
      color: req.body.color,
      weight: req.body.weight,
      images: req.body.images,
      campaign_Id: campaign_Id,
    });
    await product.save();

    res.send({
      status: "SUCCESS",
      message: "Product created successfully",
      product: {
        productId,
      },
    });
  } catch (error) {
    res.send({ status: "ERROR", 
      message: error.message });
  }
});
shop_app.get("/Get_all_products", async (req, res) => {
  try {
    page = req.body.pageNumber;
    pageSize = 8;

    const products = await Product.aggregate([
      { $skip: (page - 1) * pageSize },
      { $limit: pageSize },
    ]);

    res.send({
      status: "SUCCESS",
      metadata: { page, pageSize, products: products.length },
      data: products,
    });
  } catch (error) {
    res.send({ status: "ERROR", message: error.message });
  }
});

shop_app.post("/find_product", async (req, res) => {
  //input validation
  try {
    const product = await Product.findOne({ id: req.body.id });
    if (!product) {
      return res.send({ status: "FAIL", message: "Product not found" });
    } else {
      res.send({ status: "SUCCESS", message: "Product found", data: product });
    }
  } catch (error) {
    res.send({ status: "ERROR", message: error.message });
  }
});
shop_app.post("/delete-note", async (req, res) => {
  try {
    const id = req.body.id;
    console.log(id);

    if (!id) {
      throw new Error("ID is required");
    }

    const deletedNote = await Product.findOneAndDelete({ id });

    if (!deletedNote) {
      return res.send({
        status: "ERROR",
        message: "Note not found",
      });
    }

    res.send({
      status: "SUCCESS",
      message: "Note deleted successfully",
    });
  } catch (error) {
    res.send({
      status: "ERROR",
      message: error.message,
    });
  }
});
shop_app.post("/update-product", async (req, res) => {
  
try{
  const id = req.body.id;
  if (!id) {
    throw new Error("ID is required");
  }
    
    await product.findOneAndUpdate(
      { id: idValue },
      {
        name: req.body.name,
        description: req.body.description,
        updatedAt: new Date(),
      }
    ).exec();
    return res.send({
      status: "success",
      message: "Note updated successfully",
    })

  } catch (error) {
    console.log(`Note not found with error - ${error.message}`);
    return res.send ({status: "fail",
      message : error.message,
     })
    }
    });
shop_app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
