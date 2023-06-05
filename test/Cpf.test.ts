import Cpf from "../src/Cpf";

test("Should be create a valid CPF:", () => {
  const cpf = new Cpf("041.273.711-61");
  expect(cpf).toBeDefined();
});

test("Shound't be create a invalid CPF:", () => {
    expect(()=> new Cpf("000.000.000-00") ).toThrowError("Invalid Cpf");
  });

// import { ValidateCpf } from "../src/Cpf";

// test.each([
//   "041.273.711-61",
//   "356.191.631-72",
//   "447.118.751-15"
// ])("Should be valid CPF: %s", (cpf:string) => {
//   const isValid = ValidateCpf(cpf);

//   expect(isValid).toBeTruthy();
// });

// test.each([
//   "041.273.711-00",
//   "041.273.711-01",
//   "447.118"
// ])("Should be invalid CPF: %s", (cpf:string) => {
//   const isValid = ValidateCpf(cpf);

//   expect(isValid).toBeFalsy();

// });

// test.each([
//   "111.111.111-11",
// ])("Should be invalid if numbers %s are the same", (cpf:string) => {
//   const isValid = ValidateCpf(cpf);

//   expect(isValid).toBeFalsy();
// });
