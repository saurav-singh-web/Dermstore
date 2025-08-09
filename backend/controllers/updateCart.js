//backend/controllers/updateCaty.js

export async function updateCart(req, res, next) {
  try {
    console.log("updateCart received", req.user.id, req.body);

    const { productId, quantity } = req.body;
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) cart = new Cart({ user: req.user.id, items: [] });

    // Log before modifying items
    console.log("Before modification, cart:", cart.items);

    const idx = cart.items.findIndex((i) => i.product.equals(productId));
    if (idx > -1) {
      if (quantity <= 0) cart.items.splice(idx, 1);
      else cart.items[idx].quantity = quantity;
    } else if (quantity > 0) {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    const updated = await cart.populate("items.product");

    console.log("After save, updated items:", updated.items);

    return res.json({ items: updated.items });
  } catch (err) {
    next(err);
  }
}
