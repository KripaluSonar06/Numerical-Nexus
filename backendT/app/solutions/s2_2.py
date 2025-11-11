# app/solutions/s2_2.py

import numpy as np
import os
import time
from numpy.polynomial import polynomial as P_mod
from numpy.polynomial import legendre as L
from typing import Dict, Any, Optional


# ===============================================================
# Utility: ensure output directory exists
# ===============================================================
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "..", "output")
os.makedirs(OUTPUT_DIR, exist_ok=True)


# ===============================================================
# HELPER FUNCTIONS
# ===============================================================

def build_legendre_tridiagonal(n: int) -> np.ndarray:
    """Constructs the n×n symmetric tridiagonal matrix (Jacobi matrix)
    for standard Legendre polynomials."""
    n_range = np.arange(1.0, n)
    beta = n_range / np.sqrt(4 * n_range**2 - 1)
    J = np.zeros((n, n))
    np.fill_diagonal(J[1:, :], beta)
    np.fill_diagonal(J[:, 1:], beta)
    return J


def lu_decomposition_fast(A):
    """Vectorized LU decomposition with partial pivoting (A = PᵀLU)."""
    A = A.copy()
    n = A.shape[0]
    L = np.eye(n)
    P = np.eye(n)
    for k in range(n - 1):
        pivot = np.argmax(np.abs(A[k:, k])) + k
        if A[pivot, k] == 0:
            raise ValueError("Singular matrix detected.")
        if pivot != k:
            A[[k, pivot]] = A[[pivot, k]]
            P[[k, pivot]] = P[[pivot, k]]
            if k > 0:
                L[[k, pivot], :k] = L[[pivot, k], :k]
        L[k + 1 :, k] = A[k + 1 :, k] / A[k, k]
        A[k + 1 :, k:] -= np.outer(L[k + 1 :, k], A[k, k:])
    U = np.triu(A)
    return P, L, U


def forward_substitution_fast(L, b):
    n = L.shape[0]
    y = np.zeros(n)
    for i in range(n):
        y[i] = b[i] - np.dot(L[i, :i], y[:i])
    return y


def backward_substitution_fast(U, y):
    n = U.shape[0]
    x = np.zeros(n)
    for i in range(n - 1, -1, -1):
        x[i] = (y[i] - np.dot(U[i, i + 1 :], x[i + 1 :])) / U[i, i]
    return x


def solve_lu_fast(A, b):
    P, L, U = lu_decomposition_fast(A)
    Pb = P @ b
    y = forward_substitution_fast(L, Pb)
    x = backward_substitution_fast(U, y)
    return x


def newton_raphson(f, f_prime, x0, tol=1e-12, max_iter=100) -> Optional[float]:
    """Finds a root of f(x) using the Newton–Raphson method."""
    x = x0
    for _ in range(max_iter):
        fx = f(x)
        if abs(fx) < tol:
            return x
        fpx = f_prime(x)
        if fpx == 0:
            return None
        x_new = x - fx / fpx
        if abs(x_new - x) < tol:
            return x_new
        x = x_new
    return None


# ===============================================================
# MAIN SOLVER FUNCTION
# ===============================================================

def solve_s2_2(params: Dict[str, Any]) -> Dict[str, Any]:
    """
    Computes the Shifted Legendre Polynomial P*_n(t), saves coefficients,
    companion matrix, roots, and LU-solver results as CSV files,
    and returns summary data as a dictionary.
    """
    n = int(params.get("n", 3))
    if n < 0:
        raise ValueError("Order n must be non-negative.")

    np.set_printoptions(precision=15, suppress=True)

    # ------------------------------------------------------------
    # STEP 1: Generate Shifted Legendre Polynomial
    # ------------------------------------------------------------
    p_leg_basis = L.Legendre.basis(n, domain=[0, 1])
    p_power_basis = p_leg_basis.convert(kind=P_mod.Polynomial, domain=[-1, 1])
    coeffs_low_to_high = p_power_basis.coef
    coeffs_high_to_low = coeffs_low_to_high[::-1]

    coeffs_file = os.path.join(OUTPUT_DIR, f"legendre_coefficients_{n}.csv")
    np.savetxt(coeffs_file, coeffs_low_to_high, delimiter=",")
    files_created = [os.path.basename(coeffs_file)]

    # ------------------------------------------------------------
    # STEP 2: Companion matrix & roots
    # ------------------------------------------------------------
    if n == 0:
        return {
            "n": n,
            "coefficients": coeffs_low_to_high.tolist(),
            "roots": [],
            "x_solution": [],
            "residual": None,
            "smallest_root": None,
            "largest_root": None,
            "files_created": files_created,
            "summary": "n=0 → Constant polynomial; no roots or matrix."
        }

    companion_mat = P_mod.polycompanion(coeffs_low_to_high)
    companion_file = os.path.join(OUTPUT_DIR, f"companion_matrix_{n}.csv")
    np.savetxt(companion_file, companion_mat, delimiter=",")
    files_created.append(os.path.basename(companion_file))

    # Compute stable tridiagonal matrix and roots
    J_n = build_legendre_tridiagonal(n)
    start_time = time.time()
    standard_roots_x = np.linalg.eigh(J_n)[0]
    elapsed = time.time() - start_time

    shifted_roots = ((standard_roots_x + 1.0) / 2.0)
    roots_file = os.path.join(OUTPUT_DIR, f"legendre_roots_{n}.csv")
    np.savetxt(roots_file, shifted_roots, delimiter=",")
    files_created.append(os.path.basename(roots_file))

    # ------------------------------------------------------------
    # STEP 3: LU Solver on companion matrix
    # ------------------------------------------------------------
    A = companion_mat
    b = np.arange(1, A.shape[0] + 1, dtype=float)
    x_solution = solve_lu_fast(A, b)
    residual = float(np.linalg.norm(A @ x_solution - b))

    x_file = os.path.join(OUTPUT_DIR, f"x_solution_lu_{n}.csv")
    np.savetxt(x_file, x_solution, delimiter=",")
    files_created.append(os.path.basename(x_file))

    # ------------------------------------------------------------
    # STEP 4: Newton–Raphson for smallest and largest roots
    # ------------------------------------------------------------
    pn_legendre_coeffs = [0.0] * n + [1.0]
    pn_legendre_deriv_coeffs = L.legder(pn_legendre_coeffs)

    def f(x): return L.legval(2 * x - 1, pn_legendre_coeffs)
    def f_prime(x): return L.legval(2 * x - 1, pn_legendre_deriv_coeffs) * 2

    if n == 1:
        initial_smallest = initial_largest = 0.5
    else:
        initial_smallest, initial_largest = 0.0, 1.0

    smallest_root = newton_raphson(f, f_prime, initial_smallest)
    largest_root = newton_raphson(f, f_prime, initial_largest)

    # ------------------------------------------------------------
    # STEP 5: Build final summary
    # ------------------------------------------------------------
    summary = (
        f"Computed {n}th-order Shifted Legendre Polynomial.\n"
        f"Found {len(shifted_roots)} roots (computed in {elapsed:.6f}s).\n"
        f"LU solver residual = {residual:.3e}."
    )

    return {
        "n": n,
        "coefficients": coeffs_low_to_high.tolist(),
        "roots": shifted_roots.tolist(),
        "x_solution": x_solution.tolist(),
        "residual": residual,
        "smallest_root": smallest_root,
        "largest_root": largest_root,
        "files_created": files_created,
        "summary": summary
    }


# CLI test
if __name__ == "__main__":
    res = solve_s2_2({"n": 4})
    from pprint import pprint
    pprint(res)