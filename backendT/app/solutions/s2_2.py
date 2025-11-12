# app/solutions/s3_1_stream.py
import numpy as np
import csv
import sys
import time
from numpy.polynomial import polynomial as P_mod
from numpy.polynomial import legendre as L

# ============================================================
# Helper functions
# ============================================================

def flush_line(line: str):
    """Force immediate flush of a line for real-time streaming."""
    sys.stdout.flush()
    return f"{line.rstrip()}\n"

def build_legendre_tridiagonal(n):
    yield flush_line(f"Building {n}x{n} symmetric tridiagonal matrix for root finding...")
    n_range = np.arange(1.0, n)
    beta = n_range / np.sqrt(4 * n_range**2 - 1)
    J = np.zeros((n, n))
    np.fill_diagonal(J[1:, :], beta)
    np.fill_diagonal(J[:, 1:], beta)
    yield flush_line("Tridiagonal matrix constructed successfully.")
    return J

def lu_decomposition_fast(A):
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
        L[k+1:, k] = A[k+1:, k] / A[k, k]
        A[k+1:, k:] -= np.outer(L[k+1:, k], A[k, k:])
    U = np.triu(A)
    return P, L, U

def forward_substitution_fast(L, b):
    n = L.shape[0]
    y = np.zeros(n, dtype=float)
    for i in range(n):
        y[i] = b[i] - np.dot(L[i, :i], y[:i])
    return y

def backward_substitution_fast(U, y):
    n = U.shape[0]
    x = np.zeros(n, dtype=float)
    for i in range(n - 1, -1, -1):
        x[i] = (y[i] - np.dot(U[i, i+1:], x[i+1:])) / U[i, i]
    return x

def solve_lu_fast(A, b):
    P, L, U = lu_decomposition_fast(A)
    Pb = P @ b
    y = forward_substitution_fast(L, Pb)
    x = backward_substitution_fast(U, y)
    return x

def newton_raphson(f, f_prime, x0, tol=1e-12, max_iter=100):
    x = x0
    for i in range(max_iter):
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


# ============================================================
# Main Streaming Function
# ============================================================

def stream_s2_2(params):
    """
    Stream the computation of Legendre polynomial roots,
    LU decomposition, and Newton-Raphson results.
    """
    try:
        n_target = int(params.get("n", 5))
        yield flush_line(f"Computing {n_target}-order Shifted Legendre Polynomial...")

        # Filenames
        COEFFS_FILE = f"legendre_coefficients_{n_target}.csv"
        COMPANION_FILE = f"companion_matrix_{n_target}.csv"
        ROOTS_FILE = f"legendre_roots_{n_target}.csv"
        X_SOLUTION_FILE = f"x_solution_lu_{n_target}.csv"

        # Step 1: Compute coefficients
        p_leg_basis = L.Legendre.basis(n_target, domain=[0, 1])
        p_power_basis = p_leg_basis.convert(kind=P_mod.Polynomial, domain=[-1, 1])
        coeffs_low_to_high = p_power_basis.coef
        coeffs_high_to_low = coeffs_low_to_high[::-1]
        p_final = np.poly1d(coeffs_high_to_low)
        yield flush_line(f"Coefficients computed successfully for degree {n_target}.")

        # Save coefficients
        with open(COEFFS_FILE, "w", newline="") as f:
            writer = csv.writer(f)
            writer.writerow(["power", "coefficient"])
            for i, c in enumerate(coeffs_low_to_high):
                writer.writerow([f"t^{i}", c])
        yield flush_line(f"Coefficients saved to {COEFFS_FILE}")

        if n_target == 0:
            yield flush_line("n=0, skipping matrix, roots, and LU solver.")
            yield flush_line("---END---")
            return

        # Step 2: Companion matrix
        yield flush_line(f"Building {n_target}x{n_target} companion matrix...")
        companion_mat = P_mod.polycompanion(coeffs_low_to_high)
        np.savetxt(COMPANION_FILE, companion_mat, delimiter=",")
        yield flush_line(f"Companion matrix saved to {COMPANION_FILE}")

        # Step 3: Compute roots via stable eigenvalue method
        yield flush_line("Calculating roots via eigenvalue decomposition...")
        J_n = np.zeros((n_target, n_target))
        n_range = np.arange(1.0, n_target)
        beta = n_range / np.sqrt(4 * n_range**2 - 1)
        np.fill_diagonal(J_n[1:, :], beta)
        np.fill_diagonal(J_n[:, 1:], beta)

        start_time = time.time()
        roots_x = np.linalg.eigh(J_n)[0]
        shifted_roots = (roots_x + 1.0) / 2.0
        shifted_roots.sort()
        end_time = time.time()

        #yield flush_line(f"Root computation done in {end_time - start_time:.6f}s")

        with open(ROOTS_FILE, "w", newline="") as f:
            writer = csv.writer(f)
            writer.writerow(["root"])
            for r in shifted_roots:
                writer.writerow([r])
        yield flush_line(f"Roots saved to {ROOTS_FILE}")

        # Step 4: LU Solver
        yield flush_line("\n--- Solving Ax=b using LU decomposition ---")
        A = companion_mat
        n = A.shape[0]
        b = np.arange(1, n + 1, dtype=float)

        x_solution = solve_lu_fast(A, b)
        residual = np.linalg.norm(A @ x_solution - b)
        np.savetxt(X_SOLUTION_FILE, x_solution, delimiter=",")
        yield flush_line(f"Solution saved to {X_SOLUTION_FILE}")
        #yield flush_line(f"Residual ||Ax - b|| = {residual:.3e}")

        # Step 5: Newton–Raphson roots
        yield flush_line("\nStarting Newton-Raphson method for smallest and largest roots...")
        pn_legendre_coeffs = [0.0] * n_target + [1.0]
        pn_legendre_deriv_coeffs = L.legder(pn_legendre_coeffs)

        def f(x): return L.legval(2*x - 1, pn_legendre_coeffs)
        def f_prime(x): return L.legval(2*x - 1, pn_legendre_deriv_coeffs) * 2

        smallest_root = newton_raphson(f, f_prime, 0.0)
        largest_root = newton_raphson(f, f_prime, 1.0)

        yield flush_line("\n--- Newton-Raphson Results ---")
        if smallest_root is not None:
            yield flush_line(f"Smallest Root: {smallest_root:.12f}")
        else:
            yield flush_line("Could not find smallest root.")

        if largest_root is not None:
            yield flush_line(f"Largest Root: {largest_root:.12f}")
        else:
            yield flush_line("Could not find largest root.")

        yield flush_line("Computation complete.")
        yield flush_line("---END---")

    except Exception as e:
        yield flush_line(f"Error occurred: {str(e)}")
        yield flush_line("---END---")
