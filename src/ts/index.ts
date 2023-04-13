import { createProducts } from "./createProducts";

const serverUrl = "http://localhost:5000";
const limit = 4;

const Shelf = {
  init: function () {
    document.addEventListener("DOMContentLoaded", () => {
      Shelf.getProducts();
      Shelf.showMoreProducts();
    });

    Shelf.openMenu("filter", "filter");
    Shelf.openMenu("order", "order");
  },

  getProducts: async () => {
    const response = await fetch(
      `${serverUrl}/products?&_limit=${limit}&_page=1`
    );
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    const productsHtml = createProducts(data);

    const $shelf = document.querySelector(".shelf__products")!;
    $shelf.innerHTML = productsHtml;

    Shelf.setupBuyProduct();
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

      const productsHtml = createProducts(data);
      const $shelf = document.querySelector(".shelf__products")!;
      $shelf.innerHTML += productsHtml;

      currentPage++;
      $buttonShowMoreProducts.dataset.page = String(currentPage);

      if (data.length === 0) {
        $buttonShowMoreProducts.textContent =
          "Não há mais produtos para serem exibidos";
        $buttonShowMoreProducts.disabled = true;
        $buttonShowMoreProducts.classList.add("empty");
      }

      Shelf.setupBuyProduct();
    });
  },

  openMenu: (buttonClass: string, filterClass: string) => {
    const $menuButton = document.querySelector(
      `.shelf__top__button.${buttonClass}`
    );
    const $filter = document.querySelector(`.shelf__filter.${filterClass}`);
    const $closeButton = $filter.querySelector(".shelf__filter-top__close");

    $menuButton.addEventListener("click", () => {
      $filter.classList.add("show");
    });

    $closeButton.addEventListener("click", () => {
      $filter.classList.remove("show");
    });
  },
};

Shelf.init();
