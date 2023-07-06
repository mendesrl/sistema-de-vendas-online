import Cpf from "../src/Cpf";

test("Should be create a valid CPF:", () => {
  const cpf = new Cpf("041.273.711-61");
  expect(cpf).toBeDefined();
});

test("Shound't be create a invalid CPF:", () => {
    expect(()=> new Cpf("000.000.000-00") ).toThrowError("Invalid Cpf");
  });
