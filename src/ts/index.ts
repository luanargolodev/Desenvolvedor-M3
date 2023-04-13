import { Product } from "./Product";
import { formatNumberToMoney } from "./formatNumberToMoney";

const serverUrl = "http://localhost:5000";

const Default = {
  init: function () {
    document.addEventListener("DOMContentLoaded", () => {
      Default.getProducts();
    });
  },

  getProducts: async () => {
    const limit = 4;

    const response = await fetch(
      `${serverUrl}/products?&_limit=${limit}&_page=1`
    );
    const data = await response.json();

    if (response.status !== 200) {
      throw new Error(data.message);
    }

    const products = data.map((product: Product) => {
      return `
        <div class="shelf__product">
          <img
            class="shelf__product-image"
            src="${product.image}"
            alt="${product.name}"
          />
          <h3 class="shelf__product-name">${product.name}</h3>
          <span class="shelf__product-price">${formatNumberToMoney(
            product.price
          )}</span>
          <span class="shelf__product-installments">até ${
            product.parcelamento[0]
          }x de R$ ${product.parcelamento[1]}</span>
          <button class="shelf__product-buybutton">Comprar</button>
        </div>`;
    });

    const $shelf = document.querySelector(".shelf__products")!;
    $shelf.innerHTML = products.join("");
  },
};

Default.init();
