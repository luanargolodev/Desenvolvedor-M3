export const getValueMinAndMax = (price: string) => {
  let minNumber = 0;
  let maxNumber = 0;

  if (price.includes(" - ")) {
    const [min, max] = price.split(" - ");
    minNumber = Number(min.replace("R$ ", "").replace(",", "."));
    maxNumber = Number(max.replace("R$ ", "").replace(",", "."));
  } else {
    minNumber = maxNumber = Number(price.replace("R$ ", "").replace(",", "."));
  }

  return { min: minNumber, max: maxNumber };
};
