# app/solutions/s3_1.py

import numpy as np
from numpy.polynomial.legendre import leggauss
import matplotlib.pyplot as plt
import pandas as pd
import os
from typing import Dict, Any

# ===============================================================
# Ensure output directory exists
# ===============================================================
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "..", "output")
os.makedirs(OUTPUT_DIR, exist_ok=True)

# ===============================================================
# Numerical helper functions
# ===============================================================

def find_A(n, x):
    Q = np.zeros((n + 2, n + 2))
    for i in range(n + 2):
        for j in range(n + 2):
            Q[i][j] = x[i] ** j

    C = np.zeros((n + 2, n + 2))
    for i in range(n + 2):
        for j in range(1, n + 2):
            C[i][j] = j * (x[i] ** (j - 1))

    Q_inv = np.linalg.inv(Q)
    A = np.matmul(C, Q_inv)
    return A


def find_B(n, x):
    Q = np.zeros((n + 2, n + 2))
    for i in range(n + 2):
        for j in range(n + 2):
            Q[i][j] = x[i] ** j

    C = np.zeros((n + 2, n + 2))
    for i in range(n + 2):
        for j in range(2, n + 2):
            C[i][j] = j * (j - 1) * (x[i] ** (j - 2))

    Q_inv = np.linalg.inv(Q)
    B = np.matmul(C, Q_inv)
    return B


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


def roots_weights(n):
    xi, wi = leggauss(n)
    x = 0.5 * (xi + 1)
    w = 0.5 * wi
    return x, w


# ===============================================================
# Main solver function
# ===============================================================

def solve_s3_1(params: Dict[str, Any]) -> Dict[str, Any]:
    """
    Computes Gauss–Legendre roots and weights, A and B matrices,
    saves them as CSVs and the weight plot as PNG.

    Args:
        params: {
            "n": int - number of points (roots)
        }

    Returns:
        dict containing results, saved file names, and preview data
    """
    n = int(params.get("n", 5))
    if n <= 0:
        raise ValueError("n must be a positive integer.")

    files_created = []

    # ------------------------------------------------------------
    # STEP 1: Compute Gauss–Legendre roots and weights
    # ------------------------------------------------------------
    x, w = roots_weights(n)
    df_rw = pd.DataFrame({"Roots": x, "Weights": w})
    roots_file = os.path.join(OUTPUT_DIR, f"roots_weights_n_{n}.csv")
    df_rw.to_csv(roots_file, index=False)
    files_created.append(os.path.basename(roots_file))

    # ------------------------------------------------------------
    # STEP 2: Generate and save plot
    # ------------------------------------------------------------
    plt.figure(figsize=(8, 5))
    plt.plot(x, w, "o-", color="black", markersize=6, label="Gauss–Legendre weights")
    plt.xlabel("Roots (x)")
    plt.ylabel("Weights (w)")
    plt.title(f"Gauss–Legendre Weights vs Roots (n = {n})")
    plt.grid(True, linestyle="--", alpha=0.6)
    plt.legend()

    plot_file = os.path.join(OUTPUT_DIR, f"weights_plot_n_{n}.png")
    plt.savefig(plot_file, dpi=150, bbox_inches="tight")
    plt.close()
    files_created.append(os.path.basename(plot_file))

    # ------------------------------------------------------------
    # STEP 3: Compute A and B matrices
    # ------------------------------------------------------------
    x_i, w_i = roots_weights(n)
    x_full = np.concatenate(([0.0], x_i, [1.0]))
    w_full = np.concatenate(([0.0], w_i, [0.0]))

    if n < 20:
        A = find_A(n, x_full)
        B = find_B(n, x_full)
    else:
        D = diff_matrix(x_full)
        D2 = D @ D
        A, B = D, D2

    A_file = os.path.join(OUTPUT_DIR, f"A_matrix_n_{n}.csv")
    B_file = os.path.join(OUTPUT_DIR, f"B_matrix_n_{n}.csv")
    np.savetxt(A_file, A, delimiter=",", fmt="%.6f")
    np.savetxt(B_file, B, delimiter=",", fmt="%.6f")
    files_created += [os.path.basename(A_file), os.path.basename(B_file)]

    # ------------------------------------------------------------
    # STEP 4: Return JSON summary
    # ------------------------------------------------------------
    summary = (
        f"Computed Gauss–Legendre data for n={n}. "
        f"Saved 3 CSVs and 1 plot image."
    )

    return {
        "n": n,
        "roots": x.tolist(),
        "weights": w.tolist(),
        "files_created": files_created,
        "summary": summary
    }


# CLI test
if __name__ == "__main__":
    res = solve_s3_1({"n": 5})
    from pprint import pprint
    pprint(res)