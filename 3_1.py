import numpy as np
from numpy.polynomial.legendre import leggauss
import matplotlib.pyplot as plt
import pandas as pd
import os

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

def roots_weights(n):
    xi, wi = leggauss(n)
    x = 0.5 * (xi + 1)
    w = 0.5 * wi
    return x, w
    
n = int(input("Enter n value for roots-weights graph: "))

x, w = roots_weights(n)
ans = pd.DataFrame([x, w])
ans_T = ans.T

# Display results
for i in range(n):
    print(f"x[{i:2d}] = {x[i]: .16f}, w[{i:2d}] = {w[i]: .16f}")
np.savetxt("roots-weights.csv", ans_T, delimiter=",", fmt="%.6f")
os.startfile("roots-weights.csv")

plt.figure(figsize=(8,5))
plt.plot(x, w, 'o-', color='black', markersize=6, label='Gauss-Legendre weights')
plt.xlabel('Roots (x)')
plt.ylabel('Weights (w)')
plt.title(f'Gauss-Legendre Weights vs Roots (n = {n})')
plt.grid(True, linestyle='--', alpha=0.6)
plt.legend()
plt.show()

n = int(input("Enter n value for A and B matrix: "))
x_i, w_i = roots_weights(n)

# include endpoints (weights at endpoints are zero for Gauss–Legendre)
x = np.concatenate(([0.0], x_i, [1.0]))
w = np.concatenate(([0.0], w_i, [0.0]))

if n < 20:
    A = find_A(n, x)
    B = find_B(n, x)
else:
    D = diff_matrix(x)
    D2 = D @ D
    A = D
    B = D2

# print(A)
np.savetxt("A_matrix.csv", A, delimiter=",", fmt="%.6f")
os.startfile("A_matrix.csv")

# print(B)
np.savetxt("B_matrix.csv", B, delimiter=",", fmt="%.6f")
os.startfile("B_matrix.csv")