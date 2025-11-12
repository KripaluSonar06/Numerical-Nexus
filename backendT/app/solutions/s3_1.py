# app/solutions/s3_2_stream.py
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from numpy.polynomial.legendre import leggauss
import sys
import os

BASE_DIR = os.path.dirname(os.path.dirname(__file__))  # root of project
OUTPUT_DIR = os.path.join(BASE_DIR, "output", "3_1")  # change "2_2" to your question ID
os.makedirs(OUTPUT_DIR, exist_ok=True)

# ============================================================
# Helper functions
# ============================================================

def flush_line(line: str):
    """Force immediate flush of a line."""
    sys.stdout.flush()
    return f"{line.rstrip()}\n"

def find_A(n, x):
    Q = np.zeros((n + 2, n + 2))
    for i in range(n + 2):
        for j in range(n + 2):
            Q[i][j] = x[i] ** j

    C = np.zeros((n + 2, n + 2))
    for i in range(n + 2):
        for j in range(1, n + 2):
            C[i][j] = j * (x[i] ** (j - 1))
    
    A = C @ np.linalg.inv(Q)
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
    
    B = C @ np.linalg.inv(Q)
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


# ============================================================
# Streaming solver
# ============================================================

def stream_s3_1(params):
    """
    Streams Gauss-Legendre roots, weights, and A/B matrix computation.
    Example input:
    {
        "n_roots": 6,
        "n_matrices": 6
    }
    """
    try:
        n_roots = int(params.get("n_roots", 6))
        n_matrices = int(params.get("n_matrices", 6))
        output_dir = os.path.join(os.getcwd(), "output")
        os.makedirs(output_dir, exist_ok=True)

        # ------------------------
        # STEP 1: Compute roots and weights
        # ------------------------
        yield f"Starting Gauss-Legendre computation for n={n_roots} roots...\n"
        x, w = roots_weights(n_roots)

        df_rw = pd.DataFrame({"Roots (x)": x, "Weights (w)": w})
        rw_file = os.path.join(output_dir, "roots-weights.csv")
        df_rw.to_csv(rw_file, index=False)
        yield f"Saved roots and weights to {rw_file}\n"

        for i in range(n_roots):
            yield f"x[{i}] = {x[i]:.8f}, w[{i}] = {w[i]:.8f}\n"

        # Generate and save the plot
        plt.figure(figsize=(7, 5))
        plt.plot(x, w, "o-", color="black", markersize=6, label="Gauss–Legendre weights")
        plt.xlabel("Roots (x)")
        plt.ylabel("Weights (w)")
        plt.title(f"Gauss-Legendre Weights vs Roots (n = {n_roots})")
        plt.grid(True, linestyle="--", alpha=0.6)
        plt.legend()
        plot_file = os.path.join(output_dir, f"roots_weights_plot.png")
        plt.savefig(plot_file, bbox_inches="tight")
        plt.close()
        yield f"Plot saved to {plot_file}\n"

        # ------------------------
        # STEP 2: Compute A and B matrices
        # ------------------------
        yield f"\nComputing A and B matrices for n={n_matrices}...\n"

        x_i, w_i = roots_weights(n_matrices)
        x_full = np.concatenate(([0.0], x_i, [1.0]))
        w_full = np.concatenate(([0.0], w_i, [0.0]))

        if n_matrices < 20:
            yield "🔹 Using polynomial differentiation method (small n)\n"
            A = find_A(n_matrices, x_full)
            B = find_B(n_matrices, x_full)
        else:
            yield "🔹 Using barycentric differentiation method (large n)\n"
            D = diff_matrix(x_full)
            D2 = D @ D
            A = D
            B = D2

        # Save A matrix
        A_file = os.path.join(output_dir, "A_matrix.csv")
        np.savetxt(A_file, A, delimiter=",", fmt="%.6f")
        yield f"Saved A matrix to {A_file}\n"

        # Save B matrix
        B_file = os.path.join(output_dir, "B_matrix.csv")
        np.savetxt(B_file, B, delimiter=",", fmt="%.6f")
        yield f"Saved B matrix to {B_file}\n"

        yield "\nAll computations completed successfully.\n"
        yield "---END---"

    except Exception as e:
        yield f"Error: {str(e)}\n"
        yield "---END---"