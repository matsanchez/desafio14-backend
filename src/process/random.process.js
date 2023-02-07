process.on("message", (message) => {
  const result = randomNumbers(message);
  process.send(result);
});

const randomNumbers = (cantidad) => {
  let arrayRandom = [];
  for (let i = 0; i < cantidad; i++) {
    let i = Math.floor(Math.random() * 1001);
    arrayRandom.push(i);
  }
  let resultado = {};
  arrayRandom.forEach((acc) => (resultado[acc] = resultado[acc] + 1 || 1));
  return resultado;
};
