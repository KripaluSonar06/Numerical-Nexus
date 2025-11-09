import numpy as np
from numpy.polynomial.legendre import leggauss
import matplotlib.pyplot as plt

# Compute nodes (x) and weights (w)

def find_A(n, x):
    # Q
    Q = np.zeros((n + 2,n + 2))
        
    for i in range(0, n + 2):
        for j in range(0, n + 2):
            if i == 0 :
                Q[0][j] = (-1) ** j
            elif i == n + 1:
                Q[n + 1][j] = 1 ** j
            else:
                Q[i][j] = x[i - 1] ** j
        
    # C
    C = np.zeros((n + 2,n + 2))
    for j in range(0, n + 2):
        if j == 0:
            C[0][j] = 0
        else:
            C[0][j] = j * ((-1) ** (j - 1))
        
    for i in range(1, n + 1):
        for j in range(0, n + 2):
            if j == 0:
                C[i][j] = 0
            else:
                C[i][j] = j * (x[i - 1] ** (j - 1))
            
    for j in range(0, n + 2):
        if j == 0:
            C[n + 1][j] = 0
        else:
            C[n + 1][j] = j * (1 ** (j - 1))
        
    Q_inv = np.linalg.inv(Q)
    A = np.matmul(C, Q_inv)
    return A

def find_B(n, x):
    # Q
    Q = np.zeros((n + 2,n + 2))
        
    for i in range(0, n + 2):
        for j in range(0, n + 2):
            if i == 0 :
                Q[0][j] = (-1) ** j
            elif i == n + 1:
                Q[n + 1][j] = 1 ** j
            else:
                Q[i][j] = x[i - 1] ** j
        
    # C
    C = np.zeros((n + 2,n + 2))
    for j in range(0, n + 2):
        if j == 0 or j == 1:
            C[0][j] = 0
        else:
            C[0][j] = j * (j - 1) * ((-1) ** (j - 2))
        
    for i in range(1, n + 1):
        for j in range(0, n + 2):
            if j == 0 or j == 1:
                C[i][j] = 0
            else:
                C[i][j] = j * (j - 1) * (x[i - 1] ** (j - 2))
            
    for j in range(0, n + 2):
        if j == 0 or j == 1:
            C[n + 1][j] = 0
        else:
            C[n + 1][j] = j * (j - 1) * (1 ** (j - 2))
        
    Q_inv = np.linalg.inv(Q)
    B = np.matmul(C, Q_inv)
    return B
    
n = int(input("Enter n value for roots-weights graph: "))
x, w = leggauss(n)

# Display results
# for i in range(64):
#     print(f"x[{i:2d}] = {x[i]: .16f}, w[{i:2d}] = {w[i]: .16f}")

plt.figure(figsize=(8,5))
plt.plot(x, w, 'o-', color='black', markersize=6, label='Gauss-Legendre weights')
plt.xlabel('Roots (x)')
plt.ylabel('Weights (w)')
plt.title(f'Gauss-Legendre Weights vs Roots (n = {n})')
plt.grid(True, linestyle='--', alpha=0.6)
plt.legend()
plt.show()

n = int(input("Enter n value for A and B matrix: "))
x, w = leggauss(n)

A = find_A(n, x)
# print(A)
np.savetxt("A_matrix.csv", A, delimiter=",", fmt="%.6f")

B = find_B(n, x)
# print(B)
np.savetxt("B_matrix.csv", B, delimiter=",", fmt="%.6f")