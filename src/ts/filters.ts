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
            <label for="${price}">${price}</label>
          </li>
        `;
    });

    Filter.open();
    Filter.select();
    Filter.apply();
    Filter.clear();
  },

  open: () => {
    const $filter = document.querySelectorAll(".shelf__filter-content__option");

    $filter.forEach((filter) => {
      filter.addEventListener("click", () => {
        const $options = filter.nextElementSibling;
        $options.classList.toggle("show");
      });
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

        const isSelected = filter.getAttribute("data-selected") === "true";

        filter.setAttribute("data-selected", isSelected ? "false" : "true");
      });
    });
  },

  apply: () => {
    // get all checkbox and shelf__filter-content__options__input
    let selectedFilters: string[] = [];
    const $buttonApply = document.querySelector(
      ".shelf__filter-content-menu-button.apply"
    );
    $buttonApply.addEventListener("click", () => {
      const $inputs = document.querySelectorAll(
        ".shelf__filter-content__options__input"
      );

      $inputs.forEach((input) => {
        const $input = input.querySelector("input");
        if ($input.checked) {
          selectedFilters.push($input.value);
        }

        if (input.getAttribute("data-selected") === "true") {
          selectedFilters.push($input.value);
        }

        input.setAttribute("data-selected", "false");
        $input.checked = false;
      });

      Filter.search(selectedFilters);
      selectedFilters = [];
    });
  },

  search: (selectedFilters: string[]) => {
    console.log(selectedFilters);
  },

  clear: () => {
    const $buttonClear = document.querySelector(
      ".shelf__filter-content-menu-button.clean"
    );
    $buttonClear.addEventListener("click", () => {
      const $inputs = document.querySelectorAll(
        ".shelf__filter-content__options__input"
      );
      $inputs.forEach((input) => {
        input.setAttribute("data-selected", "false");
        const $input = input.querySelector("input");
        $input.checked = false;
      });
    });
  },
};

Filter.init();
