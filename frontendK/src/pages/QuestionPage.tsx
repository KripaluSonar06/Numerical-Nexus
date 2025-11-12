import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { useCompletion } from '@/contexts/CompletionContext';
import { BreadcrumbNav } from '@/components/ui/breadcrumb-nav';
import { TerminalWindow } from '@/components/TerminalWindow';
import { CodeViewer } from '@/components/CodeViewer';
import { CSVTable } from '@/components/CSVTable';
import { ImageViewer } from '@/components/ImageViewer';
import { PDFViewer } from '@/components/PDFViewer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, CheckCircle, Play, Code2, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const QuestionPage = () => {
  const navigate = useNavigate();
  const { assignmentId, questionId } = useParams();
  const { completedQuestions, toggleCompletion } = useCompletion();
  const { toast } = useToast();
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [terminalLines, setTerminalLines] = useState<any[]>([]);
  const [showSolution, setShowSolution] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [showPDF, setShowPDF] = useState(false);
  const [activeTab, setActiveTab] = useState('question');
  const [availableFiles, setAvailableFiles] = useState<string[]>([]);
  const [finalAnswer, setFinalAnswer] = useState<string>('');
  const [isComputing, setIsComputing] = useState(false);
  const [controller, setController] = useState<AbortController | null>(null);


  const isCompleted = completedQuestions[questionId || ''];

