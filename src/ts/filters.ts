import { serverUrl, limit } from "./index";
import { createProducts } from "./createProducts";
import { separateNumbers } from "./utils/separateNumbers";
import { hideMenu } from "./utils/hideMenu";
import { Cart } from "./cart";

const filters = {
  colors: [
    "Amarelo",
    "Azul",
    "Branco",
    "Cinza",
    "Laranja",
    "Verde",
    "Vermelho",
    "Preto",
    "Rosa",
    "Vinho",
  ],
  sizes: ["P", "M", "G", "GG", "U", "36", "38", "40"],
  prices: [
    "R$ 0,00 - R$ 50,00",
    "R$ 51,00 - R$ 150,00",
    "R$ 151,00 - R$ 300,00",
    "R$ 301,00 - R$ 500,00",
    "R$ 501,00",
  ],
  textPrices: [
    "de R$0 até R$50",
    "de R$51 até R$150",
    "de R$151 até R$300",
    "de R$301 até R$500",
    "a partir de R$500",
  ],
};

export const Filter = {
  init: function () {},

  setup: () => {
    const $filterColors = document.querySelector(
      ".shelf__filter-content__options.colors"
    );
    const $filterSizes = document.querySelector(
      ".shelf__filter-content__options.sizes"
    );
    const $filtersPrices = document.querySelector(
      ".shelf__filter-content__options.prices"
    );

    const $filterColorsDesktop = document.querySelector(
      ".shelf__filter-content__options.colors.desktop"
    );
    const $filterSizesDesktop = document.querySelector(
      ".shelf__filter-content__options.sizes.desktop"
    );
    const $filtersPricesDesktop = document.querySelector(
      ".shelf__filter-content__options.prices.desktop"
    );

    filters.colors.forEach((color) => {
      $filterColors.innerHTML += `
          <li class="shelf__filter-content__options__input">
            <input type="checkbox" id="${color}" name="${color}" value="${color}" />
            <label for="${color}">${color}</label>
          </li>
        `;
    });

    filters.sizes.forEach((size) => {
      $filterSizes.innerHTML += `
          <li class="shelf__filter-content__options__input" data-selected="false">
            <input type="checkbox" id="${size}" name="${size}" value="${size}" />
            <label for="${size}">${size}</label>
          </li>
        `;
    });

    filters.prices.forEach((price) => {
      $filtersPrices.innerHTML += `
          <li class="shelf__filter-content__options__input">
            <input type="checkbox" id="${price}" name="${price}" value="${price}" />
            <label for="${price}">${
        filters.textPrices[filters.prices.indexOf(price)]
      }</label>
          </li>
        `;
    });

    // desktop
    filters.colors.forEach((color, index) => {
      console.log(color, index);

      $filterColorsDesktop.innerHTML += `
          <li class="shelf__filter-content__options__input ${
            index >= 5 ? "hide" : ""
          }">
            <input type="checkbox" id="${
              color + "-desktop"
            }" name="${color}" value="${color}" />
            <label for="${color + "-desktop"}">${color}</label>
          </li>
        `;
    });

    filters.sizes.forEach((size) => {
      $filterSizesDesktop.innerHTML += `
          <li class="shelf__filter-content__options__input" data-selected="false">
            <input type="checkbox" id="${
              size + "-desktop"
            }" name="${size}" value="${size}" />
            <label for="${size + "-desktop"}">${size}</label>
          </li>
        `;
    });

    filters.prices.forEach((price) => {
      $filtersPricesDesktop.innerHTML += `
          <li class="shelf__filter-content__options__input">
            <input type="checkbox" id="${
              price + "-desktop"
            }" name="${price}" value="${price}" />
            <label for="${price + "-desktop"}">${
        filters.textPrices[filters.prices.indexOf(price)]
      }</label>
          </li>
        `;
    });

    const $showMoreFilters = document.createElement("button");
    $showMoreFilters.classList.add("shelf__filter-content__options__show-more");
    $showMoreFilters.innerHTML = "Ver todas as cores";
    $filterColorsDesktop.appendChild($showMoreFilters);

    $showMoreFilters.addEventListener("click", () => {
      const $filters = document.querySelectorAll(
        ".shelf__filter-content__options.colors.desktop .shelf__filter-content__options__input.hide"
      );

      $filters.forEach((filter) => {
        filter.classList.toggle("hide");
      });
    });

    Filter.open();
    Filter.select();
    Filter.apply();
    Filter.clear();
    Filter.orderBy();
  },

  open: () => {
    const $filter = document.querySelectorAll(
      ".shelf__filter-content__option:not(.order)"
    );

    $filter.forEach((filter) => {
      filter.addEventListener("click", () => {
        const $options = filter.nextElementSibling;
        $options.classList.toggle("show");
      });
    });

    const $filterDesktop = document.querySelector(".shelf__top__order__title");
    $filterDesktop.addEventListener("click", () => {
      const $options = $filterDesktop.nextElementSibling;
      $options.classList.toggle("show");
    });
  },

  select: () => {
    const $filters = document.querySelectorAll(
      ".shelf__filter-content__options__input"
    );
    $filters.forEach((filter) => {
      if (filter.getAttribute("data-selected") === null) return;

      filter.addEventListener("click", (e) => {
        e.preventDefault();

        if (window.innerWidth > 1024) {
          const checkbox = filter.querySelector<HTMLInputElement>(
            'input[type="checkbox"'
          );
          checkbox.checked = true;
        }

        const isSelected = filter.getAttribute("data-selected") === "true";

        filter.setAttribute("data-selected", isSelected ? "false" : "true");
      });
    });
  },

  apply: () => {
    let selectedFilters: string[] = [];
    const $buttonApply = document.querySelectorAll(
      ".shelf__filter-content-menu-button.apply"
    );
    $buttonApply.forEach((buttonApply) => {
      buttonApply.addEventListener("click", () => {
        const $inputs = document.querySelectorAll(
          ".shelf__filter-content__options__input"
        );

        $inputs.forEach((input) => {
          const $input = input.querySelector("input");
          if ($input.checked) {
            selectedFilters.push($input.value);
          } else if (input.getAttribute("data-selected") === "true") {
            selectedFilters.push($input.value);
          }

          input.setAttribute("data-selected", "false");
          $input.checked = false;
        });

        if (selectedFilters.length === 0) return;

        Filter.search(selectedFilters);
        selectedFilters = [];
      });
    });
  },

  search: async (selectedFilters: string[]) => {
    // separate filters to colors, price and size
    const colors = selectedFilters.filter((filter) =>
      filters.colors.includes(filter)
    );

    const sizes = selectedFilters.filter((filter) =>
      filters.sizes.includes(filter)
    );

    const prices = selectedFilters.filter((filter) =>
      filters.prices.includes(filter)
    );

    const pricesFiltered = separateNumbers(prices);

    let baseUrlRequest = `${serverUrl}/products?_limit=${limit}&_page=1`;
    if (colors.length > 0) {
      baseUrlRequest += `&color_like=${colors}`;
    }

    if (sizes.length > 0) {
      baseUrlRequest += `&size_like=${sizes}`;
    }

    if (pricesFiltered.length > 0) {
      for (let i = 0; i < pricesFiltered.length; i += 2) {
        const priceMin = pricesFiltered[i];
        const priceMax = pricesFiltered[i + 1];
        baseUrlRequest += `&price_gte=${priceMin}&price_lte=${priceMax}&`;
      }

      baseUrlRequest = baseUrlRequest.slice(0, -1);
    }

    const response = await fetch(baseUrlRequest);
    const data: [] = await response.json();

    const productsHtml = createProducts(data);
    const $shelf = document.querySelector(".shelf__products")!;
    $shelf.innerHTML = productsHtml;

    const $buttonShowMore =
      document.querySelector<HTMLButtonElement>(".shelf__show-more");
    $buttonShowMore.setAttribute("data-search", "search");
    $buttonShowMore.setAttribute("data-page", "1");
    $buttonShowMore.textContent = "Carregar mais";
    $buttonShowMore.disabled = false;
    $buttonShowMore.classList.remove("empty");

    if (data.length === 0) {
      const _productsNotFound = document.createElement("h3");
      _productsNotFound.classList.add("shelf__products-not-found");
      _productsNotFound.textContent = "Opsss! Nenhum produto encontrado.";
      $shelf.appendChild(_productsNotFound);
    }

    hideMenu();
    Cart.add();
  },

  clear: () => {
    const $buttonClear = document.querySelectorAll(
      ".shelf__filter-content-menu-button.clean"
    );
    $buttonClear.forEach((buttonClear) => {
      buttonClear.addEventListener("click", () => {
        const $inputs = document.querySelectorAll(
          ".shelf__filter-content__options__input"
        );
        $inputs.forEach((input) => {
          input.setAttribute("data-selected", "false");
          const $input = input.querySelector("input");
          $input.checked = false;
        });
      });
    });
  },

  orderBy: () => {
    const orders = [
      // mobile
      {
        classSelector: ".shelf__filter-content__option.recent",
        searchParams: { sort: "date", order: "desc" },
        buttonSearch: "recent",
      },
      {
        classSelector: ".shelf__filter-content__option.lowest-price",
        searchParams: { sort: "price", order: "asc" },
        buttonSearch: "lowest-price",
      },
      {
        classSelector: ".shelf__filter-content__option.highest-price",
        searchParams: { sort: "price", order: "desc" },
        buttonSearch: "highest-price",
      },
      // desktop
      {
        classSelector: ".shelf__top__order__box__item.recent",
        searchParams: { sort: "date", order: "desc" },
        buttonSearch: "recent",
        text: "Mais recentes",
      },
      {
        classSelector: ".shelf__top__order__box__item.lowest-price",
        searchParams: { sort: "price", order: "asc" },
        buttonSearch: "lowest-price",
        text: "Menor preço",
      },
      {
        classSelector: ".shelf__top__order__box__item.highest-price",
        searchParams: { sort: "price", order: "desc" },
        buttonSearch: "highest-price",
        text: "Maior preço",
      },
    ];

    orders.forEach((order) => {
      const orderByOption = document.querySelector(order.classSelector);
      orderByOption.addEventListener("click", async () => {
        const response = await fetch(
          `${serverUrl}/products?_sort=${order.searchParams.sort}&_order=${order.searchParams.order}&_limit=${limit}&_page=1`
        );
        const data = await response.json();

        const productsHtml = createProducts(data);
        const $shelf = document.querySelector(".shelf__products")!;
        $shelf.innerHTML = productsHtml;

        const $buttonShowMore =
          document.querySelector<HTMLButtonElement>(".shelf__show-more");
        $buttonShowMore.setAttribute("data-search", order.buttonSearch);
        $buttonShowMore.setAttribute("data-page", "1");
        $buttonShowMore.textContent = "Carregar mais";
        $buttonShowMore.disabled = false;
        $buttonShowMore.classList.remove("empty");

        if (order.text) {
          const $text = document.querySelector(".shelf__top__order__title");
          $text.textContent = order.text;
        }

        hideMenu();
        Cart.add();
      });
    });
  },
};

Filter.init();
