import { parse } from "querystring";
import { postToShopify } from "../util/postToShopify";

export default async function handler(req, res) {
  const { cartId } = parse(req.body);

  try {
    const response = await postToShopify({
      query: `
        query checkoutURL($cartId: ID!) {
          cart(id: $cartId) {
            checkoutUrl
          }
        }
      `,
      variables: {
        cartId,
      },
    });

    if (!response.cart.checkoutUrl) {
      throw new Error("No checkout URL returned");
    }

    return {
      statusCode: 301,
      headers: {
        Location: response.cart.checkoutUrl,
      },
      body: "Redirecting to checkout...",
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
}
