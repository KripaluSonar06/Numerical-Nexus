import numpy as np
import math
from scipy.special import erf
from numpy.polynomial.legendre import leggauss
from fastapi import APIRouter

router = APIRouter()

# ============================================================
# Helper functions
# ============================================================

def find_A(n, x):
    Q = np.zeros((n + 2, n + 2))
    for i in range(n + 2):
        for j in range(n + 2):
            Q[i, j] = x[i] ** j
    C = np.zeros((n + 2, n + 2))
    for i in range(n + 2):
        for j in range(1, n + 2):
            C[i, j] = j * (x[i] ** (j - 1))
    return C @ np.linalg.inv(Q)

def find_B(n, x):
    Q = np.zeros((n + 2, n + 2))
    for i in range(n + 2):
        for j in range(n + 2):
            Q[i, j] = x[i] ** j
    C = np.zeros((n + 2, n + 2))
    for i in range(n + 2):
        for j in range(2, n + 2):
            C[i, j] = j * (j - 1) * (x[i] ** (j - 2))
    return C @ np.linalg.inv(Q)

def bary_weights(x):
    n = len(x)
    w = np.ones(n)
    for j in range(n):
        diff = x[j] - np.delete(x, j)
        w[j] = 1.0 / np.prod(diff)
    return w

def diff_matrix(x):
    n = len(x)
    w = bary_weights(x)
    D = np.zeros((n, n))
    for i in range(n):
        xi = x[i]
        for j in range(n):
            if i != j:
                D[i, j] = w[j] / (w[i] * (xi - x[j]))
    D[np.arange(n), np.arange(n)] = -np.sum(D, axis=1)
    return D

def gl_roots_with_endpoints(n):
    xi, _ = leggauss(n)
    return np.concatenate(([0.0], 0.5 * (xi + 1.0), [1.0]))

def coeff_2nd_diff(x): return x
def coeff_1st_diff(x): return (1 + 2 * math.log(max(x, 1e-12)))


# ============================================================
# Core computation endpoint
# ============================================================

@router.post("/compute_temp")
async def compute_temperature(params: dict):
    """
    Compute T(X, τ) numerically and analytically for a given τ.
    Example POST body:
    {
      "tau": 0.5,
      "n": 8,
      "To": 273,
      "Ts": 373,
      "alpha": 1e-5,
      "L": 5
    }
    """
    tau = float(params.get("tau", 1.0))
    n = int(params.get("n", 8))
    To = float(params.get("To", 273))
    Ts = float(params.get("Ts", 373))
    alpha = float(params.get("alpha", 1e-5))
    L = float(params.get("L", 5))

    # --------------------------------------------------------
    # Collocation setup
    # --------------------------------------------------------
    x = gl_roots_with_endpoints(n)
    y = np.zeros(n + 2)

    if n < 20:
        A = find_A(n, x)
        B = find_B(n, x)
    else:
        D = diff_matrix(x)
        A = D
        B = D @ D

    y[0] = 1
    y[n + 1] = 0
    coeffs = np.zeros((n + 2, n + 2))
    for i in range(1, n + 1):
        for j in range(n + 2):
            coeffs[i, j] = coeff_2nd_diff(x[i]) * B[i, j] + coeff_1st_diff(x[i]) * A[i, j]

    C = np.zeros((n, n))
    Dv = np.zeros(n)
    for i in range(n):
        for j in range(n):
            C[i, j] = coeffs[i + 1, j + 1]
        Dv[i] = - (y[0] * coeffs[i + 1, 0] + y[n + 1] * coeffs[i + 1, n + 1])

    y_inner = np.linalg.solve(C, Dv)
    for i in range(n):
        y[i + 1] = y_inner[i]

    # Polynomial coefficients
    Q = np.zeros((n + 2, n + 2))
    for i in range(n + 2):
        for j in range(n + 2):
            Q[i, j] = x[i] ** j
    d = np.linalg.solve(Q, y)

    def f_eta(eta):
        eta = np.clip(eta, 0, 50)  # avoids overflow in exp(-eta)
        z = np.exp(-eta)
        return sum((z ** i) * d[i] for i in range(n + 2))

    def T_X_tau(X, tau):
        smallest_num = math.ulp(0.0)
        eta = X / (2 * np.sqrt(max(alpha * tau, smallest_num)))
        return To + (Ts - To) * f_eta(eta)

    def T_analytical(X, tau):
        smallest_num = math.ulp(0.0)
        return To + (Ts - To) * erf(X / (2 * np.sqrt(max(alpha * tau, smallest_num))))

    # --------------------------------------------------------
    # Compute over range
    # --------------------------------------------------------
    X_vals = np.linspace(0, L, 200)
    T_coll = [T_X_tau(X, tau) for X in X_vals]
    T_anal = [T_analytical(X, tau) for X in X_vals]

    # --------------------------------------------------------
    # Return data
    # --------------------------------------------------------
    return {
        "X": X_vals.tolist(),
        "T_coll": T_coll,
        "T_anal": T_anal,
        "tau": tau,
        "n": n,
        "To": To,
        "Ts": Ts,
        "alpha": alpha,
        "L": L
    }
