import numpy as np
from numpy.polynomial.legendre import leggauss

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

n = int(input("Enter n value: "))
x, w = leggauss(n)

A = find_A(n, x)
B = find_B(n, x)

