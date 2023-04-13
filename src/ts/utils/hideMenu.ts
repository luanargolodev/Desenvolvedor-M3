export function hideMenu() {
  const $menuOrder = document.querySelector(".shelf__filter.order");
  const $menuFilter = document.querySelector(".shelf__filter.filter");

  $menuOrder.classList.remove("show");
  $menuFilter.classList.remove("show");
}
