import { createCartWithItem } from "./../../utils/createCartWithItem";
import { addItemToCart } from "./../../utils/addItemToCart";

export default async function handler(req, res) {
  try {
    const { itemId, quantity, cartId } = req.body || "{}";
    // console.log(itemId, quantity, cartId, "IF");
    // const { itemId, quantity, cartId } = JSON.parse(data);
    // console.log(itemId, quantity, cartId, "good");

    if (cartId) {
      console.log("--------------------------------");
      console.log("Adding item to existing cart...");
      console.log("--------------------------------");

      const shopifyResponse = await addItemToCart({
        cartId,
        itemId,
        quantity,
      });

      const cart = {
        ...shopifyResponse.data.cartLinesAdd.cart,
        lines: shopifyResponse.data.cartLinesAdd.cart.lines.edges.map(
          ({ node }) => node
        ),
      };
      //   console.log(cart);
      res.status(200).send(cart);
      return {
        statusCode: 200,
        body: JSON.stringify(cart),
      };
    } else {
      console.log("--------------------------------");
      console.log("Creating new cart with item...");
      console.log("--------------------------------");
      const createCartResponse = await createCartWithItem();

      // console.log(createCartResponse.body, "okk");

      const cart = {
        ...createCartResponse.body,
        id: createCartResponse.body.cartId,
        checkoutUrl: createCartResponse.body.checkoutUrl,
      };
      // console.log(cart, "cartty");

      res.status(200).send(cart);

      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
        },
        body: cart,
      };
    }

    // res.statusCode = 200;
    // res.setHeader("Location", "http://localhost:8888");
    // res.end();
  } catch (error) {
    console.log(error);
  }
}
