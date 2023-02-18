import { removeItemFromCart } from "./../../utils/removeFromCartItem";

export default async function handler(req, res) {
  const { cartId, lineId } = req.body;

  try {
    console.log("--------------------------------");
    console.log("Removing item from cart...");
    console.log("--------------------------------");
    const shopifyResponse = await removeItemFromCart({
      cartId,
      lineId,
    });
    res.status(200).send(shopifyResponse);
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(shopifyResponse.cartLinesRemove.cart),
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error }),
    };
  }
}
