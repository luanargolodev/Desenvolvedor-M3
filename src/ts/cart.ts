import { serverUrl } from "./index";
import { Product } from "./types/Product";
import { formatNumberToMoney } from "./utils/formatNumberToMoney";

function toggleCart() {
  const $cart = document.querySelector(".cart");
  $cart.classList.toggle("show");
}

export const Cart = {
  init: function () {
    Cart.update();
    Cart.open();
    Cart.close();
  },

  setup: async () => {
    const productsStorage = localStorage.getItem("products");
    if (productsStorage) {
      const products = JSON.parse(productsStorage);
      const ids = products.map((product: any) => Number(product.id));

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

      data.forEach((product: Product) => {
        const productQuantity: number = products.find(
          (productStorage: Product) => productStorage.id === product.id
        ).quantity;

        totalValueToProducts += product.price * productQuantity;

        const productContainer = document.createElement("div");
        productContainer.innerHTML = `
          <div class="cart__container__product">
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
            </div>
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

  open: () => {
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
};

Cart.init();
