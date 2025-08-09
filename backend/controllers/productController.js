import Product from "../models/Product.js";

export const createProduct = async (req, res) => {
  try {
    const { title, description, category, brand, price, stock, image } =
      req.body;

    // Basic field validation
    if (
      [title, description, category, price, stock].some(
        (field) => field === undefined || field === ""
      )
    ) {
      return res
        .status(400)
        .json({ message: "All required fields must be filled" });
    }

    const newProduct = new Product({
      seller: req.user.id,
      title,
      description,
      category,
      brand,
      price,
      stock,
      image,
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Product upload failed", error: err.message });
  }
};

// 2. Get Seller’s Own Products
export const getMyProducts = async (req, res) => {
  const products = await Product.find({ seller: req.user.id });
  res.json(products);
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (err) {
    console.error("Error fetching product:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 3. Update Product
export const updateProduct = async (req, res) => {
  const updatableFields = [
    "title",
    "description",
    "category",
    "brand",
    "price",
    "stock",
    "image",
  ];
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Not found" });
  if (product.seller.toString() !== req.user.id)
    return res.status(403).json({ message: "Not authorized" });

  Object.assign(product, req.body);
  const updated = await product.save();
  res.json(updated);
};

// 4. Delete Product
export const deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Not found" });
  if (product.seller.toString() !== req.user.id)
    return res.status(403).json({ message: "Not authorized" });

  await product.deleteOne();
  res.json({ message: "Deleted successfully" });
};

export const getAllProducts = async (req, res) => {
  try {
    const search = req.query.search?.trim();

    let query = {};
    let projection = {};
    if (search) {
      query = {
        $or: [
          { title: { $regex: search, $options: "i" } }, // match in title
          { description: { $regex: search, $options: "i" } }, // match in description
          { category: { $regex: search, $options: "i" } }, // match in category
        ],
      };
      projection = { title: 1, _id: 1 };
    }

    const products = await Product.find(query, projection).limit(
      search ? 10 : 50
    );

    res.json(products);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ message: "Server error" });
  }
};
