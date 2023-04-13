import { createProducts } from "./createProducts";
import { Filter } from "./filters";
import { Cart } from "./cart";

export const serverUrl = "http://localhost:5000";
export const limit = 4;

const Default = {
  init: function () {
    document.addEventListener("DOMContentLoaded", () => {
      Default.getProducts();
      Default.showMoreProducts();
      Default.goToTop();

      Filter.setup();
      Cart.setup();
    });

    Default.openMenu("filter", "filter");
    Default.openMenu("order", "order");
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

    Default.buyProduct();
  },

  buyProduct: () => {
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
      });
    });
  },

  showMoreProducts: () => {
    const $buttonShowMoreProducts =
      document.querySelector<HTMLButtonElement>(".shelf__show-more")!;

    $buttonShowMoreProducts.addEventListener("click", async () => {
      const search = $buttonShowMoreProducts.getAttribute("data-search");
      let currentPage = Number($buttonShowMoreProducts.dataset.page);

      let response: Response;

      interface SearchOption {
        sort: string;
        order: string;
      }

      interface SearchOptions {
        [key: string]: SearchOption;
      }

      const searchOptions: SearchOptions = {
        recent: {
          sort: "date",
          order: "desc",
        },
        "lowest-price": {
          sort: "price",
          order: "desc",
        },
        "highest-price": {
          sort: "price",
          order: "asc",
        },
        id: {
          sort: "id",
          order: "asc",
        },
      };

      const searchOption: SearchOption | undefined = searchOptions[search];

      if (searchOption) {
        const { sort, order } = searchOption;

        response = await fetch(
          `${serverUrl}/products?_sort=${sort}&_order=${order}&_limit=${limit}&_page=${
            currentPage + 1
          }`
        );

        console.log(response);
      }

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

      Default.buyProduct();
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

  goToTop: () => {
    const $goToTop = document.querySelector(".go-top");

    window.addEventListener("scroll", () => {
      const scroll = window.scrollY;

      $goToTop.addEventListener("click", () => {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      });

      if (scroll > 200) {
        $goToTop.classList.add("show");
      } else {
        $goToTop.classList.remove("show");
      }
    });
  },
};

Default.init();
