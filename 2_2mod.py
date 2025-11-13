import numpy as np
import pandas as pd

# === INPUT LINE =====================================================================
INPUT_FILE = "companion_matrix.csv"  # <-- put your CSV matrix file here
# ====================================================================================


# ---------- LU Decomposition Core ----------

def lu_decomposition(A):
    """Performs LU decomposition with partial pivoting."""
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
    """Compute determinant using LU decomposition."""
    sign = np.linalg.det(P)
    detU = np.prod(np.diag(U))
    return sign * detU


# ---------- Eigenvalue Approximation ----------

def eigenvalues_via_LU(C, search_min=-2, search_max=2, steps=1500):
    """
    Finds approximate eigenvalues by detecting sign changes in det(C - λI).
    No range optimization, no sanity checks.
    """
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


# ---------- Newton–Raphson Refinement ----------

def newton_refine(poly_coeffs, x0, tol=1e-10, max_iter=50):
    """Refines approximate root using Newton–Raphson method."""
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


# ---------- Main ----------

def main():
    C = pd.read_csv(INPUT_FILE, header=None).values
    n = C.shape[0]
    print(f"Loaded companion matrix of order {n} from '{INPUT_FILE}'")

    # Characteristic polynomial coefficients
    coeffs = np.poly(C)
    print(f"Characteristic polynomial coefficients:\n{coeffs}")

    # Fixed search range
    search_min, search_max = -2, 2


    # Step 1: Approximation
    approx_eigs = eigenvalues_via_LU(C, search_min, search_max, steps=2000)
    print(f"Approximate eigenvalues found ({len(approx_eigs)}):\n{approx_eigs}")

    # Step 2: Refinement
    refined = [newton_refine(coeffs, ev) for ev in approx_eigs]
    refined = np.sort(np.array(refined))

    # Step 3: Output
    pd.DataFrame(refined).to_csv("output_roots.csv", index=False, header=False)
    print("Refined eigenvalues saved to 'output_roots.csv'")
    print(refined)


if __name__ == "_main_":
    main()