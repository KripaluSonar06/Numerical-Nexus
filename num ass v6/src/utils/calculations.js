/*// Harshad number checker
export function isHarshadNumber(n) {
  const digitSum = n
    .toString()
    .split('')
    .reduce((sum, digit) => sum + parseInt(digit), 0)
  return n % digitSum === 0
}

// Find first non-harshad factorial
export function findFirstNonHarshadFactorial(start) {
  let factorial = 1
  for (let i = 1; i <= start; i++) {
    factorial *= i
  }
  
  let n = start
  while (true) {
    factorial *= n
    if (!isHarshadNumber(factorial)) {
      return { n, factorial }
    }
    n++
    if (n > 100) break // Safety limit
  }
  return null
}

// Find consecutive Harshad numbers
export function findConsecutiveHarshadNumbers(n, start, limit) {
  const harshadNumbers = []
  for (let i = start; i <= limit && harshadNumbers.length < n; i++) {
    if (isHarshadNumber(i)) {
      harshadNumbers.push(i)
    }
  }
  return harshadNumbers.length === n ? harshadNumbers : null
}

// Legendre polynomial
export function legendrePolynomial(n, x) {
  if (n === 0) return 1
  if (n === 1) return x
  
  let p0 = 1
  let p1 = x
  let pn = 0

  for (let i = 2; i <= n; i++) {
    pn = ((2 * i - 1) * x * p1 - (i - 1) * p0) / i
    p0 = p1
    p1 = pn
  }

  return pn
}*/
