/**
 * Curated preset buggy Python snippets for one-click testing
 */

export const SAMPLE_SNIPPETS = [
  {
    id: 'off-by-one',
    title: 'Off-By-One Logic Error',
    description: 'Boundary error in list traversal causing IndexError',
    code: `def get_user_initials(names):
    initials = []
    # Bug: range(len(names) + 1) will exceed the list boundaries by 1
    for i in range(len(names) + 1):
        full_name = names[i]
        first_letter = full_name[0]
        initials.append(first_letter)
    return initials

students = ["Alice", "Bob", "Charlie"]
print("Initials:", get_user_initials(students))`,
    error: `Traceback (most recent call last):
  File "solution.py", line 11, in <module>
    print("Initials:", get_user_initials(students))
  File "solution.py", line 5, in get_user_initials
    full_name = names[i]
IndexError: list index out of range`
  },
  {
    id: 'syntax-colon',
    title: 'Syntax & Colon Omission',
    description: 'Missing colons and mismatched parenthesis',
    code: `def calculate_discount(price, is_member)
    if is_member
        discount = price * 0.15
        final_price = price - discount
        return round(final_price, 2
    else
        return price

print("Member price:", calculate_discount(100, True))`,
    error: `  File "main.py", line 1
    def calculate_discount(price, is_member)
                                           ^
SyntaxError: expected ':'`
  },
  {
    id: 'type-error',
    title: 'TypeError & String Concatenation',
    description: 'Concatenating integers directly with strings without str() cast',
    code: `def generate_receipt(item_name, quantity, unit_price):
    total = quantity * unit_price
    # Bug: cannot concatenate string with float/int without str() conversion
    receipt = "Item: " + item_name + " | Qty: " + quantity + " | Total: $" + total
    return receipt

print(generate_receipt("Wireless Mouse", 2, 29.99))`,
    error: `Traceback (most recent call last):
  File "app.py", line 7, in <module>
    print(generate_receipt("Wireless Mouse", 2, 29.99))
  File "app.py", line 4, in generate_receipt
    receipt = "Item: " + item_name + " | Qty: " + quantity + " | Total: $" + total
TypeError: can only concatenate str (not "int") to str`
  },
  {
    id: 'indentation-error',
    title: 'Indentation & Scope Error',
    description: 'Inconsistent indentation inside loop and condition',
    code: `def filter_even_numbers(numbers):
    evens = []
    for num in numbers:
    if num % 2 == 0:
        evens.append(num)
    return evens

nums = [1, 2, 3, 4, 5, 6]
print("Evens:", filter_even_numbers(nums))`,
    error: `  File "script.py", line 4
    if num % 2 == 0:
    ^
IndentationError: expected an indented block after 'for' statement on line 3`
  },
  {
    id: 'bad-import',
    title: 'Bad Import & NameError',
    description: 'Typo in library import and calling non-existent method',
    code: `import mathe  # Typo in module name

def compute_hypotenuse(a, b):
    # NameError / ModuleNotFoundError
    return mathe.sqrt(a**2 + b**2)

print("Hypotenuse:", compute_hypotenuse(3, 4))`,
    error: `Traceback (most recent call last):
  File "geometry.py", line 1, in <module>
    import mathe
ModuleNotFoundError: No module named 'mathe'`
  }
];
