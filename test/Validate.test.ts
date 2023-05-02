import Validate from "../src/Validate";

test("should be cpf is valid", function () {
  const valid = new Validate("041.237.711-61");
  expect(() => valid.isValid("041.237.711-61")).toThrowError(
    "O CPF é invalido"
  );
});
