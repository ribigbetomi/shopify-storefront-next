import Head from "next/head";
import Image from "next/image";
import styles from "@/styles/Home.module.css";
import { useEffect } from "react";

export async function getStaticProps() {
  const url = new URL("http://localhost:8888" || "http://localhost:3000");
  url.pathname = "/api/products";

  const res = await fetch(url.toString());
  // const data = await fetch("/api/products");

  if (!res.ok) {
    console.error(res);
    return { props: {} };
  }
  const { data } = await res.json();
  // console.log(data);

  // filter on quantity > 0

  const products = data.products.edges
    .map(({ node }) => {
      if (node.totalInventory <= 0) {
        return false;
      }

      return {
        id: node.id,
        title: node.title,
        description: node.description,
        price: node.variants.edges[0].node.price.amount,
        imageSrc: node.images.edges[0].node.src,
        imageAlt: node.title,
        slug: node.handle,
        variantId: node.variants.edges[0].node.id,
      };
    })
    .filter(Boolean);

  // const createCartResponse = await fetch(
  //   "http://localhost:8888/api/createCart"
  // ).then((res) => res.json());

  // console.log(createCartResponse.body, "okk");

  // window.localStorage.setItem("cart", JSON.stringify(createCartResponse));

  return {
    props: {
      products,
    },
  };
}

function Product({ product }) {
  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "ngn",
  });
  return (
    <div className={styles.product}>
      <a href={`/product/${product.slug}`}>
        <Image
          src={product.imageSrc}
          alt={product.imageAlt}
          width={100}
          height="100"
        />
      </a>
      <h2>{product.title} </h2>
      <p>{product.description} </p>
      <p className={styles.price}>{formattedPrice.format(product.price)} </p>
    </div>
  );
}

export default function Home({ products }) {
  // console.log(createCartResponse, "ii");

  async function createCart() {
    const createCartResponse = await fetch(
      "http://localhost:8888/api/createCart"
    ).then((res) => res.json());

    console.log(createCartResponse, "ok");

    window.localStorage.setItem(
      "shopify-cart",
      JSON.stringify(createCartResponse)
    );
  }
  createCart();

  return (
    <div className={styles.container}>
      <Head>
        <title>Adetomi's Shopify Store</title>
        <meta name="description" content="Shopify Store" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Store</h1>
        <a href="/cart">Go To Cart</a>
        <div className={styles.products}>
          {products.map((product) => (
            <Product key={product.id} product={product} />
          ))}
          {/* <pre>{JSON.stringify(products, null, 2)}</pre> */}
        </div>
      </main>
    </div>
  );
}
