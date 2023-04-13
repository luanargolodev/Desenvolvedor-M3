export function separateNumbers(valores: string[]): number[] {
  const numeros: number[] = [];
  const regex = /R\$ (\d{1,3}),(\d{2}) - R\$ (\d{1,3}),(\d{2})/;

  for (const valor of valores) {
    const matches = valor.match(regex);
    if (matches) {
      const valueMin = Number(`${matches[1]}.${matches[2]}`);
      const valueMax = Number(`${matches[3]}.${matches[4]}`);
      numeros.push(valueMin, valueMax);
    }
  }

  return numeros;
}
