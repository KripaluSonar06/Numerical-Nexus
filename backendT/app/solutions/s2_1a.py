# app/solutions/s2_1a.py
import sys

# ============================================================
# Helper functions
# ============================================================

def flush_line(line: str):
    """Force immediate flush of a line for true real-time streaming."""
    sys.stdout.flush()
    return f"{line.rstrip()}\n"

def factorial(i):
    f = 1
    while i:
        f *= i
        i -= 1
    return f

def Check_Harshad(f):
    num = str(f)
    s = sum(int(d) for d in num)
    if s == 0:
        return False
    return f % s == 0


def stream_s2_1a(params):
    """
    Streaming Harshad factorial checker (non-interactive).
    Expects:
      {
        "start": 1,
        "end": 10
      }
    Streams progress and results continuously without waiting for input.
    """

    try:
        start = int(params.get("start", 1))
        end = int(params.get("end", 10))

        yield flush_line(f"Starting Harshad factorial check for range [{start}, {end}]...")

        f = factorial(start)
        first = start

        while True:
            yield flush_line(f"Checking {start}! = {f} ...")

            is_harshad = Check_Harshad(f)

            if is_harshad:
                yield flush_line(f"{start}! is a Harshad number ✅")
                start += 1
                if start > end:
                    yield flush_line(f"\nAll factorials in range ({first}! ... {end}!) are Harshad numbers ✅")
                    yield flush_line("---END---")
                    return
                f *= start
            else:
                yield flush_line(f"{start}! = {f}")
                yield flush_line(f"{start}! is NOT a Harshad number ❌")
                yield flush_line("---END---")
                return

    except Exception as e:
        yield flush_line(f"Error: {str(e)}")
        yield flush_line("---END---")
