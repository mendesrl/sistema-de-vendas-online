import { ValidateCpf } from "../src/ValidateCpf";

test("Deve testar um CPF válido", () => {
  const isValid = ValidateCpf("041.273.711-61");

  expect(isValid).toBeTruthy();
});

test('Deve testar um CPF inválido', () =>{
    const isValid = ValidateCpf("041-7648-09");

    expect(isValid).toBeFalsy();
})