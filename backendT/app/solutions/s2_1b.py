# app/solutions/s2_1b.py

from typing import Dict, Any, List

def is_harshad(num: int) -> bool:
    """Return True if num is a Harshad number."""
    s = sum(int(d) for d in str(num))
    return num % s == 0

def solve_s2_1b(params: Dict[str, Any]) -> Dict[str, Any]:
    """
    Finds consecutive Harshad numbers within a given range.

    Args:
        params: dict with keys:
            - "start": int — starting number
            - "end": int — ending number
            - "limit": int — how many consecutive Harshad numbers to find
            - "update_interval": int — how frequently to record progress updates (optional)

    Returns:
        dict containing:
            {
                "range_checked": [start, end],
                "limit": limit,
                "found": bool,
                "found_sequence": [ ... ] or None,
                "max_consecutive": int,
                "max_consecutive_sequence": [ ... ],
                "progress_updates": [ ... ],
                "summary": str
            }
    """

    start = int(params.get("start", 1))
    end = int(params.get("end", start))
    limit = int(params.get("limit", 5))
    update = int(params.get("update_interval", 1000))

    i = start
    curr = 0
    max_curr = 0
    max_curr_end = 0
    progress_updates: List[str] = []

    progress_updates.append(f"Checking between {i} and {min(i + update - 1, end)}")

    while i <= end:
        if (i - start) % update == 0 and i != start:
            progress_updates.append(f"Checking between {i} and {min(i + update - 1, end)}")

        if is_harshad(i):
            curr += 1
            if curr > max_curr:
                max_curr = curr
                max_curr_end = i
        else:
            curr = 0

        if curr >= limit:
            found_sequence = [i + j - limit + 1 for j in range(limit)]
            summary = f"Found {limit} consecutive Harshad numbers starting at {found_sequence[0]}."
            return {
                "range_checked": [start, end],
                "limit": limit,
                "found": True,
                "found_sequence": found_sequence,
                "max_consecutive": limit,
                "max_consecutive_sequence": found_sequence,
                "progress_updates": progress_updates,
                "summary": summary
            }

        i += 1

    # If no full streak found, report the maximum streak
    max_seq = [max_curr_end + j - max_curr + 1 for j in range(max_curr)]
    summary = (
        f"Did not find {limit} consecutive Harshad numbers in range [{start}, {end}]. "
        f"Maximum streak: {max_curr} consecutive numbers ending at {max_curr_end}."
    )

    return {
        "range_checked": [start, end],
        "limit": limit,
        "found": False,
        "found_sequence": None,
        "max_consecutive": max_curr,
        "max_consecutive_sequence": max_seq,
        "progress_updates": progress_updates,
        "summary": summary
    }

# CLI fallback (for quick testing)
if __name__ == "__main__":
    result = solve_s2_1b({
        "start": 1,
        "end": 10000,
        "limit": 3,
        "update_interval": 1000
    })
    print(result["summary"])
