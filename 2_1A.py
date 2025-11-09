def factorial(i):
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
        print(f"{i}! = {f} is NOT a Harshad number!!!")
        i+=1
        f *= i
        print(f"Next factorial is {i}! = {f}")
        break