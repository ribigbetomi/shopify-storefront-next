import { postToShopify } from "../../utils/shopify";

export default async function handler(_req, res) {
  try {
    const data = await postToShopify({
      query: ` {
            products(sortKey: TITLE, first: 20, reverse: true) {
                edges {
                    node {
                        id
                        handle
                        description
                        title
                        totalInventory
                        variants(first: 5) {
                            edges {
                                node {
                                    id
                                    title
                                    price {
                                        amount
                                        currencyCode
                                    }
                                }
                            }
                        }
                        images(first: 1) {
                            edges {
                                node {
                                    src
                                    altText
                                }
                            }
                        }
                    }
                }
            }
        }
        `,
      variables: {},
    });
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
  }
}
