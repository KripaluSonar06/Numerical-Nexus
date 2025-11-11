# app/solutions/s3_2.py

import numpy as np
import math
import matplotlib.pyplot as plt
from numpy.polynomial.legendre import leggauss
from scipy.interpolate import interp1d
from scipy.special import erf
import os
from typing import Dict, Any

# ===============================================================
# Ensure output directory
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
    return np.matmul(C, np.linalg.inv(Q))


def find_B(n, x):
    Q = np.zeros((n + 2, n + 2))
    for i in range(n + 2):
        for j in range(n + 2):
            Q[i][j] = x[i] ** j
    C = np.zeros((n + 2, n + 2))
    for i in range(n + 2):
        for j in range(2, n + 2):
            C[i][j] = j * (j - 1) * (x[i] ** (j - 2))
    return np.matmul(C, np.linalg.inv(Q))


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


# ===============================================================
# PDE / collocation logic
# ===============================================================

def coeff_2nd_diff(x):
    return x


def coeff_1st_diff(x):
    return 1 + 2 * math.log(max(x, 1e-12))


def get_y(y, n, x, A, B):
    y[0] = 1
    y[n + 1] = 0
    coeffs = np.zeros((n + 2, n + 2))
    for i in range(1, n + 1):
        for j in range(n + 2):
            coeffs[i][j] = coeff_2nd_diff(x[i]) * B[i][j] + coeff_1st_diff(x[i]) * A[i][j]

    C = np.zeros((n, n))
    D = np.zeros(n)
    for i in range(n):
        for j in range(n):
            C[i][j] = coeffs[i + 1][j + 1]
    for i in range(n):
        D[i] = - (y[0] * coeffs[i + 1][0] + y[n + 1] * coeffs[i + 1][n + 1])

    y_inner = np.linalg.solve(C, D)
    for i in range(n):
        y[i + 1] = y_inner[i]


# ===============================================================
# Main function for backend
# ===============================================================

def solve_s3_2(params: Dict[str, Any]) -> Dict[str, Any]:
    """
    Solve temperature distribution via Gauss–Legendre collocation.

    Args:
        params: {
            "n": int - number of nodes
            "To": float - initial temperature (default 273)
            "Ts": float - surface temperature (default 373)
            "alpha": float - thermal diffusivity (default 1e-5)
            "L": float - domain length (default 1)
            "tau": float - time (default 0.5)
        }
    """
    n = int(params.get("n", 6))
    To = float(params.get("To", 273))
    Ts = float(params.get("Ts", 373))
    alpha = float(params.get("alpha", 1e-5))
    L = float(params.get("L", 1))
    tau = float(params.get("tau", 0.5))

    # ------------------------------------------------------------
    # STEP 1: Collocation solution
    # ------------------------------------------------------------
    y = np.zeros(n + 2)
    x = gl_roots_with_endpoints(n)

    if n < 20:
        A = find_A(n, x)
        B = find_B(n, x)
    else:
        D = diff_matrix(x)
        A, B = D, D @ D

    get_y(y, n, x, A, B)

    # Transform z → η
    z_nodes = x
    f_nodes = y
    eta_nodes = -np.log(np.maximum(z_nodes, 1e-100))
    f_eta = interp1d(
        eta_nodes, f_nodes, kind="linear", bounds_error=False, fill_value=(f_nodes[0], f_nodes[-1])
    )

    # ------------------------------------------------------------
    # STEP 2: Temperature profiles
    # ------------------------------------------------------------
    def T_X_tau(X, tau):
        eta = X / (2 * np.sqrt(alpha * tau))
        return To + (Ts - To) * f_eta(eta)

    def T_analytical(X, tau):
        return To + (Ts - To) * erf(X / (2 * np.sqrt(alpha * tau)))

    X_vals = np.linspace(0, L, int(100 * L))
    T_num = T_X_tau(X_vals, tau)
    T_exact = T_analytical(X_vals, tau)

    # ------------------------------------------------------------
    # STEP 3: Plot both curves
    # ------------------------------------------------------------
    fig, ax = plt.subplots(figsize=(8, 6))
    ax.plot(X_vals, T_num, "b-", lw=2, label="Collocation")
    ax.plot(X_vals, T_exact, "r--", lw=2, label="Analytical (erf)")
    ax.set_xlabel("Position X (m)")
    ax.set_ylabel("Temperature T (K)")
    ax.set_title(f"T(x) profiles at τ={tau:.2f}s (n={n})")
    ax.grid(True, linestyle="--", alpha=0.6)
    ax.legend()

    plot_file = os.path.join(OUTPUT_DIR, f"T_profile_n_{n}_tau_{int(tau)}.png")
    plt.savefig(plot_file, dpi=150, bbox_inches="tight")
    plt.close()

    # ------------------------------------------------------------
    # STEP 4: Optionally save numeric data
    # ------------------------------------------------------------
    data_file = os.path.join(OUTPUT_DIR, f"T_data_n_{n}_tau_{int(tau)}.csv")
    np.savetxt(
        data_file,
        np.column_stack([X_vals, T_num, T_exact]),
        delimiter=",",
        header="X, T_numerical, T_analytical",
        comments="",
        fmt="%.6f",
    )

    # ------------------------------------------------------------
    # STEP 5: Return summary for backend/frontend
    # ------------------------------------------------------------
    summary = (
        f"Computed temperature profiles for n={n}, τ={tau}. "
        f"Saved plot and data in output folder."
    )

    return {
        "n": n,
        "tau": tau,
        "To": To,
        "Ts": Ts,
        "alpha": alpha,
        "L": L,
        "files_created": [
            os.path.basename(plot_file),
            os.path.basename(data_file),
        ],
        "summary": summary,
    }


# CLI test
if __name__ == "__main__":
    res = solve_s3_2({"n": 6, "tau": 1})
    from pprint import pprint
    pprint(res)
