import numpy as np
import math
import matplotlib.pyplot as plt
from matplotlib.widgets import Slider
from numpy.polynomial.legendre import leggauss
from scipy.interpolate import interp1d
from scipy.special import erf

def safe_log(z):
    return np.log(np.maximum(z, 1e-12))

def find_A(n, x):
    # Q
    Q = np.zeros((n + 2,n + 2))
        
    for i in range(n + 2):
        for j in range(n + 2):
            Q[i][j] = x[i] ** j

    # C
    C = np.zeros((n + 2,n + 2))
        
    for i in range(n + 2):
        for j in range(n + 2):
            if j < 1:
                C[i][j] = 0
            else:
                C[i][j] = j * (x[i] ** (j - 1))
        
    Q_inv = np.linalg.inv(Q)
    A = np.matmul(C, Q_inv)
    return A

def find_B(n, x):
    # Q
    Q = np.zeros((n + 2, n + 2))
        
    for i in range(n + 2):
        for j in range(n + 2):
            Q[i][j] = x[i] ** j
        
    # C
    C = np.zeros((n + 2,n + 2))
        
    for i in range(n + 2):
        for j in range(n + 2):
            if j < 2:
                C[i][j] = 0
            else:
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

def gl_roots_with_endpoints(n):
    xi,_ = leggauss(n)
    return np.concatenate(([0.0], 0.5*(xi+1.0), [1.0]))

# coeff_2nd_diff = lambda x : 1
# coeff_1st_diff = lambda x : 1
coeff_2nd_diff = lambda x : x
coeff_1st_diff = lambda x : (1 + 2 * math.log(max(x, 1e-12)))

def get_y(y, n, x, A, B):
    y[0] = 1
    y[n+1] = 0
    coeffs = np.zeros((n + 2, n + 2))
    for i in range(1, n + 1):
        for j in range(n + 2):
            coeffs[i][j] = coeff_2nd_diff(x[i]) * B[i][j] + coeff_1st_diff(x[i]) * A[i][j]
    # C * z = D
    C = np.zeros((n, n))
    D = np.zeros(n)
    for i in range(n):
        for j in range(n):
            C[i][j] = coeffs[i+1][j+1]
    for i in range(n):
        D[i] = - (y[0] * coeffs[i + 1][0] + y[n + 1] * coeffs[i + 1][n + 1])
    y_inner = np.linalg.solve(C, D)
    for i in range(n):
        y[i + 1] = y_inner[i]
        
n = int(input("Enter n value : "))

y = np.zeros(n + 2)
x = gl_roots_with_endpoints(n)

A = np.zeros(n + 2)
B = np.zeros(n + 2)
if n < 20:
    A = find_A(n, x)
    B = find_B(n, x)
else:
    D  = diff_matrix(x)
    D2 = D @ D
    A = D
    B = D2
        
get_y(y, n, x, A, B)

z_nodes = x[1:]
f_nodes = y[1:] 

eta_nodes = -np.log(np.maximum(z_nodes, 1e-12))

f_eta_interp = interp1d(eta_nodes, f_nodes, kind='cubic', fill_value='extrapolate')

def f_original(x, t):
    eta = x / (2 * np.sqrt(t))
    return f_eta_interp(eta)

x_vals = np.linspace(0, 3, 300)

t0 = 1e-1
f_vec = np.vectorize(f_original)

fig, ax = plt.subplots()
plt.subplots_adjust(bottom=0.25)

(line1,) = ax.plot(x_vals, f_vec(x_vals, t0), 'k-', lw=2, label='Collocation f(η(x,t))')
(line2,) = ax.plot(x_vals, erf(x_vals / (2*np.sqrt(t0))), 'r--', label='Analytical erf')
ax.set_xlabel('x')
ax.set_ylabel('f(x, t)')
ax.set_title('Evolution of f(x, t) with time')
ax.grid(True)
ax.legend()
ax.set_ylim(-0.1, 1.1)

ax_t = plt.axes([0.2, 0.1, 0.6, 0.03])
slider_t = Slider(ax_t, 't', 1e-2, 1, valinit=t0, valstep=0.001)

def update(val):
    t = slider_t.val
    line1.set_ydata(f_vec(x_vals, t))
    line2.set_ydata(f_vec(x_vals, t))
    fig.canvas.draw_idle()

slider_t.on_changed(update)
plt.show()