const questionData: Record<string, any> = {
    '2-Q1A': {
      title: 'Q1A: First Non-Harshad Factorial',
      description: 'Find the first factorial which is not a Harshad number',
      question: 'Find the first factorial in a given range that is NOT a Harshad number. A Harshad number is divisible by the sum of its digits.',
      inputs: [
        { id: 'start', label: 'Start searching from', type: 'number', placeholder: '1' },
        { id: 'end', label: 'End search at', type: 'number', placeholder: '20' }
      ],
      hasTerminal: true,
      sampleCode: `def factorial(i):
    f = 1;
    while i:
        f *= i
        i -= 1
    return f

def Check_Harshad(f):
    num = str(f)
    sum = 0
    for d in num:
        sum += int(d)
    print(f"sum of digits = {sum}")
    result = f % sum
    return (result == 0)
    
i = int(input("From which factorial You want to start? => "))
i1 = i
n = int(input("At which factorial You want to end? => "))
f = factorial(i)
while True:
    print(f"Checking {i}! = {f} ... ")
    if Check_Harshad(f):
        print(f"{i}! is a Harshad number ...")
        i += 1
        f *= i
        if i > n:
            print(f"Found no Factorial which is not a Harshad number in the range ({i1}! ... {n}!)")
            break
    else:
        print(f"{i}! is NOT a Harshad number!!!")
        op = input("Want to find the next factorial that is NOT a Harshad number [Y/y for yes] : ")
        if op == 'Y' or op == 'y':
            i += 1
            f *= i
        else:
            break`
    },
    '2-Q1B': {
      title: 'Q1B: Consecutive Harshad Numbers',
      description: 'Find n consecutive Harshad numbers within a range',
      question: 'Find n consecutive Harshad numbers in a given range with progress updates.',
      inputs: [
        { id: 'start', label: 'From which number you want to start?', type: 'number', placeholder: '1' },
        { id: 'end', label: 'At which number you want to end?', type: 'number', placeholder: '1000' },
        { id: 'limit', label: 'How many consecutive Harshad numbers?', type: 'number', placeholder: '3' },
        { id: 'update', label: 'How frequent you want to be updated?', type: 'number', placeholder: '10' }
      ],
      hasTerminal: true,
      sampleCode: `def Check_Harshad(f):
    num = str(f)
    sum = 0
    for d in num:
        sum += int(d)
    # print(f"sum of digits = {sum}")
    result = f % sum
    return (result == 0)

i = int(input("From which number You want to start? => "))
i1 = i
f = int(input("At which number You want to end? => "))
curr = 0
limit = int(input("How many Consecutive harshad number You want to find? => "))
update = int(input("How frequent you want to be updated? => "))
max_curr = 0
max_curr_end = 0
print(f"Checking between {i} and {min(i + update - 1, f)} ...")
while True:
    if(i % update == 0):
        print(f"Checking between {i} and {min(i + update - 1, f)} ...")
    if Check_Harshad(i):
        # print(f"Harshad Number!!!")
        curr += 1
        if curr > max_curr:
            max_curr = curr
            max_curr_end = i
    else:
        # print(f"Not a Harshad Number")
        curr = 0
    if(curr == limit):
        print(f"{limit} consecutive Harshad numbers found!")
        if not Check_Harshad(i + 1):
            print(f"Numbers are - ")
            for j in range(limit):
                print(f"{i + j - limit + 1}")
            break
        else:
            print(f"These numbers are not exactly {limit} consecutive Harshad numbers, as {i + 1} is also a Harshad number")
    i += 1
    if i > f: 
        print(f"Did not find exactly {limit} consecutive Harshad numbers in range [{i1}, {f}]")
        print(f"In the give range Maximum {max_curr} consecutive Harshad numbers were found - ")
        for j in range(max_curr):
            print(f"{max_curr_end + j - max_curr + 1}")
        break
# pre_start = [12,20,110,510,131052,12751220,10000095,2162049150,124324220,1,920067411130599,43494229746440272890, 12100324200007455010742303399999999999999999990,4201420328711160916072939999999999999999999999999999999999999996]
# if(limit <= 14):
#     start = pre_start[limit - 1]
#     print(f"Pre-Computed: {limit} consecutive Harshad numbers are -")
#     for i in range(limit):
#         print(f"{start + i}")
# if limit == 10:
#     print(f"Pre-Computed: Second Occurence of 10 consecutive Harshad numbers are - ")
#     start = 602102100620
#     for i in range(limit):
#         print(f"{start + i}")`
    },
    '2-Q2': {
      title: 'Q2: Modified Legendre Polynomial',
      description: 'Comprehensive analysis of modified Legendre polynomials',
      question: `Q2. Modified Legendre Polynomial Analysis (input: n)
      
A. Determine the modified Legendre polynomial of the nth order
B. Determine the companion matrix of this polynomial
C. Determine the roots using eigenvalues via LU decomposition
D. Solve Ax=b where b={1,2,...n} using LU decomposition
E. Find smallest and largest roots using Newton-Raphson method`,
      subquestions: [
        { id: 'A', title: 'Modified Legendre Polynomial', outputType: 'csv', filename: 'a.csv' },
        { id: 'B', title: 'Companion Matrix', outputType: 'csv', filename: 'b.csv' },
        { id: 'C', title: 'Roots via LU Decomposition', outputType: 'csv', filename: 'c.csv' },
        { id: 'D', title: 'Solution of Ax=b', outputType: 'csv', filename: 'd.csv' },
        { id: 'E', title: 'Newton-Raphson Roots', outputType: 'text', label: 'Smallest and Largest Roots' }
      ],
      inputs: [
        { id: 'n', label: 'Polynomial Order (n)', type: 'number', placeholder: '5' }
      ],
      hasTerminal: true,
      hasCSV: true,
      sampleCode: `import numpy as np
import csv
import sys
import time
from numpy.polynomial import polynomial as P_mod # For polycompanion and Polynomial class
from numpy.polynomial import legendre as L      # For Legendre class

# ==================================================================
# PART 1: HELPER FUNCTIONS (from generate_legendre.py)
# ==================================================================

def build_legendre_tridiagonal(n):
    """
    Constructs the n x n symmetric tridiagonal matrix (Jacobi matrix)
    for the standard Legendre polynomials.
    
    The eigenvalues of this matrix are the roots of P_n(x).
    """
    print(f"Building {n}x{n} symmetric tridiagonal matrix for root finding...")
    
    # We only need to define the off-diagonal elements
    # The diagonal elements are all 0
    
    # Beta_n = n / sqrt(4*n^2 - 1)
    # We create the 'beta' values for n = 1 to n-1
    n_range = np.arange(1.0, n) # 1, 2, ..., n-1
    beta = n_range / np.sqrt(4 * n_range**2 - 1)
    
    # Create the matrix, which is all zeros by default
    J = np.zeros((n, n))
    
    # Fill in the off-diagonals
    # np.diag(values, k=1) sets the 1st super-diagonal
    # np.diag(values, k=-1) sets the 1st sub-diagonal
    np.fill_diagonal(J[1:, :], beta) # J[i, i-1]
    np.fill_diagonal(J[:, 1:], beta) # J[i-1, i]
    
    return J

# ==================================================================
# PART 2: HELPER FUNCTIONS (from LU_solver.py)
# ==================================================================

def lu_decomposition_fast(A):
    """Vectorized LU decomposition with partial pivoting (A = PᵀLU)."""
    A = A.copy()
    n = A.shape[0]
    L = np.eye(n)
    P = np.eye(n)

    for k in range(n - 1):
        # Pivot selection
        pivot = np.argmax(np.abs(A[k:, k])) + k
        if A[pivot, k] == 0:
            raise ValueError("Singular matrix detected.")

        # Pivot swap (rows of A, P, and L up to current column)
        if pivot != k:
            A[[k, pivot]] = A[[pivot, k]]
            P[[k, pivot]] = P[[pivot, k]]
            if k > 0:
                L[[k, pivot], :k] = L[[pivot, k], :k]

        # Vectorized elimination
        L[k+1:, k] = A[k+1:, k] / A[k, k]
        A[k+1:, k:] -= np.outer(L[k+1:, k], A[k, k:])

    U = np.triu(A)
    return P, L, U


def forward_substitution_fast(L, b):
    """Vectorized forward substitution (Ly=b)."""
    n = L.shape[0]
    y = np.zeros(n, dtype=float)
    for i in range(n):
        y[i] = b[i] - np.dot(L[i, :i], y[:i])
    return y


def backward_substitution_fast(U, y):
    """Vectorized backward substitution (Ux=y)."""
    n = U.shape[0]
    x = np.zeros(n, dtype=float)
    for i in range(n - 1, -1, -1):
        x[i] = (y[i] - np.dot(U[i, i+1:], x[i+1:])) / U[i, i]
    return x


def solve_lu_fast(A, b):
    """Full LU solve using vectorized steps."""
    P, L, U = lu_decomposition_fast(A)
    Pb = P @ b
    y = forward_substitution_fast(L, Pb)
    x = backward_substitution_fast(U, y)
    return x

# ==================================================================
# PART 3: HELPER FUNCTION (from newton_raphson.py)
# ==================================================================

def newton_raphson(f, f_prime, x0, tol=1e-12, max_iter=100):
    """
    Finds a root of f(x) using the Newton-Raphson method starting from x0.
    
    Args:
        f: The function f(x).
        f_prime: The derivative function f'(x).
        x0: The initial guess.
        tol: The tolerance for convergence.
        max_iter: The maximum number of iterations.
        
    Returns:
        The root if found, else None.
    """
    x = x0
    for i in range(max_iter):
        fx = f(x)
        
        # Check if we are close enough to the root
        if abs(fx) < tol:
            return x
            
        fpx = f_prime(x)
        
        # Avoid division by zero (e.g., at a local extremum)
        if fpx == 0:
            print(f"Warning: Derivative is zero at x = {x}. Stopping iteration.")
            return None
            
        # Newton-Raphson update formula
        x_new = x - fx / fpx
        
        # Check for convergence
        if abs(x_new - x) < tol:
            return x_new
            
        x = x_new
        
    print(f"Warning: Method did not converge after {max_iter} iterations for x0 = {x0}.")
    return None


# ==================================================================
# ==================================================================
# --- MAIN EXECUTION BLOCK ---
# ==================================================================
# ==================================================================

if __name__ == "__main__":
    
    # ==================================================================
    # PART 1 & 2: generate_legendre.py + LU_solver.py
    # ==================================================================
    
    # --- Settings for printing ---
    np.set_printoptions(threshold=np.inf, precision=15, suppress=True)

    # --- Target Order (from user) ---
    try:
        n_target_input = input("Enter the desired polynomial order n: ")
        n_target = int(n_target_input)
        if n_target < 0:
            print("Order must be a non-negative integer.")
            exit()
    except ValueError:
        print("Invalid input. Please enter an integer.")
        exit()

    print(f"Calculating {n_target}th-order Shifted Legendre Polynomial...")

    # --- Output Filenames ---
    COEFFS_FILE = f'legendre_coefficients_{n_target}.csv'
    COMPANION_FILE = f'companion_matrix_{n_target}.csv'
    ROOTS_FILE = f'legendre_roots_{n_target}.csv'
    
    # --- Output Filename for LU Solver (Part 2) ---
    X_SOLUTION_FILE = f'x_solution_lu_{n_target}.csv'


    # --- Use numpy.polynomial.legendre for accuracy and simplicity ---
    # 1. Get the n-th basis polynomial for the domain [0, 1]
    p_leg_basis = L.Legendre.basis(n_target, domain=[0, 1])

    # 2. Convert it to the standard *power basis* (c0 + c1*t + c2*t^2 + ...)
    p_power_basis = p_leg_basis.convert(kind=P_mod.Polynomial, domain=[-1, 1])

    # 3. Get the coefficients from the power basis
    coeffs_low_to_high = p_power_basis.coef

    # 4. Create the np.poly1d object for compatibility
    coeffs_high_to_low = coeffs_low_to_high[::-1]
    p_final = np.poly1d(coeffs_high_to_low)

    
    # --- OUTPUT COMMENTED OUT PER REQUEST -----------------------------------------------------------------------------------
    print(f"\n--- {n_target}th-order Shifted Legendre Polynomial P*_{n_target}(t) ---")
    print(p_final)
    print("-" * 60)

    # --- 1. Save Coefficients ---
    print(f"Saving {len(coeffs_low_to_high)} coefficients to '{COEFFS_FILE}'...")
    with open(COEFFS_FILE, 'w', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(['coefficient_for_t^i'])
        for i, coeff in enumerate(coeffs_low_to_high):
            writer.writerow([f"t^{i}", coeff])
    print("Save successful.")
    # print("-" * 60) # Commented out


    # --- 2. Create and Save Companion Matrix ---
    if n_target == 0:
        print("n=0, no companion matrix or roots to generate.")
        companion_mat = np.array([])
        print("n=0, skipping LU solve.")
    else:
        # We already have this as 'coeffs_low_to_high' (length n_target + 1)
        companion_input = coeffs_low_to_high
        
        print(f"Building {n_target}x{n_target} companion matrix...")
        # Use the compatible polycompanion function
        companion_mat = P_mod.polycompanion(companion_input)
        
        print(f"Saving {companion_mat.shape} matrix to '{COMPANION_FILE}'...")
        np.savetxt(COMPANION_FILE, companion_mat, delimiter=',')
        print("Save successful.")
        # print("-" * 60) # Commented out

        # --- 3. Calculate and Save Roots (Stable Eigenvalue Method) ---
        print(f"--- Calculating {n_target} Roots ---")
        
        # 1. Build the stable tridiagonal matrix
        J_n = build_legendre_tridiagonal(n_target)
        
        print("Finding eigenvalues of the matrix...")
        start_time = time.time()
        
        # 2. Find the eigenvalues using 'np.linalg.eigh'
        standard_roots_x_k = np.linalg.eigh(J_n)[0]
        
        end_time = time.time()
        print(f"Eigenvalue calculation time: {end_time - start_time:.6f} seconds.")

        # 3. Shift the roots from [-1, 1] to [0, 1]
       # print("Shifting roots from [-1, 1] to [0, 1]...")
        shifted_roots_t_k = (standard_roots_x_k + 1.0) / 2.0
        
        # 4. Sort the final roots
        shifted_roots_t_k.sort()
        sorted_roots = shifted_roots_t_k 
        print("Sorting roots...")
        print("Calculation successful.")

        # --- Save Roots to CSV ---
        print(f"Saving {len(sorted_roots)} roots to '{ROOTS_FILE}'...")
        with open(ROOTS_FILE, 'w', newline='') as f:
            writer = csv.writer(f)
            writer.writerow([f'root_of_P*_{n_target}'])
            for root in sorted_roots:
                writer.writerow([root])

        print("Save successful.")
        
        # --- OUTPUT COMMENTED OUT PER REQUEST ---
        # print(f"First 5 roots:\n{sorted_roots[:5]}")
        # print(f"Last 5 roots:\n{sorted_roots[-5:]}")
        
        # ==================================================================
        # PART 2: LU_solver.py (Integrated Logic)
        # Runs inside the n_target > 0 block
        # ==================================================================
        print("\n--- Starting Ax=b, LU Solver  ---")
        
        # Input 'A' is the 'companion_mat' variable from Part 1
        A = companion_mat
        n = A.shape[0]
        
        # Define 'b' vector as in the original script
        b = np.arange(1, n + 1, dtype=float)

        # --- OUTPUT COMMENTED OUT PER REQUEST ---
        # print(f"Solving {n}×{n} system using built-in vectorized LU...")

        x_solution = solve_lu_fast(A, b)
        residual = np.linalg.norm(A @ x_solution - b)

        # --- OUTPUT COMMENTED OUT PER REQUEST ---
        # print(f"Residual ||Ax - b|| = {residual:.3e}")
        # if residual < 1e-8:
        #     print("Solution verified: accurate.")
        # else:
        #     print("Warning: possible instability or near-singular matrix.")

        np.savetxt(X_SOLUTION_FILE, x_solution, delimiter=',')
        print(f"Solution written to {X_SOLUTION_FILE}")
        print("--- LU Solver Finished ---")


    # --- Verification (Commented out per request) ---
    # print("-" * 60)
    # print(f"Value of P*_{n_target}(1): {p_final(1)}")
    # print(f"Value of P*_{n_target}(0): {p_final(0)}")
    #
    # print("\nGeneration script finished.")


    # ==================================================================
    # PART 3: newton_raphson.py (Appended Logic)
    # Runs sequentially after Part 1 & 2 are complete.
    # Outputs are kept as-is, per user request.
    # ==================================================================
    
    print("\n" + "=" * 60)
    print("STARTING NEWTON-RAPHSON SCRIPT")
    print("=" * 60 + "\n")
    
    # --- This is the main() logic from newton_raphson.py ---
   # print("--- Shifted Legendre Polynomial Root Finder ---")
   # print("Finds the smallest and largest roots using the Newton-Raphson method.\n")
    
    # 1. Get user input for degree n
    try:
        # Using a new variable 'n_nr' to avoid conflicts
        n_nr = n_target
        if n_nr <= 0:
            print("Error: Degree must be a positive integer.")
        else:
            # --- FIXED SECTION START ---
            
            # 2. Get coefficients for the STANDARD Legendre polynomial Pn(x)
            pn_legendre_coeffs = [0.0] * n_nr + [1.0]

            # 3. Get coefficients for the derivative, Pn'(x), in the Legendre basis
            pn_legendre_deriv_coeffs = L.legder(pn_legendre_coeffs)

            # 4. Define the SHIFTED polynomial f(x) = Pn*(x) = Pn(2x - 1)
            def f(x):
                return L.legval(2*x - 1, pn_legendre_coeffs)

            # 5. Define the derivative of the SHIFTED polynomial f'(x)
            def f_prime(x):
                return L.legval(2*x - 1, pn_legendre_deriv_coeffs) * 2

            # --- FIXED SECTION END ---

            print(f"\nFinding roots for the shifted Legendre polynomial of degree n = {n_nr}...")

            # --- Find the Roots ---
            initial_guess_smallest = 0.00
            initial_guess_largest = 1.00
            
            if n_nr == 1:
                initial_guess_smallest = 0.5
                initial_guess_largest = 0.5

            smallest_root = newton_raphson(f, f_prime, initial_guess_smallest)
            largest_root = newton_raphson(f, f_prime, initial_guess_largest)

            # --- Print Results ---
            print("\n--- Results ---")
            if smallest_root is not None:
                print(f"Smallest Root: {smallest_root:.12f}")
            else:
                print("Could not find the smallest root.")
                
            if largest_root is not None:
                if n_nr == 1:
                    print(f"Largest Root:  {largest_root:.12f} (Note: For n=1, smallest and largest are the same)")
                else:
                    print(f"Largest Root:  {largest_root:.12f}")
            else:
                print("Could not find the largest root.")
                
    except ValueError:
        print("Error: Invalid input. Please enter an integer.")

    print("\n--- Done.. ---")`
    },
    '3-Q1': {
      title: 'Q1: Gauss-Legendre Polynomial Analysis',
      description: 'Roots, weights, and orthogonal collocation matrices',
      question: `Determine the roots and weights of the Gauss-Legendre Polynomial using eigenvalues and norms of eigenvectors up to n. Plot weights against roots. Determine A & B matrices for orthogonal collocation for m.`,
      inputs: [
        { id: 'n_roots', label: 'n for roots-weights', type: 'number', placeholder: '5' },
        { id: 'n_matrices', label: 'n for A, B matrices', type: 'number', placeholder: '3' }
      ],
      hasTerminal: true,
      hasCSV: true,
      hasImage: true,
      outputs: [
        { type: 'csv', filename: 'roots-weights.csv', title: 'Roots and Weights' },
        { type: 'csv', filename: 'A_matrix.csv', title: 'A Matrix' },
        { type: 'csv', filename: 'B_matrix.csv', title: 'B Matrix' },
        { type: 'image', filename: 'roots-weights.png', title: 'Roots vs Weights Plot' }
      ],
      sampleCode: `import numpy as np
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
os.startfile("B_matrix.csv")`
    },
    '3-Q2': {
      title: 'Q2: ODE Solution by Gauss-Legendre Method',
      description: 'Solve ODE and compare with analytical solution',
      question: 'Solve the ODE using Gauss-Legendre method with n points and compare with analytical solution.',
      inputs: [
        { id: 'n', label: 'Value of n', type: 'number', placeholder: '5' },
        { id: 'To', label: 'Enter To Value', type: 'number', placeholder: '273' },
        { id: 'Ts', label: 'Enter Ts Value', type: 'number', placeholder: '373' },
        { id: 'alpha', label: 'Enter alpha (diffusibility)', type: 'number', placeholder: '1e-5' },
        { id: 'L', label: 'Enter L(Dimensioning factor)', type: 'number', placeholder: '5' }
      ],
      hasTerminal: true,
      hasPDF: true,
      pdfUrl: '/Q2.pdf', // TODO: Add Q2.pdf to public folder
      sampleCode: `import numpy as np
import math
import matplotlib.pyplot as plt
from matplotlib.widgets import Slider
from numpy.polynomial.legendre import leggauss
from scipy.interpolate import interp1d
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
eta_nodes = -np.log(np.maximum(z_nodes, 1e-100))
f_eta = interp1d(eta_nodes, f_nodes, kind='linear', bounds_error=False, fill_value=(f_nodes[0], f_nodes[-1]))

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
plt.show()`
    }
  };

  const currentQuestion = questionData[questionId || ''];

  // Mock CSV data generator - TODO: Replace with actual computation results
  const generateMockCSV = (type: string) => {
    switch (type) {
      case 'a.csv':
        return [
          ['Coefficient', 'Value'],
          ['a0', '1.0'],
          ['a1', '2.5'],
          ['a2', '-0.5'],
          ['a3', '0.75']
        ];
      case 'b.csv':
        return [
          ['Row', 'Col1', 'Col2', 'Col3'],
          ['1', '0', '1', '0'],
          ['2', '0', '0', '1'],
          ['3', '-0.5', '0', '0']
        ];
      case 'roots-weights.csv':
        return [
          ['Root', 'Weight'],
          ['-0.906', '0.236'],
          ['-0.538', '0.478'],
          ['0.000', '0.569'],
          ['0.538', '0.478'],
          ['0.906', '0.236']
        ];
      case 'A_matrix.csv':
        return [
          ['', 'x1', 'x2', 'x3'],
          ['x1', '1.0', '0.5', '0.3'],
          ['x2', '0.5', '1.0', '0.4'],
          ['x3', '0.3', '0.4', '1.0']
        ];
      default:
        return [['Data', 'Value'], ['Result', '1.234']];
    }
  };

