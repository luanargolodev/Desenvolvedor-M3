import { Product } from "./Product";
import { formatNumberToMoney } from "./formatNumberToMoney";

const serverUrl = "http://localhost:5000";
const limit = 4;

const Shelf = {
  init: function () {
    document.addEventListener("DOMContentLoaded", () => {
      Shelf.getProducts();
      Shelf.showMoreProducts();
    });
  },

  getProducts: async () => {
    const response = await fetch(
      `${serverUrl}/products?&_limit=${limit}&_page=1`
    );
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    const productsHtml = Shelf.createProductsHtml(data);

    const $shelf = document.querySelector(".shelf__products")!;
    $shelf.innerHTML = productsHtml;

    Shelf.setupBuyProduct();
  },

  createProductsHtml: (products: Product[]): string => {
    return products
      .map((product) => {
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
      })
      .join("");
  },

  setupBuyProduct: () => {
    const $buttonBuy = document.querySelectorAll(".shelf__product-buybutton");
    const $numberProductsInCart = document.querySelector(
      ".header__content__cart-text"
    )!;

    $buttonBuy.forEach((button) => {
      button.addEventListener("click", () => {
        alert("Produto comprado com sucesso!");

        const numberProducts = Number($numberProductsInCart.textContent);
        $numberProductsInCart.textContent = String(numberProducts + 1);
      });
    });
  },

  showMoreProducts: () => {
    const $buttonShowMoreProducts =
      document.querySelector<HTMLButtonElement>(".shelf__show-more")!;
    let currentPage = 1;

    $buttonShowMoreProducts.addEventListener("click", async () => {
      const response = await fetch(
        `${serverUrl}/products?&_limit=${limit}&_page=${currentPage + 1}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      const productsHtml = Shelf.createProductsHtml(data);
      const $shelf = document.querySelector(".shelf__products")!;
      $shelf.innerHTML += productsHtml;

      currentPage++;
      $buttonShowMoreProducts.dataset.page = String(currentPage);

      Shelf.setupBuyProduct();
    });
  },
};

Shelf.init();
