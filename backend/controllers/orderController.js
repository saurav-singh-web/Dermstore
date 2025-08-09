import Cart from "../models/Cart.js";
import Order from "../models/Order.js";
import Address from "../models/Address.js";

export const placeOrder = async (req, res, next) => {
  try {
    const { form } = req.body;
    const userId = req.user.id;

    const cart = await Cart.findOne({ user: userId }).populate("items.product");
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    let address = await Address.findOne({ user: userId });
    if (!address) {
      address = await Address.create({ user: userId, ...form });
    } else {
      Object.assign(address, form);
      await address.save();
    }

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

    await Order.create({
      user: userId,
      items,
      totalQuantity,
      subTotal,
      discountAmount,
      couponCode,
      totalPrice,
      shippingAddress: form,
    });

    // Clear cart
    cart.items = [];
    cart.couponCode = undefined;
    cart.discountAmount = 0;
    await cart.save();

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};

export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .populate("items.product", "title price image");
    res.json({ orders });
  } catch (err) {
    next(err);
  }
};
