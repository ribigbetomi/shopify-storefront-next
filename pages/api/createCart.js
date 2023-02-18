import { createCartWithItem } from "./../../utils/createCartWithItem";

export default async function handler(req, res) {
  try {
    const createCartResponse = await createCartWithItem();

    // console.log(createCartResponse.body, "okk");

    const cart = {
      ...createCartResponse.body,
      id: createCartResponse.body.cartId,
      checkoutUrl: createCartResponse.body.checkoutUrl,
    };
    console.log(cart, "cart");
    res.status(200).send(cart);
    return {
      statusCode: 200,
      body: JSON.stringify(createCartResponse.body),
    };
  } catch (error) {
    console.log(error);
  }
}
