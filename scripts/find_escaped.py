import re

HOME = r'C:\Users\60270\Desktop\cfworker2\home-page.js'
with open(HOME, 'rb') as f:
    raw = f.read()

# The template literals in the file use \$ as the delimiter (escaped backtick in JS)
# Let's find them using a different approach: 
# A template starts with \$ and ends with \$
# But we need to handle cases where $ appears inside strings

# Approach: find all \$ positions, then for each, find the next \$ that closes it
# A \$ closes when it's NOT preceded by another backslash (i.e., not part of an escape sequence)

dollar_pos = [i for i in range(len(raw)) if raw[i:i+2] == bytes([0x5C, 0x60])]
print(f'Found {len(dollar_pos)} \$ occurrences')

templates = []
i = 0
while i < len(dollar_pos) - 1:
    open_pos = dollar_pos[i]
    # Find the next \$ that closes this template
    # It must NOT be preceded by an odd number of backslashes
    for j in range(i+1, len(dollar_pos)):
        close_pos = dollar_pos[j]
        # Check how many backslashes precede close_pos
        num_bs = 0
        k = close_pos - 1
        while k >= 0 and raw[k:k+1] == bytes([0x5C]):
            num_bs += 1
            k -= 1
        if num_bs % 2 == 0:
            # This \$ is unescaped (even number of backslashes = not an escape sequence)
            segment = raw[open_pos:dollar_pos[j]+2]
            lineno = raw[:open_pos].count(b'\n') + 1
            templates.append((lineno, open_pos, dollar_pos[j], segment))
            break
    i += 1

print(f'Found {len(templates)} template pairs')
for t in templates[:5]:
    print(f'  L{t[0]}: open={t[1]}, close={t[2]}, len={t[3]}')
    print(f'  Content: {t[3][:80]}')
