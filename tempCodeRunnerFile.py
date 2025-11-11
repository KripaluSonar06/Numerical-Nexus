import numpy as np
import math
import matplotlib.pyplot as plt
from matplotlib.widgets import Slider
from numpy.polynomial.legendre import leggauss
from scipy.interpolate import interp1d
from scipy.interpolate import BarycentricInterpolator
from scipy.interpolate import lagrange
from scipy.special import erf

# ------------------------------------------------------
# Utility function for safe user input with default value
def get_input(prompt, default):
    s = input(f"{prompt} (default={default}): ")
    return float(s) if s.strip() else default

# ------------------------------------------------------
# Helper functions for collocation differentiation
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

# ------------------------------------------------------
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

# ------------------------------------------------------
# Setup collocation
n = int(input("Enter n value : "))
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

# ------------------------------------------------------
# Transform z → η
z_nodes = x
f_nodes = y
eta_nodes = -np.log(np.maximum(z_nodes, 1e-6))
eta_nodes = np.clip(eta_nodes, 0, 6)
# f_eta = interp1d(eta_nodes, f_nodes, kind='nearest', bounds_error=False, fill_value=(f_nodes[0], f_nodes[-1]))
f_eta_poly = lagrange(eta_nodes, f_nodes)
def f_eta(eta):
    return f_eta_poly(eta)
# f_eta = BarycentricInterpolator(eta_nodes, f_nodes)

# ------------------------------------------------------
# Physical parameters (with defaults)
To = get_input("Enter T₀", 273)
Ts = get_input("Enter Tₛ", 373)
alpha = get_input("Enter alpha", 1e-5)
L = get_input("Enter L", 1)

# ------------------------------------------------------
# Temperature functions
def T_X_tau(X, tau):
    eta = X / (2 * np.sqrt(alpha * tau))
    eta = np.clip(eta, eta_nodes.min(), eta_nodes.max())
    return To + (Ts - To) * f_eta(eta)

def T_analytical(X, tau):
    return To + (Ts - To) * erf(X / (2 * np.sqrt(alpha * tau)))

T_X_tau_vec = np.vectorize(T_X_tau)
T_analytical_vec = np.vectorize(T_analytical)

# ------------------------------------------------------
# Plot setup
X_vals = np.linspace(0, L, int(100 * L))
tau0 = 0.5  # Start at 0.1s (minimum)

fig, ax = plt.subplots(figsize=(8, 6))
plt.subplots_adjust(bottom=0.25)

(line1,) = ax.plot(X_vals, T_X_tau_vec(X_vals, tau0), 'b-', lw=2, label='Gauss-Legendre (collocation)')
(line2,) = ax.plot(X_vals, T_analytical_vec(X_vals, tau0), 'r--', lw=2, label='Analytical (erf)')

ax.set_xlabel('Position X (m)')
ax.set_ylabel('Temperature T (K)')
ax.set_title(f'Temperature profiles at τ = {tau0:.2f} s')
ax.grid(True, linestyle='--', alpha=0.6)
ax.legend()
ax.set_ylim(To - 0.05 * (Ts - To), Ts + 0.05 * (Ts - To))

# ------------------------------------------------------
# Slider setup
ax_tau = plt.axes([0.2, 0.1, 0.6, 0.03])
slider_tau = Slider(ax_tau, 'τ (s)', 0.5, 10000, valinit=tau0, valstep=0.5)

def update(val):
    tau = slider_tau.val
    line1.set_ydata(T_X_tau_vec(X_vals, tau))
    line2.set_ydata(T_analytical_vec(X_vals, tau))
    ax.set_title(f'Temperature profiles at τ (n = {n}) = {tau:.2f} s')
    fig.canvas.draw_idle()

slider_tau.on_changed(update)
plt.show()