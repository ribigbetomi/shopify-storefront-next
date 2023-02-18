import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import styles from "../styles/Home.module.css";
import { useEffect, useState } from "react";
import Router from "next/router";

// export async function getStaticProps() {
//   const url = new URL("http://localhost:8888" || "http://localhost:3000");
//   url.pathname = "/api/cart";

//   const res = await fetch(url.toString());

//   if (!res.ok) {
//     console.error(res);
//     return { props: {} };
//   }
//   const data = await res.json();

//   return {
//     props: data,
//   };
// }

export default function Cart() {
  const [cart, setCart] = useState({ id: null, lines: [] });
  const [open, setOpen] = useState(false);

  let localCartData;
  useEffect(() => {
    localCartData =
      JSON.parse(window.localStorage.getItem("shopify-cart")) || null;
    // console.log(localCartData);
    if (localCartData) {
      async function loadCart() {
        const existingCart = await fetch(
          `http://localhost:8888/api/loadCart?cartId=${localCartData.id}`
        ).then((res) => res.json());

        setCart({
          id: localCartData.id,
          checkoutUrl: localCartData.checkoutUrl,
          estimatedCost:
            existingCart.data.cart.estimatedCost.totalAmount.amount,
          lines: existingCart.data.cart.lines.edges,
        });
      }
      loadCart();

      return;
    } else {
      async function getCart() {
        localCartData = await fetch("http://localhost:8888/api/cart").then(
          (res) => res.json()
        );
        // .then((res) => console.log(res, "res"))
        // console.log(localCartData);
        setCart({
          id: localCartData.id,
          checkoutUrl: localCartData.checkoutUrl,
          estimatedCost: null,
          lines: [],
        });
        window.localStorage.setItem(
          "shopify-cart",
          JSON.stringify(localCartData)
        );
      }

      getCart();
      // console.log(cart, "cart good");

      return;
    }
  }, [localCartData]);

  function toggleCart() {
    setOpen(!open);
  }

  function emptyCart() {
    window.localStorage.removeItem("shopify-cart");
  }

  let cost = Number(cart?.estimateCost?.totalAmount?.amount || 0);

  // if (
  //   cart.lines.some(
  //     (e) => e.node.merchandise?.product?.title === "Black Leather Bag"
  //   )
  // ) {
  //   cost = cost - 10;
  // }
  // console.log(cartId, "cartid");

  async function removeItem(lineId, cartId) {
    const url = new URL("http://localhost:8888" || "http://localhost:3000");
    url.pathname = "/api/removeFromCart";

    // const { cartId } = JSON.parse(window.localStorage.getItem("shopify-cart"));

    const body = {
      lineId,
      cartId,
    };
    const res = await fetch(url.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }).then((res) => res.json());

    if (!res.ok) {
      console.error("There was a problem removing the item from the cart");
    }
    //   console.log(res, "Added");

    Router.push("http://localhost:8888");
  }

  async function checkout() {}
  return (
    <div className="cart">
      {/* <button class="icon" onClick={toggleCart}>
        <img src="/images/cart.svg" alt="cart" />
        <div class="count">{cart.lines.length}</div>
      </button> */}
      <div class={`drawer ${open ? "open" : ""}`}>
        {/* <button class="close" onClick={toggleCart}>
          &times; close
        </button> */}

        <h3>Your Cart</h3>
        {cart.lines.length > 0 ? (
          <>
            <ul>
              {cart.lines.map(({ node: item }) => {
                let lineId = item.id;
                let cartId = cart.id;
                {
                  console.log(item.id, "zz");
                }
                // {
                //   console.log(lineId, cartId, "itemId");
                // }
                return (
                  <li>
                    <p>
                      {item.quantity} &times; {item.merchandise?.product?.title}
                    </p>
                    <button onClick={() => removeItem(lineId, cartId)}>
                      Remove
                    </button>
                  </li>
                );
              })}
              <li class="total">
                <p>Total: {cost === 0 ? "FREE" : `$${cost}`}</p>
              </li>
            </ul>
            <a class="button" href={`${cart.checkoutUrl}`}>
              Check Out
            </a>
            <button class="empty-cart" onClick={emptyCart}>
              empty cart
            </button>
          </>
        ) : (
          <p class="no-items">your cart is empty</p>
        )}
      </div>
    </div>
  );
}
