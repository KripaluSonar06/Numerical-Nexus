# app/solutions/s3_3_stream.py
import numpy as np
import math
import matplotlib.pyplot as plt
from numpy.polynomial.legendre import leggauss
from scipy.special import erf
import os
import time

# ------------------------------------------------------
# Core numerical helpers
# ------------------------------------------------------

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


def coeff_2nd_diff(x): return x
def coeff_1st_diff(x): return (1 + 2 * math.log(max(x, 1e-12)))


# ------------------------------------------------------
# Main streamed computation
# ------------------------------------------------------

def stream_s3_2(params):
    """
    Stream solution of the PDE using collocation and compare
    numerical vs analytical temperature profiles.
    Saves results to /output/ folder.
    """
    try:
        n = int(params.get("n", 6))
        To = float(params.get("To", 273))
        Ts = float(params.get("Ts", 373))
        alpha = float(params.get("alpha", 1e-5))
        L = float(params.get("L", 5))
        output_dir = os.path.join(os.getcwd(), "output")
        os.makedirs(output_dir, exist_ok=True)

        yield f"Starting collocation-based PDE solver for n = {n}\n"

        # ------------------------------------------------------
        # Build collocation matrices
        # ------------------------------------------------------
        x = gl_roots_with_endpoints(n)
        y = np.zeros(n + 2)

        if n < 20:
            yield "🔹 Using polynomial differentiation method (small n)\n"
            A = find_A(n, x)
            B = find_B(n, x)
        else:
            yield "🔹 Using barycentric differentiation method (large n)\n"
            D = diff_matrix(x)
            A = D
            B = D @ D

        yield "Solving collocation system...\n"
        time.sleep(0.3)

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
            D[i] = - (y[0] * coeffs[i + 1][0] + y[n + 1] * coeffs[i + 1][n + 1])

        y_inner = np.linalg.solve(C, D)
        for i in range(n):
            y[i + 1] = y_inner[i]

        # ------------------------------------------------------
        # Polynomial coefficients
        # ------------------------------------------------------
        yield "Computing polynomial coefficients...\n"
        Q = np.zeros((n + 2, n + 2))
        for i in range(n + 2):
            for j in range(n + 2):
                Q[i][j] = x[i] ** j
        d = np.linalg.solve(Q, y)

        def f_eta(eta):
            z = math.exp(-eta)
            return sum((z ** i) * d[i] for i in range(n + 2))

        def T_X_tau(X, tau):
            eta = X / (2 * np.sqrt(alpha * tau))
            return To + (Ts - To) * f_eta(eta)

        def T_analytical(X, tau):
            return To + (Ts - To) * erf(X / (2 * np.sqrt(alpha * tau)))

        T_X_tau_vec = np.vectorize(T_X_tau)
        T_analytical_vec = np.vectorize(T_analytical)

        # ------------------------------------------------------
        # Generate and save temperature comparison plot
        # ------------------------------------------------------
        yield "Generating temperature profile comparison plot...\n"
        X_vals = np.linspace(0, L, int(100 * L))
        tau0 = 0.5

        plt.figure(figsize=(8, 6))
        plt.plot(X_vals, T_X_tau_vec(X_vals, tau0), "b-", lw=2, label="Collocation (Numerical)")
        plt.plot(X_vals, T_analytical_vec(X_vals, tau0), "r--", lw=2, label="Analytical (erf)")
        plt.xlabel("Position X (m)")
        plt.ylabel("Temperature T (K)")
        plt.title(f"Temperature Profiles (τ = {tau0:.2f} s, n={n})")
        plt.grid(True, linestyle="--", alpha=0.6)
        plt.legend()
        plot_file = os.path.join(output_dir, f"temperature_profiles_n{n}.png")
        plt.savefig(plot_file, bbox_inches="tight")
        plt.close()
        yield f"Saved temperature comparison plot to {plot_file}\n"

        # ------------------------------------------------------
        # Error matrix computation
        # ------------------------------------------------------
        yield "Computing temperature error matrix over x and τ range...\n"
        smallest_num = math.ulp(0.0)
        num_X = 101
        num_tau = 101
        X_vals_err = np.linspace(smallest_num, L + smallest_num, num_X)
        tau_vals_err = np.linspace(smallest_num, 10000 + smallest_num, num_tau)
        error_matrix = np.zeros((num_X, num_tau))

        for i, Xv in enumerate(X_vals_err):
            for j, tau in enumerate(tau_vals_err):
                T_ana = T_analytical(Xv, tau)
                T_col = T_X_tau(Xv, tau)
                error_matrix[i, j] = T_ana - T_col
            if i % 20 == 0:
                yield f"  • Progress: {i}/{num_X} spatial points done\n"

        header_row = "X/τ," + ",".join([f"{tau:.6e}" for tau in tau_vals_err])
        data_with_X = np.column_stack((X_vals_err, error_matrix))
        csv_filename = os.path.join(output_dir, f"temperature_error_matrix_n{n}.csv")
        np.savetxt(csv_filename, data_with_X, delimiter=",", header=header_row, comments="", fmt="%.6e")

        yield f"Saved temperature error matrix to {csv_filename}\n"
        yield f"Computation complete (n={n}, L={L}, α={alpha})\n"
        yield "END"

    except Exception as e:
        yield f"Error occurred: {str(e)}\n"
        yield "END"
