# app/solutions/s3_2.py
import numpy as np
import math
import matplotlib.pyplot as plt
from numpy.polynomial.legendre import leggauss
from scipy.special import erf
import os


# ===========================================================
# Utility and math helpers
# ===========================================================

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


# ===========================================================
# Core collocation solver
# ===========================================================

coeff_2nd_diff = lambda x: x
coeff_1st_diff = lambda x: (1 + 2 * math.log(max(x, 1e-12)))


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


def find_d(y, x, n):
    Q = np.zeros((n + 2, n + 2))
    for i in range(n + 2):
        for j in range(n + 2):
            Q[i][j] = x[i] ** j
    Y = y
    return np.linalg.solve(Q, Y)


def f_eta(eta, d, n):
    z = np.exp(-eta)
    return np.sum([(z ** i) * d[i] for i in range(n + 2)])


# ===========================================================
# Main solver (backend entry point)
# ===========================================================

def solve_s3_2(params: dict):
    """
    Compute temperature distribution using collocation method
    and compare with analytical solution.
    Saves both temperature plot and error matrix CSV.
    """

    # -------------------------------------------------------
    # Parameters
    n = int(params.get("n", 6))
    To = float(params.get("To", 273))
    Ts = float(params.get("Ts", 373))
    alpha = float(params.get("alpha", 1e-5))
    L = float(params.get("L", 5))
    tau = float(params.get("tau", 0.5))

    OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "..", "output")
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    # -------------------------------------------------------
    # Setup collocation
    y = np.zeros(n + 2)
    x = gl_roots_with_endpoints(n)

    if n < 20:
        A = find_A(n, x)
        B = find_B(n, x)
    else:
        D = diff_matrix(x)
        A = D
        B = D @ D

    get_y(y, n, x, A, B)
    d = find_d(y, x, n)

    # -------------------------------------------------------
    # Define temperature functions
    def T_X_tau(X, tao):
        eta = X / (2 * np.sqrt(alpha * tao))
        return To + (Ts - To) * f_eta(eta, d, n)

    def T_analytical(X, tao):
        return To + (Ts - To) * erf(X / (2 * np.sqrt(alpha * tao)))

    T_X_tau_vec = np.vectorize(T_X_tau)
    T_analytical_vec = np.vectorize(T_analytical)

    # -------------------------------------------------------
    # Generate temperature plot
    X_vals = np.linspace(0, L, int(100 * L))
    fig, ax = plt.subplots(figsize=(8, 6))
    ax.plot(X_vals, T_X_tau_vec(X_vals, tau), 'b-', lw=2, label='Gauss-Legendre (collocation)')
    ax.plot(X_vals, T_analytical_vec(X_vals, tau), 'r--', lw=2, label='Analytical (erf)')
    ax.set_xlabel('Position X (m)')
    ax.set_ylabel('Temperature T (K)')
    ax.set_title(f'Temperature profiles (n={n}, τ={tau:.2f}s)')
    ax.grid(True, linestyle='--', alpha=0.6)
    ax.legend()

    plot_filename = f"T_profile_n_{n}_tau_{tau:.2f}.png"
    plot_path = os.path.join(OUTPUT_DIR, plot_filename)
    plt.savefig(plot_path)
    plt.close(fig)

    # -------------------------------------------------------
    # Error matrix calculation
    smallest_num = math.ulp(0.0)
    num_X = 101
    num_tau = 101
    X_vals_err = np.linspace(smallest_num, L + smallest_num, num_X)
    tau_vals_err = np.linspace(smallest_num, 10000 + smallest_num, num_tau)

    error_matrix = np.zeros((num_X, num_tau))
    for i, X in enumerate(X_vals_err):
        for j, tao in enumerate(tau_vals_err):
            error_matrix[i, j] = T_analytical(X, tao) - T_X_tau(X, tao)

    header_row = "X/Tau," + ",".join([f"{tao:.6e}" for tao in tau_vals_err])
    data_with_X = np.column_stack((X_vals_err, error_matrix))

    csv_filename = f"T_error_matrix_n_{n}_tau_{tau:.2f}.csv"
    csv_path = os.path.join(OUTPUT_DIR, csv_filename)
    np.savetxt(csv_path, data_with_X, delimiter=",", header=header_row, comments='', fmt="%.6e")

    # -------------------------------------------------------
    # Prepare result for backend
    result = {
        "n": n,
        "tau": tau,
        "To": To,
        "Ts": Ts,
        "alpha": alpha,
        "L": L,
        "files_created": [plot_filename, csv_filename],
        "summary": (
            f"Temperature profile computed for n={n}, τ={tau}. "
            f"Results saved as '{plot_filename}' and '{csv_filename}'."
        )
    }

    return result


# ===========================================================
# Local test
# ===========================================================
if __name__ == "__main__":
    params = {"n": 6, "To": 273, "Ts": 373, "alpha": 1e-5, "L": 5, "tau": 0.5}
    print(solve_s3_2(params))
