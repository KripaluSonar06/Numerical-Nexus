import numpy as np
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

    print("\n--- Done.. ---")