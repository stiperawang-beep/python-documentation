import os
import json

CONTENT_DIR = 'content'
CATALOG_FILE = 'catalog.json'

PRIORITY_FOLDERS = [
    'tutorial',
    'library',
    'reference',
    'howto',
    'faq',
    'whatsnew'
]

def build_tree(path):
    tree = []
    
    # Try to sort indexing correctly based on index.md then rest
    try:
        items = os.listdir(path)
    except PermissionError:
        return []

    # Sort items: directories first, then files. For files, index.md first.
    dirs = []
    files = []
    for item in items:
        if item.startswith('.') or item == '_static':
            continue
        
        full_path = os.path.join(path, item)
        if os.path.isdir(full_path):
            dirs.append(item)
        else:
            if item.endswith('.md'):
                files.append(item)
                
    dirs.sort()
    files.sort(key=lambda x: (x != 'index.md', x))

    for item in files:
        full_path = os.path.join(path, item)
        rel_path = os.path.relpath(full_path, CONTENT_DIR).replace('\\', '/')
        title = item.replace('.md', '').replace('-', ' ').title()
        if title.lower() == 'index':
            title = 'Introduction'
        
        tree.append({
            'type': 'file',
            'title': title,
            'path': rel_path
        })
        
    for item in dirs:
        full_path = os.path.join(path, item)
        children = build_tree(full_path)
        if children:
            tree.append({
                'type': 'directory',
                'title': item.replace('-', ' ').title(),
                'children': children
            })
            
    return tree

def main():
    catalog = []
    
    # Process priority folders first
    for folder in PRIORITY_FOLDERS:
        full_path = os.path.join(CONTENT_DIR, folder)
        if os.path.exists(full_path) and os.path.isdir(full_path):
            children = build_tree(full_path)
            if children:
                catalog.append({
                    'type': 'directory',
                    'title': folder.title(),
                    'children': children
                })
                
    # Add an "Others" section for the remaining
    others_children = []
    for item in sorted(os.listdir(CONTENT_DIR)):
        if item in PRIORITY_FOLDERS or item.startswith('.') or item == '_static':
            continue
            
        full_path = os.path.join(CONTENT_DIR, item)
        if os.path.isdir(full_path):
            children = build_tree(full_path)
            if children:
                others_children.append({
                    'type': 'directory',
                    'title': item.replace('-', ' ').title(),
                    'children': children
                })
        elif item.endswith('.md'):
            rel_path = os.path.relpath(full_path, CONTENT_DIR).replace('\\', '/')
            title = item.replace('.md', '').replace('-', ' ').title()
            others_children.append({
                'type': 'file',
                'title': title,
                'path': rel_path
            })
            
    if others_children:
        catalog.append({
            'type': 'directory',
            'title': 'Advanced & Internal',
            'children': others_children
        })
        
    with open(CATALOG_FILE, 'w', encoding='utf-8') as f:
        json.dump(catalog, f, indent=2)
        
    print(f"Catalog generated at {CATALOG_FILE}")

if __name__ == '__main__':
    main()
