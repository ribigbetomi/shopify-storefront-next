// import { postToShopify } from "./shopify";

// // Creates a cart with a single item
// export const createCartWithItem = async ({ itemId, quantity }) => {
//   try {
//     const response = await postToShopify({
//       query: `
//       mutation createCart($cartInput: cartInput) {
//         cartCreate(input: $cartInput) {
//           cart {
//             id
//             createdAt
//             updatedAt
//             lines(first:10) {
//               edges {
//                 node {
//                   id
//                   quantity
//                   merchandise {
//                     ... on ProductVariant {
//                       id
//                       title
//                       price {
//                         amount
//                         currencyCode
//                       }
//                       product {
//                         id
//                         title
//                       }
//                     }
//                   }
//                 }
//               }
//             }
//             cost {
//               totalAmount {
//                 amount
//                 currencyCode
//               }
//             }
//           }
//         }
//       }
//       `,
//       variables: {
//         cartInput: {
//           lines: [
//             {
//               quantity,
//               merchandiseId: itemId,
//             },
//           ],
//         },
//       },
//     });

//     return response;
//   }
//   catch (error) {
//     console.log(error);
//   }
// };

import { postToShopify } from "./shopify";

// Creates a cart with a single item
export const createCartWithItem = async () => {
  try {
    const { data } = await postToShopify({
      query: `
        mutation CreateCart {
            cartCreate {
                cart {
                    checkoutUrl
                    id
                }
            }
        }
        `,
      variables: {},
    });

    if (!data) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          message: "There was a problem creating a cart",
        }),
      };
    }

    return {
      statusCode: 200,
      body: {
        cartId: data.cartCreate?.cart?.id,
        checkoutUrl: data.cartCreate?.cart?.checkoutUrl,
      },
    };
  } catch (error) {
    console.log(error);
  }
};
