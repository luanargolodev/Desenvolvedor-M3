import { serverUrl } from "./index";
import { Product } from "./types/Product";
import { formatNumberToMoney } from "./utils/formatNumberToMoney";

function toggleCart() {
  const $cart = document.querySelector(".cart");
  $cart.classList.toggle("show");
}

export const Cart = {
  init: function () {
    Cart.add();
    Cart.update();
    Cart.open();
    Cart.close();
  },

  setup: async () => {
    const productsStorage = localStorage.getItem("products");
    if (productsStorage) {
      const products = JSON.parse(productsStorage);
      const ids = products.map((product: any) => Number(product.id));

      const hasProductInCart = document.querySelectorAll(
        ".cart__container__products .cart__container__product"
      );
      if (hasProductInCart.length > 0) {
        hasProductInCart.forEach((product) => {
          product.remove();
        });
      }

      const response = await fetch(
        `${serverUrl}/products?id=${ids.join("&id=")}`
      );
      const data = await response.json();

      const $cartItems = document.querySelector(".cart__container__itens");
      $cartItems.textContent = `(${Cart.update()} itens)`;

      const $cartContainer = document.querySelector(
        ".cart__container__products"
      )! as HTMLDivElement;

      let totalValueToProducts = 0;

      const dataWithoutDuplicates = data.filter(
        (product: Product, index: number) =>
          data.findIndex((productFind: Product) => {
            return productFind.id === product.id;
          }) === index
      );

      dataWithoutDuplicates.forEach((product: Product) => {
        const productQuantity: number = products.find(
          (productStorage: Product) => productStorage.id === product.id
        ).quantity;

        totalValueToProducts += product.price * productQuantity;

        const productContainer = document.createElement("div");
        productContainer.classList.add("cart__container__product");
        productContainer.innerHTML = `
          <div class="cart__container__product-image">
            <img src="${product.image}" alt="${product.name}" />
          </div>
      
          <div class="cart__container__product-content">
            <h3 class="cart__container__product-content-title">
              ${product.name}
            </h3>
            <span class="cart__container__product-content-quantity"
              >Quantidade: ${productQuantity}</span
            >
            <span class="cart__container__product-content-price"
              >${formatNumberToMoney(product.price)}</span
            >
            <span class="cart__container__product-content-trash" data-id="${
              product.id
            }">
              Deletar
            </span>
          </div>
        `;

        $cartContainer.appendChild(productContainer);
      });

      const $valueTotal = document.querySelector(
        ".cart__container__total span"
      );
      $valueTotal.textContent = `Total: ${formatNumberToMoney(
        totalValueToProducts
      )}`;
    }

    Cart.trash();
  },

  add: () => {
    const $buttonBuy = document.querySelectorAll(".shelf__product-buybutton");
    const $numberProductsInCart = document.querySelector(
      ".header__content__cart-text"
    )!;

    $buttonBuy.forEach((button) => {
      button.addEventListener("click", () => {
        alert("Produto adicionado ao carrinho!");

        const numberProducts = Number($numberProductsInCart.textContent);
        $numberProductsInCart.textContent = String(numberProducts + 1);

        const id = button.getAttribute("data-id");
        const quantity = 1;

        const products = localStorage.getItem("products");
        if (products) {
          const productsArray = JSON.parse(products);
          const product = productsArray.find(
            (product: any) => product.id === id
          );
          if (product) {
            product.quantity += quantity;
          } else {
            productsArray.push({ id, quantity });
          }
          localStorage.setItem("products", JSON.stringify(productsArray));
        } else {
          localStorage.setItem("products", JSON.stringify([{ id, quantity }]));
        }

        Cart.setup();
      });
    });
  },

  update: () => {
    const $numberProductsInCart = document.querySelector(
      ".header__content__cart-text"
    )!;

    const products = localStorage.getItem("products");
    if (products) {
      const productsArray = JSON.parse(products);
      const numberProducts = productsArray.reduce(
        (acc: number, product: any) => acc + product.quantity,
        0
      );
      $numberProductsInCart.textContent = String(numberProducts);
    }

    return $numberProductsInCart.textContent;
  },

  open: async () => {
    const $buttonCart = document.querySelector(".header__content__cart");
    $buttonCart.addEventListener("click", () => {
      toggleCart();
    });
  },

  close: () => {
    const $buttonClose = document.querySelector(".cart__container__close");
    $buttonClose.addEventListener("click", () => {
      toggleCart();
    });
  },

  trash: () => {
    const $trash = document.querySelectorAll(
      ".cart__container__product-content-trash"
    );

    $trash.forEach((trash) => {
      trash.addEventListener("click", async () => {
        const id = trash.getAttribute("data-id");
        const products = localStorage.getItem("products");
        if (products) {
          const productsArray = JSON.parse(products);
          const newProductsArray = productsArray.filter(
            (product: any) => product.id !== id
          );
          await localStorage.setItem(
            "products",
            JSON.stringify(newProductsArray)
          );

          Cart.setup();
        }
      });
    });
  },
};

Cart.init();
