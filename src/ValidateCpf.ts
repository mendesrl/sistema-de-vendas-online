function isValidLength(cpf: string) {
  return cpf.length !== 11;
}

function allDigitsSame(cpf: string) {
  return cpf.split("").every((c) => c === cpf[0]);
}

function removeNonDigits(cpf: string) {
  return cpf.toString().replace(/\D/g, "");
}

function calculateDigit(cpf: string, factor: number) {
  let total = 0;
  for (const digit of cpf) {
    if (factor > 1) total += parseInt(digit) * factor--;
  }
  const rest = total % 11;
  return rest < 2 ? 0 : 11 - rest;
}

export function ValidateCpf(cpf: string) {
  cpf = removeNonDigits(cpf);
  if (isValidLength(cpf)) return false;
  if (allDigitsSame(cpf)) return false;

  const dg1 = calculateDigit(cpf, 10);
  const dg2 = calculateDigit(cpf, 11);

  let actualCheckDigit = cpf.slice(9);
  let calculateCheckDigit = `${dg1}${dg2}`;
  return actualCheckDigit == calculateCheckDigit;
}