// =============================================
// BACKEND INTEGRATION FOR COMPUTATION
// =============================================
const handleCompute = async () => {
  try {
    // Switch to Solution tab instantly
    setActiveTab("solution");
    setShowSolution(true);
    setIsComputing(true);
    setAvailableFiles([]); // clear previous files before computing

    // Reset terminal
    setTerminalLines([{ text: "🔌 Connecting to backend...", type: "info" }]);

    // Map Question ID to backend endpoint
    const endpointMap: Record<string, string> = {
      "2-Q1A": "2_1A",
      "2-Q1B": "2_1B",
      "2-Q2": "2_2",
      "3-Q1": "3_1",
      "3-Q2": "3_2",
      "3-Q3": "3_3",
    };

    const endpoint = endpointMap[questionId];
    if (!endpoint) {
      toast({
        title: "Invalid Question",
        description: "No backend endpoint found for this question.",
        variant: "destructive",
      });
      return;
    }

    const url = `http://127.0.0.1:8000/stream/${endpoint}`;

    // Call backend API (streaming)
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ params: inputs }),
    });

    if (!response.ok || !response.body) {
      throw new Error(`Backend error: ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");

    let buffer = "";
    setTerminalLines((prev) => [
      ...prev,
      { text: `Connected to ${url}`, type: "success" },
      { text: "📡 Receiving stream...", type: "info" },
    ]);

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split(/\r?\n/);
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (!line.trim()) continue;
        if (line.includes("---END---")) {
          setTerminalLines((prev) => [
            ...prev,
            { text: "✅ Computation complete.", type: "success" },
          ]);
          setIsComputing(false);
           try {
            const res = await fetch("http://127.0.0.1:8000/files");
            const data = await res.json();
            setAvailableFiles(data.available_files || []);
          } catch (err) {
            console.error("Error fetching files:", err);
          }
          toast({
            title: "Computation Complete ✅",
            description: "Streaming completed successfully.",
          });
          return;
        }

        // Append each line instantly
        setTerminalLines((prev) => [...prev, { text: line, type: "output" }]);
      }
    }

    setIsComputing(false);
    toast({
      title: "Computation Complete ✅",
      description: "Streaming finished.",
    });
  } catch (error: any) {
    console.error("Streaming error:", error);
    setIsComputing(false);
    setTerminalLines([
      { text: "❌ Streaming error occurred.", type: "error" },
      { text: error.message || "Unknown error occurred.", type: "error" },
    ]);
    toast({
      title: "Backend Error",
      description: error.message || "Unknown error occurred.",
      variant: "destructive",
    });
  }
};






  const handleMarkComplete = () => {
    toggleCompletion(questionId || '');
    toast({
      title: isCompleted ? "Unmarked as complete" : "Marked as complete!",
      description: isCompleted ? "Question reopened" : "Great job! Keep going!",
      variant: isCompleted ? "default" : "default",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-purple-950/20 to-background p-8">
      <div className="max-w-7xl mx-auto">
        <BreadcrumbNav items={[
          { label: 'Home', href: '/' },
          { label: 'Assignments', href: '/assignments' },
          { label: `Assignment ${assignmentId}`, href: `/assignment/${assignmentId}` },
          { label: currentQuestion?.title || '', href: '#' }
        ]} />

        <div className="flex items-center justify-between mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-4xl font-bold text-gradient-cyan mb-2">
              {currentQuestion?.title}
            </h1>
            <p className="text-lg text-muted-foreground">
              {currentQuestion?.description}
            </p>
          </motion.div>

          <Button
            variant="outline"
            onClick={() => navigate(`/assignment/${assignmentId}`)}
            className="glass"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>

        {/* Question Rectangle with Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-strong rounded-xl overflow-hidden"
        >
          {/* Top Bar with Tabs and Show Code Button */}
          <div className="bg-card/20 border-b border-glass-border/20 px-6 py-3 flex items-center justify-between">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
              <TabsList className="glass">
                <TabsTrigger value="question" className="flex items-center space-x-2">
                  <FileText className="w-4 h-4" />
                  <span>Question</span>
                </TabsTrigger>
                {showSolution && (
                  <TabsTrigger value="solution" className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Solution</span>
                  </TabsTrigger>
                )}
              </TabsList>
            </Tabs>

            {showSolution && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCode(!showCode)}
                className="glass ml-4"
              >
                <Code2 className="w-4 h-4 mr-2" />
                {showCode ? 'Hide' : 'Show'} Code
              </Button>
            )}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              {/* Question Tab */}
              <TabsContent value="question" className="space-y-6">
                <div className="prose prose-invert max-w-none">
                  <h3 className="text-xl font-semibold text-foreground mb-4">
                    Problem Statement
                  </h3>
                  <p className="text-muted-foreground whitespace-pre-line">
                    {currentQuestion?.question}
                  </p>
                </div>

                {/* PDF Button for Assignment 3 Q2 */}
                {currentQuestion?.hasPDF && (
                  <Button
                    onClick={() => setShowPDF(true)}
                    variant="outline"
                    className="glass"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    View Full Question PDF
                  </Button>
                )}

                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-foreground">Input Parameters</h4>
                  {currentQuestion?.inputs.map((input: any) => (
                    <div key={input.id} className="space-y-2">
                      <Label htmlFor={input.id}>{input.label}</Label>
                      <Input
                        id={input.id}
                        type={input.type}
                        placeholder={input.placeholder}
                        value={inputs[input.id] || ''}
                        onChange={(e) => setInputs({ ...inputs, [input.id]: e.target.value })}
                        className="glass"
                      />
                    </div>
                  ))}
                </div>

                <Button
                  onClick={handleCompute}
                  className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90"
                  size="lg"
                  //disabled={showSolution}
                >
                  <Play className="w-4 h-4 mr-2" />
                  {showSolution ? 'Solution Generated' : 'Get Solution'}
                </Button>
              </TabsContent>

              {/* Solution Tab */}
              {showSolution && (
                <TabsContent value="solution" className="space-y-6">
                  {/* Show Code Section */}
                  {showCode && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <CodeViewer
                        code={currentQuestion?.sampleCode}
                        language="python"
                        title="Implementation Code"
                      />
                    </motion.div>
                  )}

                  {/* Terminal Output */}
                  {currentQuestion?.hasTerminal && !showCode && (
                    <TerminalWindow lines={terminalLines} isActive={showSolution} isComputing={isComputing} />
                  )}

                  {/* CSV Outputs */}
                  {currentQuestion?.hasCSV && !showCode && (
                    <Tabs defaultValue={currentQuestion?.subquestions?.[0]?.id || currentQuestion?.outputs?.[0]?.filename} className="w-full">
                      <TabsList className="glass w-full justify-start overflow-x-auto">
                        {/* For Q2 with subquestions */}
                        {currentQuestion?.subquestions?.map((sub: any) => (
                          sub.outputType === 'csv' && (
                            <TabsTrigger key={sub.id} value={sub.id}>
                              {sub.title}
                            </TabsTrigger>
                          )
                        ))}
                        {/* For Q1 with outputs array */}
                        {currentQuestion?.outputs?.filter((out: any) => out.type === 'csv').map((output: any) => (
                          <TabsTrigger key={output.filename} value={output.filename}>
                            {output.title}
                          </TabsTrigger>
                        ))}
                      </TabsList>

                      {/* CSV Tab Contents for subquestions */}
                      {currentQuestion?.subquestions?.map((sub: any) => (
                        sub.outputType === 'csv' && (
                          <TabsContent key={sub.id} value={sub.id}>
                            <CSVTable
                              data={generateMockCSV(sub.filename)}
                              filename={sub.filename}
                            />
                          </TabsContent>
                        )
                      ))}

                      {/* CSV Tab Contents for outputs */}
                      {currentQuestion?.outputs?.filter((out: any) => out.type === 'csv').map((output: any) => (
                        <TabsContent key={output.filename} value={output.filename}>
                          <CSVTable
                            data={generateMockCSV(output.filename)}
                            filename={output.filename}
                          />
                        </TabsContent>
                      ))}
                    </Tabs>
                  )}

                  {/* Image Output */}
                 {currentQuestion?.hasImage && !showCode && availableFiles.some(f => f.endsWith(".png")) && (
                  <ImageViewer
                    key={availableFiles.find(f => f.endsWith(".png"))}
                    src={`http://127.0.0.1:8000/files/${availableFiles.find(f => f.endsWith(".png"))}?t=${Date.now()}`}
                    alt="Generated Output"
                    filename={availableFiles.find(f => f.endsWith(".png")) || ""}
                  />
                  )}


                  {/* Text Output for Q2E */}
                  {currentQuestion?.subquestions?.some((sub: any) => sub.outputType === 'text') && !showCode && (
                    <div className="glass-strong rounded-lg p-6">
                      <h4 className="text-lg font-semibold text-foreground mb-4">
                        {currentQuestion.subquestions.find((sub: any) => sub.outputType === 'text')?.title}
                      </h4>
                      <div className="bg-card/20 rounded-lg p-4 font-mono text-sm">
                        <p className="text-muted-foreground">Smallest root: -0.9061798</p>
                        <p className="text-muted-foreground">Largest root: 0.9061798</p>
                      </div>
                    </div>
                  )}

                  {/* Final Answer Section */}
                  {!showCode && finalAnswer && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="glass-strong rounded-lg p-6 border-2 border-success/30"
                    >
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="w-6 h-6 text-success mt-1 flex-shrink-0" />
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-success mb-2">
                            Final Answer
                          </h4>
                          <p className="text-foreground font-medium">
                            {finalAnswer}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Mark Complete Section */}
                  <div className="glass-strong rounded-lg p-6">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="complete"
                        checked={isCompleted}
                        onCheckedChange={handleMarkComplete}
                      />
                      <label
                        htmlFor="complete"
                        className="text-sm font-medium cursor-pointer"
                      >
                        Mark this question as complete
                      </label>
                    </div>
                  </div>
                </TabsContent>
              )}
            </Tabs>
          </div>
        </motion.div>

        {/* PDF Viewer Modal */}
        {currentQuestion?.hasPDF && (
          <PDFViewer
            pdfUrl={currentQuestion.pdfUrl}
            isOpen={showPDF}
            onClose={() => setShowPDF(false)}
          />
        )}
      </div>
    </div>
  );
};

export default QuestionPage;
