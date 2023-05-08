import { ValidateCpf } from "../src/ValidateCpf";

test.each([
  "041.273.711-61",
  "356.191.631-72",
  "447.118.751-15"
])("Should be valid CPF: %s", (cpf:string) => {
  const isValid = ValidateCpf(cpf);

  expect(isValid).toBeTruthy();
});


test.each([
  "041.273.711-00",
  "041.273.711-01",
  "447-118-751.15",
  "447.118"
])("Should be invalid CPF: %s", (cpf:string) => {
  const isValid = ValidateCpf(cpf);

  expect(isValid).toBeFalsy();
});

test.each([
  "111.111.111-11",
])("Should be invalid if numbers %s are the same", (cpf:string) => {
  const isValid = ValidateCpf(cpf);

  expect(isValid).toBeFalsy();
});
  

