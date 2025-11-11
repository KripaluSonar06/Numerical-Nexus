# app/solutions/s2_1a.py

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
        return False, s
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

    start = int(params.get("start", 1))
    end = int(params.get("end", 10))

    yield f"Starting Harshad factorial check for range [{start}, {end}]...\n"

    f = factorial(start)
    first = start

    while True:
        yield f"\nChecking {start}! = {f} ...\n"
        is_harshad = Check_Harshad(f)

        if is_harshad:
            yield f"{start}! is a Harshad number.\n"
            start += 1
            if start > end:
                yield f"\nAll factorials in range ({first}! ... {end}!) are Harshad numbers.\n"
                yield "---END---"
                return
            f *= start
        else:
            yield f"{start}! is NOT a Harshad number!!!\n"
            start += 1
            if start > end:
                yield f"\nSearch completed up to {end}!.\n"
                yield "---END---"
                return
            f *= start