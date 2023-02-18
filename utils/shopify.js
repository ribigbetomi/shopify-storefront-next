import { default as fetch } from "node-fetch";

export const postToShopify = async ({ query, variables = {} }) => {
  try {
    // tommyfooties.myshopify.com/api/2023-01/graphql.json

    const result = await fetch(process.env.SHOPIFY_API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token":
          process.env.SHOPIFY_STOREFRONT_API_TOKEN,
      },
      body: JSON.stringify({ query, variables }),
    }).then((res) => res.json());

    if (result.errors) {
      console.log({ errors: result.error }, "hmm");
    } else if (!result || !result.data) {
      console.log(result);
      return "No results found";
    }

    return result;

    // fetch("https://your-store.myshopify.com/api/graphql", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     query: `
    //   query {
    //     shop {
    //       name
    //     }
    //   }
    // `,
    //   }),
    // })
    //   .then((response) => {
    //     console.log(response.headers.get("X-Shopify-Storefront-Api-Version"));
    //     return response.json();
    //   })
    //   .then((data) => console.log(data));
  } catch (error) {
    console.log(error, "ok");
  }
};
