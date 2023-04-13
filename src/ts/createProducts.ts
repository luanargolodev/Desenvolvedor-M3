import { Product } from "./types/Product";
import { formatNumberToMoney } from "./utils/formatNumberToMoney";

export function createProducts(products: Product[]): string {
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
}
