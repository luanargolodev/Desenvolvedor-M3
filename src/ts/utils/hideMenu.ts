export function hideMenu() {
  const $menuOrder = document.querySelector(".shelf__filter.order");
  const $menuFilter = document.querySelector(".shelf__filter.filter");
  const $menuDesktop = document.querySelector(".shelf__top__order__box");

  $menuOrder.classList.remove("show");
  $menuFilter.classList.remove("show");
  $menuDesktop.classList.remove("show");
}
