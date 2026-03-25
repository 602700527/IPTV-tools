with open(r'C:\Users\60270\Desktop\cfworker2\handlers\seo-handler.js', 'rb') as f:
    raw = f.read()

# Find all </html> occurrences and their contexts
import re
for m in re.finditer(rb'</html>', raw):
    idx = m.start()
    print(f"Position {idx}: {repr(raw[idx:idx+50])}")
