import { postToShopify } from "./shopify";

export const removeItemFromCart = async ({ cartId, lineId }) => {
  try {
    const shopifyResponse = await postToShopify({
      query: `
          mutation removeItemFromCart($cartId: ID!, $lineIds: [ID!]!) {
            cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
              cart {
                id
                lines(first: 10) {
                  edges {
                    node {
                      id
                      quantity
                      merchandise {
                        ... on ProductVariant {
                          id
                          title
                          price {
                            amount
                            currencyCode
                          }
                          product {
                            title
                            handle
                          }
                        }
                      }
                    }
                  }
                }
                estimatedCost {
                  totalAmount {
                    amount
                    currencyCode
                  }
                  subtotalAmount {
                    amount
                    currencyCode
                  }
                  totalTaxAmount {
                    amount
                    currencyCode
                  }
                  totalDutyAmount {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
        `,
      variables: {
        cartId,
        lineIds: [lineId],
      },
    });

    return shopifyResponse;
  } catch (error) {
    console.log(error);
  }
};
