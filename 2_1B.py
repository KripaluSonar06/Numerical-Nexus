def Check_Harshad(f):
    num = str(f)
    sum = 0
    for d in num:
        sum += int(d)
    # print(f"sum of digits = {sum}")
    result = f % sum
    return (result == 0)

i = int(input("From which number You want to start? => "))
i1 = i
f = int(input("At which number You want to end? => "))
curr = 0
limit = int(input("How many Consecutive harshad number You want to find? => "))
update = int(input("How frequent you want to be updated? => "))
max_curr = 0
max_curr_end = 0
print(f"Checking between {i} and {min(i + update - 1, f)} ...")
while True:
    if(i % update == 0):
        print(f"Checking between {i} and {min(i + update - 1, f)} ...")
    if Check_Harshad(i):
        # print(f"Harshad Number!!!")
        curr += 1
        if curr > max_curr:
            max_curr = curr
            max_curr_end = i
    else:
        # print(f"Not a Harshad Number")
        curr = 0
    if(curr >= limit):
        print(f"{limit} consecutive Harshad number found!")
        print(f"Numbers are - ")
        for j in range(limit):
            print(f"{i + j - limit + 1}")
        break
    i += 1
    if i > f: 
        print(f"Did not find {limit} consecutive Harshad numbers in range [{i1}, {f}]")
        print(f"Maximum {max_curr} consecutive Harshad numbers were found - ")
        for j in range(max_curr):
            print(f"{max_curr_end + j - max_curr + 1}")
        break