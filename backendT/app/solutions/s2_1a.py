# app/solutions/s2_1a.py

from typing import Dict, Any, List

def factorial(i: int) -> int:
    """Compute factorial of i using an iterative approach."""
    f = 1
    while i:
        f *= i
        i -= 1
    return f

def is_harshad(num: int) -> bool:
    """Return True if num is a Harshad number, else False."""
    s = sum(int(d) for d in str(num))
    return num % s == 0

def solve_s2_1a(params: Dict[str, Any]) -> Dict[str, Any]:
    """
    Find if factorial numbers between 'start' and 'end' are Harshad numbers.
    
    Args:
        params: Dictionary with keys:
            - "start" (int): starting factorial number
            - "end" (int): ending factorial number
            - "continue_after_nonharshad" (bool, optional): 
                whether to continue checking after finding a non-Harshad factorial

    Returns:
        Dict containing results:
            {
                "range_checked": [start, end],
                "harshad_factorials": [...],
                "nonharshad_found": {"n": int, "factorial": str} or None,
                "summary": str
            }
    """
    start = int(params.get("start", 1))
    end = int(params.get("end", start))
    continue_flag = bool(params.get("continue_after_nonharshad", False))

    i = start
    f = factorial(i)
    harshads: List[int] = []
    nonharshad_info = None

    while True:
        if is_harshad(f):
            harshads.append(i)
            i += 1
            f *= i
            if i > end:
                summary = f"All factorials between {start}! and {end}! are Harshad numbers."
                break
        else:
            nonharshad_info = {"n": i, "factorial": str(f)}
            summary = f"{i}! is the first factorial that is not a Harshad number."
            if continue_flag:
                i += 1
                f *= i
                continue
            else:
                break

    return {
        "range_checked": [start, end],
        "harshad_factorials": harshads,
        "nonharshad_found": nonharshad_info,
        "summary": summary
    }

# CLI fallback (optional)
if __name__ == "__main__":
    # Example test
    result = solve_s2_1a({"start": 1, "end": 10})
    print(result)