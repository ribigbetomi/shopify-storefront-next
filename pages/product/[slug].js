import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import Router from "next/router";
import styles from "../../styles/Home.module.css";

export async function getStaticPaths() {
  const url = new URL("http://localhost:8888" || "http://localhost:3000");
  url.pathname = "/api/products";
  const res = await fetch(url.toString());

  if (!res.ok) {
    console.error(res);
    return { props: {} };
  }

  const { data } = await res.json();

  return {
    paths: data.products.edges.map(({ node }) => `/product/${node.handle}`),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  //   console.log(args, "kk");
  const url = new URL("http://localhost:8888" || "http://localhost:3000");
  url.pathname = "/api/products";

  const res = await fetch(url.toString());

  if (!res.ok) {
    console.error(res);
    return { props: {} };
  }
  const { data } = await res.json();
  // console.log(data);

  // filter on quantity > 0

  const product = data.products.edges
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
    .find(({ slug }) => slug === params.slug);

  // if (typeof window !== 'undefined') {

  //     const cartId = window.localStorage.getItem("cartId")
  //     ? JSON.parse(window.localStorage.getItem("cartId"))
  //     : null;
  // }

  return {
    props: {
      product,
    },
  };
}

async function addBtn(itemId, quantity) {
  const url = new URL("http://localhost:8888" || "http://localhost:3000");
  url.pathname = "/api/cart";

  const { cartId } = JSON.parse(window.localStorage.getItem("shopify-cart"));

  const body = {
    itemId,
    quantity,
    cartId: cartId,
  };
  const res = await fetch(url.toString(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  }).then((res) => res.json());

  if (!res.ok) {
    console.error("There was a problem adding the item to the cart");
  }
  //   console.log(res, "Added");

  Router.push("http://localhost:8888/cart");
}

function Product({ product }) {
  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "usd",
  });
  let itemId = product.variantId;
  let quantity = 1;
  let test = null;

  //   console.log(JSON.stringify(test));
  return (
    <div className={styles.product}>
      {/* {console.log(product.variantId, "oo")} */}
      <a href={`/product/${product.slug}`}>
        <Image
          src={product.imageSrc}
          alt={product.imageAlt}
          //   layout="fill"
          width="100"
          height="100"
        />
      </a>
      <h2>{product.title} </h2>
      <p>{product.description} </p>
      <p className={styles.price}>{formattedPrice.format(product.price)} </p>
      {/* {console.log(itemId, quantity, "ppp")} */}
      <button onClick={() => addBtn(itemId, quantity)}>Add To Cart</button>
    </div>
  );
}

export default function ProductPage({ product }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Adetomi's Shopify Store</title>
        <meta name="description" content="Shopify Store" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Store</h1>

        <Link href="/">&larr; Back home</Link>
        <div className={styles.products}>
          <Product product={product} />
        </div>
      </main>
    </div>
  );
}
