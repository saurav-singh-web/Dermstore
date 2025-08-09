import Cart from "../models/Cart.js";
import Order from "../models/Order.js";
import Address from "../models/Address.js";

export const getCart = async (req, res, next) => {
  console.log("GET /api/cart called by", req.user?.id);

  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate(
      "items.product"
    );
    const items = (cart?.items || []).filter((i) => i.product);
    return res.json({
      items,
      couponCode: cart?.couponCode || null,
      discountAmount: cart?.discountAmount || 0,
    });
  } catch (err) {
    next(err);
  }
};

export const updateCart = async (req, res, next) => {
  try {
    const { productId, quantity, couponCode } = req.body;
    console.log("📥 UpdateCart input:", { productId, quantity, couponCode });

    let cart =
      (await Cart.findOne({ user: req.user.id })) ||
      new Cart({ user: req.user.id, items: [] });
    console.log("🛒 Cart found:", cart?._id);

    const idx = cart.items.findIndex((i) => i.product.toString() === productId);

    if (idx > -1) {
      if (quantity <= 0) cart.items.splice(idx, 1);
      else cart.items[idx].quantity = quantity;
    } else if (quantity > 0) {
      cart.items.push({ product: productId, quantity });
    }

    const populatedCart = await cart.populate("items.product");
    const items = populatedCart.items.filter((i) => i.product);

    const totalQuantity = items.reduce((sum, i) => sum + i.quantity, 0);
    const subtotal = items.reduce(
      (sum, i) => sum + i.quantity * i.product.price,
      0
    );
    const discountAmount = couponCode === "SAVE10" ? subtotal * 0.1 : 0;
    const totalPrice = subtotal - discountAmount;

    // Save discount and coupon in cart
    cart.couponCode = couponCode || undefined;
    cart.discountAmount = discountAmount;

    await cart.save();

    await Order.findOneAndUpdate(
      { user: req.user.id },
      {
        $set: {
          items: items.map((i) => ({
            product: i.product._id,
            quantity: i.quantity,
            priceAtAdding: i.product.price,
          })),
          subTotal: subtotal,
          totalQuantity,
          discountAmount,
          totalPrice, // ✅ Final price after applying discount
          couponCode,
        },
      },

      { upsert: true, new: true }
    );
    console.log("✅ Order updated");

    return res.json({ items, couponCode, discountAmount });
  } catch (err) {
    console.error("❌ Error in updateCart:", err);
    next(err);
  }
};

export const cartSummary = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;

    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) cart = new Cart({ user: req.user.id, items: [] });

    // Remove any existing instance of the product
    cart.items = cart.items.filter((i) => i.product.toString() !== productId);

    // Add or update if positive quantity
    if (quantity > 0) {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();

    // Populate full product details
    const updated = await cart.populate("items.product");
    const validItems = updated.items.filter((i) => i.product);

    // Compute order summary
    const totalQuantity = validItems.reduce((sum, i) => sum + i.quantity, 0);
    const totalPrice = validItems.reduce(
      (sum, i) => sum + i.quantity * i.product.price,
      0
    );

    // Create an Order summary document
    await Order.create({
      user: req.user.id,
      items: validItems.map((i) => ({
        product: i.product._id,
        quantity: i.quantity,
        priceAtAdding: i.product.price,
      })),
      totalQuantity,
      totalPrice,
    });

    return res.json({ items: validItems });
  } catch (err) {
    next(err);
  }
};

export const placeOrder = async (req, res, next) => {
  try {
    const { form } = req.body;
    const cart = await Cart.findOne({ user: req.user.id }).populate(
      "items.product"
    );
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Save or update the user's billing address
    let address = await Address.findOne({ user: req.user.id });
    if (!address) {
      address = await Address.create({ user: req.user.id, ...form });
      console.log("New address created:", address);
    } else {
      Object.assign(address, form);
      await address.save();
      console.log("Address updated:", address);
    }

    // Compute order details
    const items = cart.items.map((i) => ({
      product: i.product._id,
      quantity: i.quantity,
      priceAtAdding: i.product.price,
    }));
    const totalQuantity = items.reduce((sum, i) => sum + i.quantity, 0);
    const subTotal = items.reduce(
      (sum, i) => sum + i.quantity * i.priceAtAdding,
      0
    );
    const { couponCode, discountAmount = 0 } = cart;
    const totalPrice = subTotal - discountAmount;

    // Create the order document
    await Order.create({
      user: req.user.id,
      items,
      totalQuantity,
      subTotal,
      discountAmount,
      couponCode,
      totalPrice,
      shippingAddress: form,
    });

    // Optionally clear the cart
    cart.items = [];
    cart.couponCode = undefined;
    cart.discountAmount = 0;
    await cart.save();

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};
