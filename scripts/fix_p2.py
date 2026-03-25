with open(r'C:\Users\60270\Desktop\cfworker2\home-page.js', 'r', encoding='utf-8', errors='ignore') as f:
    lines = f.readlines()

print(f"Total lines: {len(lines)}")

# P2-2: Remove aggregateRating blocks from SoftwareApplication schema
# Remove lines 293-297 (aggregateRating block) - need to also fix trailing comma on line 292
# The pattern is:
#   },
#     "aggregateRating": {   <- line 293
#       "@type": "AggregateRating",  <- line 294
#       "ratingValue": "4.8",  <- line 295
#       "ratingCount": "12500"  <- line 296
#     }  <- line 297
# We need to remove lines 293-297 AND remove the trailing comma from line 292

changes = 0
new_lines = []
i = 0
while i < len(lines):
    stripped = lines[i].strip()
    
    # Detect aggregateRating block start
    if stripped == '"aggregateRating": {':
        # Skip this line and next 3 lines ( AggregateRating, ratingValue, ratingCount, closing })
        # But also fix the previous line (should be }, -> } if it has a trailing comma from aggregateRating)
        # Actually check: the line before this is "    }," (line 292 in original)
        # We need to remove the comma from the previous line
        if new_lines and new_lines[-1].strip().endswith('},'):
            new_lines[-1] = new_lines[-1].rstrip().rstrip(',').rstrip() + '\n'
        # Skip aggregateRating block lines (4 lines total)
        skip_count = 4  # "aggregateRating": {, @type, ratingValue, ratingCount, }  = actually 5 lines
        # Count exact lines to skip
        skip = 0
        while i + skip < len(lines):
            skip_line = lines[i + skip].strip()
            skip += 1
            if skip_line == '}':
                break
        print(f"Skipping {skip} lines of aggregateRating block (starting line {i+1})")
        i += skip
        changes += 1
        continue
    
    new_lines.append(lines[i])
    i += 1

print(f"Removed {changes} aggregateRating blocks")
print(f"New line count: {len(new_lines)}")

# P2-3: Fix sameAs - keep only Telegram
# Find the sameAs array and replace with just the TG group URL
# The boss's actual TG URL: https://t.me/+-3ApDTfNb19jNWI1
TG_URL = '"https://t.me/+-3ApDTfNb19jNWI1"'

sameas_changes = 0
i = 0
while i < len(new_lines):
    stripped = new_lines[i].strip()
    if stripped == '"sameAs": [' or '"sameAs": [' in stripped:
        # Check if this is the Organization sameAs (line 182) - we want to KEEP this one
        # But we need to REPLACE its contents
        # Check if next lines contain twitter/facebook etc
        next_content = '\n'.join(new_lines[i:i+10])
        if 'twitter.com' in next_content or 'facebook.com' in next_content:
            # This is the Organization sameAs we need to replace
            # Count how many items in the array
            end_idx = None
            for j in range(i+1, min(i+20, len(new_lines))):
                if new_lines[j].strip().startswith(']'):
                    end_idx = j
                    break
            if end_idx:
                print(f"Replacing sameAs array at line {i+1} (replacing lines {i+1} to {end_idx+1})")
                # Replace all lines from i to end_idx with just the TG URL
                indent = '  '  # same indentation as "sameAs": [
                new_block = indent + '"sameAs": [\n' + indent + '  ' + TG_URL + '\n' + indent + ']\n'
                new_lines[i:end_idx+1] = [new_block]
                sameas_changes += 1
                print(f"Replaced with TG URL only")
    i += 1

print(f"sameAs changes: {sameas_changes}")

with open(r'C:\Users\60270\Desktop\cfworker2\home-page.js', 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print("Saved home-page.js")
