# app/solutions/s2_1b.py

def Check_Harshad(num: int) -> bool:
    """Return True if num is a Harshad (Niven) number."""
    digit_sum = sum(int(d) for d in str(num))
    if digit_sum == 0:
        return False
    return num % digit_sum == 0


def solve_s2_1b(params: dict):
    """
    Finds a sequence of consecutive Harshad numbers within a given range.
    If an exact sequence of the given limit is not found, it reports the longest streak.
    
    Parameters:
        params: {
            "start": int,
            "end": int,
            "limit": int,
            "update": int   # optional, default=100
        }
    Returns:
        dict with details about found sequences and progress
    """

    # --- Read inputs safely ---
    start = int(params.get("start", 1))
    end = int(params.get("end", 1000))
    limit = int(params.get("limit", 5))
    update = int(params.get("update", 100))

    i = start
    curr = 0
    max_curr = 0
    max_curr_end = 0
    found_sequence = []

    progress_updates = []

    # --- Main search loop ---
    while i <= end:
        if (i - start) % update == 0:
            progress_updates.append(
                f"Checking between {i} and {min(i + update - 1, end)} ..."
            )

        if Check_Harshad(i):
            curr += 1
            if curr > max_curr:
                max_curr = curr
                max_curr_end = i
        else:
            curr = 0

        # Found desired consecutive sequence
        if curr == limit:
            # Verify if the next number breaks the streak (exact limit)
            if not Check_Harshad(i + 1):
                found_sequence = [i + j - limit + 1 for j in range(limit)]
                break
            # If next is also Harshad, continue to find a strict end
        i += 1

    # --- Prepare result summary ---
    result = {
        "range_checked": [start, end],
        "limit_requested": limit,
        "progress_updates": progress_updates,
        "found_exact_sequence": bool(found_sequence),
    }

    if found_sequence:
        result["found_sequence"] = found_sequence
        result["summary"] = (
            f"Found {limit} consecutive Harshad numbers between {found_sequence[0]} and {found_sequence[-1]}."
        )
    else:
        longest_sequence = [
            max_curr_end + j - max_curr + 1 for j in range(max_curr)
        ]
        result["found_sequence"] = longest_sequence
        result["summary"] = (
            f"Did not find exactly {limit} consecutive Harshad numbers in range "
            f"[{start}, {end}]. Maximum consecutive found = {max_curr}."
        )

    return result


# --- Optional: test locally ---
if __name__ == "__main__":
    params = {"start": 1, "end": 1000, "limit": 4, "update": 100}
    print(solve_s2_1b(params))