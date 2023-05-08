function isValidLength(cpf: string) {
  return cpf.length !== 11;
}

export function ValidateCpf(cpf: string) {
  if (!cpf) return false;
  cpf = cpf.replace(/\D/g, '');
  if (isValidLength(cpf)) return false;
  const allDigitsEqual = !cpf.split("").every((c) => c === cpf[0]);
  if (!allDigitsEqual) return false;

  let d1 = 0;
  let d2 = 0;

  for (let nCount = 1; nCount < cpf.length - 1; nCount++) {
    const digito = parseInt(cpf.substring(nCount - 1, nCount));

    d1 = d1 + (11 - nCount) * digito;

    d2 = d2 + (12 - nCount) * digito;
  }
  let rest = d1 % 11;

  let dg1 = rest < 2 ? 0 : 11 - rest;
  d2 += 2 * dg1;
  rest = d2 % 11;
  const dg2 = rest < 2 ? 0 :  11 - rest;

  let nDigVerific = cpf.substring(cpf.length - 2, cpf.length);
  let nDigResult = "" + dg1 + "" + dg2;
  return nDigVerific == nDigResult;
}
