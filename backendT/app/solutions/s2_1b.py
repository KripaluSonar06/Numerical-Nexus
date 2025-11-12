# app/solutions/s2_1b_stream.py
import sys

# ============================================================
# Helper functions
# ============================================================

def flush_line(line: str):
    """Force immediate flush of a line."""
    sys.stdout.flush()
    return f"{line.rstrip()}\n"

def Check_Harshad(f: int) -> bool:
    """Check if a number is Harshad."""
    s = sum(int(d) for d in str(f))
    if s == 0:
        return False
    return f % s == 0


def stream_s2_1b(params: dict):
    """
    Streams progress of finding consecutive Harshad numbers.
    Example params:
    {
        "start": 1,
        "end": 1000,
        "limit": 5,
        "update": 100
    }
    """
    try:
        start = int(params.get("start", "1"))
        end = int(params.get("end", "1000"))
        limit = int(params.get("limit", "5"))
        update = int(params.get("update", "100"))

        yield flush_line(f"Searching for {limit} consecutive Harshad numbers in range [{start}, {end}]...\n")

        i = start
        curr = 0

        # initial update message
        yield flush_line(f"Checking between {i} and {min(i + update - 1, end)} ...\n")

        while True:
            if (i - start) % update == 0:
                yield flush_line(f"Checking between {i} and {min(i + update - 1, end)} ...\n")

            if Check_Harshad(i):
                curr += 1
                # yield flush_line(f"{i} is a Harshad number (current streak = {curr})\n"
            else:
                # if curr > 0:
                #     yield flush_line(f"{i} breaks the streak (was {curr} long)\n"
                curr = 0

            if curr == limit:
                yield flush_line(f"\n{limit} consecutive Harshad numbers found!\n")
                if not Check_Harshad(i + 1):
                    yield flush_line(f"Numbers are:\n")
                    for j in range(limit):
                        yield flush_line(f"{i + j - limit + 1}\n")
                    yield flush_line("---END---")
                    return
                else:
                    yield flush_line(f"Found more than {limit} consecutive — continuing search...\n")

            i += 1
            if i > end:
                yield flush_line(f"\nDid not find exactly {limit} consecutive Harshad numbers in range [{start}, {end}].\n")
                yield flush_line("---END---")
                return


    except Exception as e:
        yield flush_line(f"Error: {str(e)}\n")
        yield flush_line("---END---")
