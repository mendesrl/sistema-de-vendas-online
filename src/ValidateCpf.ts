export function ValidateCpf(str: string) {
  if (!str) return false;
  str = str.replace(/\D/g, '');
  if (str.length !== 11) return false;
  const allDigitsEqual = !str.split("").every((c) => c === str[0]);
  if (!allDigitsEqual) return false;

  let d1 = 0;
  let d2 = 0;

  for (let nCount = 1; nCount < str.length - 1; nCount++) {
    const digito = parseInt(str.substring(nCount - 1, nCount));

    d1 = d1 + (11 - nCount) * digito;

    d2 = d2 + (12 - nCount) * digito;
  }
  let rest = d1 % 11;

  let dg1 = rest < 2 ? 0 : 11 - rest;
  d2 += 2 * dg1;
  rest = d2 % 11;
  const dg2 = rest < 2 ? 0 :  11 - rest;

  let nDigVerific = str.substring(str.length - 2, str.length);
  let nDigResult = "" + dg1 + "" + dg2;
  return nDigVerific == nDigResult;
}
