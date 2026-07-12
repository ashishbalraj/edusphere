import os, glob

replacements = {
    r"'\`\`\`json'": r"'```json'",
    r"'\`\`\`'": r"'```'",
    r"/^\`\`\`json\n/": r"/^```json\n/",
    r"/^\`\`\`[a-z]*\n/": r"/^```[a-z]*\n/",
    r"/^\`\`\`\n/": r"/^```\n/",
    r"/\n\`\`\`$/": r"/\n```$/",
    r"'\`\`\`json": r"'```json",
    r"'\`\`\`": r"'```",
    r"^\`\`\`json\\n": r"^```json\\n",
    r"^\`\`\`[a-z]*\\n": r"^```[a-z]*\\n",
    r"^\`\`\`\\n": r"^```\\n",
    r"\\n\`\`\`$": r"\\n```$",
}

count = 0
for filepath in glob.glob(r'e:\ASHISH\frontend\src\pages\ai\*.tsx'):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    new_content = content
    for old, new in replacements.items():
        new_content = new_content.replace(old, new)
        
    if content != new_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        count += 1
        print(f'Updated {os.path.basename(filepath)}')

print(f'Total files updated: {count}')
