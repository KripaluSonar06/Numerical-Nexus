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
        print(f"{limit} consecutive Harshad numbers found!")
        print(f"Numbers are - ")
        for j in range(limit):
            print(f"{i + j - limit + 1}")
        break
    i += 1
    if i > f: 
        print(f"Did not find {limit} consecutive Harshad numbers in range [{i1}, {f}]")
        print(f"In the give range Maximum {max_curr} consecutive Harshad numbers were found - ")
        for j in range(max_curr):
            print(f"{max_curr_end + j - max_curr + 1}")
        break
# pre_start = [12,20,110,510,131052,12751220,10000095,2162049150,124324220,1,920067411130599,43494229746440272890, 12100324200007455010742303399999999999999999990,4201420328711160916072939999999999999999999999999999999999999996]
# if(limit <= 14):
#     start = pre_start[limit - 1]
#     print(f"Pre-Computed: {limit} consecutive Harshad numbers are -")
#     for i in range(limit):
#         print(f"{start + i}")
# if limit == 10:
#     print(f"Pre-Computed: Second Occurence of 10 consecutive Harshad numbers are - ")
#     start = 602102100620
#     for i in range(limit):
#         print(f"{start + i}")