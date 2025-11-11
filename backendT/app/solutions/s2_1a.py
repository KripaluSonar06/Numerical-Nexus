# app/solutions/s2_1a_stream.py
import time

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
    return f % s == 0, s


# Persistent state container (could also be saved in a DB or global dict)
STATE = {}


def stream_s2_1a(params):
    """
    Streaming Harshad factorial checker with stepwise continuation.
    Expects:
      {
        "start": 1,
        "end": 10,
        "session": "user123",
        "continue": false
      }
    """
    session = params.get("session", "default")
    start = int(params.get("start", 1))
    end = int(params.get("end", 10))
    cont = bool(params.get("continue", False))

    # Retrieve or initialize state
    state = STATE.get(session, {"i": start, "f": factorial(start), "done": False})

    if state["done"]:
        yield f"Session '{session}' is already completed.\n"
        yield "---END---"
        return

    i, f = state["i"], state["f"]
    first = start

    yield f"Starting/Resuming Harshad factorial check (session={session})...\n"

    while True:
        yield f"\nChecking {i}! = {f} ...\n"
        is_harshad, s = Check_Harshad(f)
        yield f"Sum of digits = {s}\n"

        if is_harshad:
            yield f"{i}! is a Harshad number.\n"
            i += 1
            if i > end:
                yield f"All factorials in range ({first}! ... {end}!) are Harshad numbers.\n"
                state["done"] = True
                STATE[session] = state
                yield "---END---"
                return
            f *= i
        else:
            yield f"{i}! is NOT a Harshad number!!!\n"

            if not cont:
                yield f"⏸ Awaiting user input: Continue to next factorial? [Y/N]\n"
                STATE[session] = {"i": i, "f": f, "done": False}
                yield "---WAIT---"
                return
            else:
                yield f"Continuing automatically...\n"
                i += 1
                f *= i

        time.sleep(0.3)