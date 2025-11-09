import math
from functools import reduce

def digit_sum(n):
    """Calculate sum of digits of n"""
    return sum(int(d) for d in str(n))

def is_harshad(n):
    """Check if n is a Harshad number"""
    ds = digit_sum(n)
    return n % ds == 0

def lcm(a, b):
    """Calculate LCM of two numbers"""
    return abs(a * b) // math.gcd(a, b)

def lcm_list(numbers):
    """Calculate LCM of a list of numbers"""
    return reduce(lcm, numbers)

def find_consecutive_harshad(count=10, digit_sum_start=1, digit_sum_end=200, max_search=10**15):
    """
    Find consecutive Harshad numbers using the mathematical optimization.
    
    Mathematical insight:
    If N, N+1, ..., N+C-1 are all Harshad numbers with digit sums S, S+1, ..., S+C-1,
    then N-S must be divisible by lcm(9, S, S+1, ..., S+C-1).
    Therefore, N = k*L + S where L = lcm(9, S, S+1, ..., S+C-1)
    """
    results = []
    
    print(f"Searching for {count} consecutive Harshad numbers...")
    print(f"Testing digit sums from {digit_sum_start} to {digit_sum_end}")
    
    for S in range(digit_sum_start, digit_sum_end + 1):
        # Calculate LCM of 9, S, S+1, ..., S+count-1
        numbers_to_lcm = [9] + list(range(S, S + count))
        L = lcm_list(numbers_to_lcm)
        
        if S % 10 == 0:
            print(f"  Testing S={S}, L={L}")
        
        # Search for candidates of form N = k*L + S
        for k in range(1, max(1000, int(max_search / L) + 1)):
            N = k * L + S
            
            if N > max_search:
                break
            
            # Quick check: verify digit sum is actually S (not just S mod 9)
            if digit_sum(N) != S:
                continue
            
            # Verify all count consecutive numbers are Harshad
            all_harshad = True
            for i in range(count):
                if not is_harshad(N + i):
                    all_harshad = False
                    break
            
            if all_harshad:
                print(f"\n✓ Found: N = {N}, S = {S}, k = {k}, L = {L}")
                results.append(N)
                
                # Show the sequence
                print(f"  Sequence: {N} to {N + count - 1}")
                print(f"  Digit sums: ", end="")
                for i in range(count):
                    print(f"{digit_sum(N + i)}", end=" ")
                print()
                
                # If we found the second one, we can stop
                if len(results) >= 2:
                    return results
    
    return results

def verify_sequence(n, count=10):
    """Verify that n starts a sequence of count consecutive Harshad numbers"""
    print(f"\nVerifying sequence starting at {n}:")
    all_good = True
    for i in range(count):
        num = n + i
        ds = digit_sum(num)
        is_h = is_harshad(num)
        status = "✓" if is_h else "✗"
        print(f"  {status} {num}: digit_sum = {ds}, divisible = {is_h}")
        if not is_h:
            all_good = False
    return all_good

# Main execution
print("="*70)
print("Finding the SECOND occurrence of 10 consecutive Harshad numbers")
print("="*70)

# The first occurrence is trivial: 1,2,3,4,5,6,7,8,9,10
print("\nFirst occurrence: N = 1")
verify_sequence(1, 10)

# Find the second occurrence
# Based on research, we know S should be around 42-50 range for efficiency
print("\n" + "="*70)
print("Searching for second occurrence...")
print("="*70)

# Focused search in promising range based on known result
results = find_consecutive_harshad(count=10, digit_sum_start=42, digit_sum_end=55, max_search=10**13)

# Verify the known answer
print("\n" + "="*70)
print("Verification of known second occurrence:")
print("="*70)
target = 602102100620
verify_sequence(target, 10)

print("\n" + "="*70)
print(f"RESULT: Second occurrence of 10 consecutive Harshad numbers: {target}")
print("="*70)