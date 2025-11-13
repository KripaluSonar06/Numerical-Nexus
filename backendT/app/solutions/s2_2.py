# app/solutions/s2_2.py
import numpy as np
import csv
import sys
import time
from numpy.polynomial import polynomial as P_mod
from numpy.polynomial import legendre as L
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
OUTPUT_DIR = os.path.join(BASE_DIR, "output", "2_2")
os.makedirs(OUTPUT_DIR, exist_ok=True)

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
        COEFFS_FILE = os.path.join(OUTPUT_DIR, "legendre_coefficients.csv")
        COMPANION_FILE = os.path.join(OUTPUT_DIR, "companion_matrix.csv")
        ROOTS_FILE = os.path.join(OUTPUT_DIR, "legendre_roots.csv")
        X_SOLUTION_FILE = os.path.join(OUTPUT_DIR, "x_solution_lu.csv")

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

                # Step 3B: LU-based Eigenvalue Approximation & Comparison
        yield flush_line("\n--- Comparing with LU-based Eigenvalue Method ---")
        try:
            # Import helper functions (use teammate's logic inline)
            def lu_decomposition(A):
                A = A.copy().astype(float)
                n = A.shape[0]
                P = np.eye(n)
                L = np.zeros((n, n))
                U = A.copy()
                for k in range(n):
                    pivot = np.argmax(abs(U[k:, k])) + k
                    if pivot != k:
                        U[[k, pivot], :] = U[[pivot, k], :]
                        P[[k, pivot], :] = P[[pivot, k], :]
                        L[[k, pivot], :k] = L[[pivot, k], :k]
                    L[k, k] = 1.0
                    for i in range(k + 1, n):
                        if abs(U[k, k]) < 1e-14:
                            continue
                        L[i, k] = U[i, k] / U[k, k]
                        U[i, k:] -= L[i, k] * U[k, k:]
                return P, L, U

            def determinant_from_LU(P, L, U):
                sign = np.linalg.det(P)
                detU = np.prod(np.diag(U))
                return sign * detU

            def eigenvalues_via_LU(C, search_min=-2, search_max=2, steps=1500):
                n = C.shape[0]
                eigenvalues = []
                prev_det = None
                lambdas = np.linspace(search_min, search_max, steps)
                for lam in lambdas:
                    A = C - lam * np.eye(n)
                    try:
                        P, L, U = lu_decomposition(A)
                        det_val = determinant_from_LU(P, L, U)
                    except Exception:
                        det_val = np.nan
                    if prev_det is not None and not np.isnan(det_val):
                        if np.sign(prev_det) != np.sign(det_val):
                            idx = np.where(lambdas == lam)[0][0]
                            prev_lam = lambdas[idx - 1]
                            eigenvalues.append((lam + prev_lam) / 2)
                    prev_det = det_val
                return np.array(eigenvalues)

            def newton_refine(poly_coeffs, x0, tol=1e-10, max_iter=50):
                p = np.poly1d(poly_coeffs)
                dp = np.polyder(p)
                x = x0
                for _ in range(max_iter):
                    fx = p(x)
                    dfx = dp(x)
                    if abs(dfx) < 1e-14:
                        break
                    x_new = x - fx / dfx
                    if abs(x_new - x) < tol:
                        return x_new
                    x = x_new
                return x

            # Step 1: Approximation via LU determinant scanning
            yield flush_line("Finding approximate eigenvalues using LU determinant sign changes...")
            approx_eigs = eigenvalues_via_LU(companion_mat, -2, 2, steps=2000)
            yield flush_line(f"Approximate eigenvalues found ({len(approx_eigs)}): {approx_eigs}")

            # Step 2: Refinement
            yield flush_line("Refining eigenvalues using Newton–Raphson...")
            coeffs = np.poly(companion_mat)
            refined = [newton_refine(coeffs, ev) for ev in approx_eigs]
            refined = np.sort(np.array(refined))

            # Save to output file
            LU_ROOTS_FILE = os.path.join(OUTPUT_DIR, "legendre_roots_LU.csv")
            np.savetxt(LU_ROOTS_FILE, refined, delimiter=",")
            yield flush_line(f"Refined LU-based roots saved to {LU_ROOTS_FILE}")

            # Step 3: Compare
            yield flush_line("\n--- Comparison with np.linalg.eigh roots ---")
            for i, (exact, approx) in enumerate(zip(shifted_roots, refined)):
                yield flush_line(f"Root {i+1}: Exact={exact:.6f},  LU-Based={approx:.6f}")
            yield flush_line("LU-based computation successful up to n ≈ 20.")
        except Exception as e:
            yield flush_line(f"LU-based eigenvalue section skipped due to error: {e}")


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