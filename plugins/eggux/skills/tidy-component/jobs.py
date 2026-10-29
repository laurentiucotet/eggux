#!/usr/bin/env python3
"""Build a ready-to-run use_figma script for component-page.js.

Reads rows.json (page -> rows: main, helpers, block) and docs.json (main -> docs) next to this
file and prints component-page.js with JOBS filled for the pages given:

    python3 plugins/eggux/skills/tidy-component/jobs.py "Select" "Input" > /tmp/run.js

Keep a call under ~45 KB and ~14 rows; split pages across calls otherwise. Edit docs.json and
rows.json first when a component is added, renamed or its docs change.
"""
import json, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
rows = json.load(open(os.path.join(HERE, 'rows.json')))
docs = json.load(open(os.path.join(HERE, 'docs.json')))
FIELDS = ['summary', 'use', 'avoid', 'anatomy', 'rules', 'a11y', 'code', 'guides']

jobs, missing = [], []
for page in sys.argv[1:]:
    if page not in rows:
        sys.exit(f'No page "{page}" in rows.json')
    out = []
    for r in rows[page]:
        d = docs.get(r['main'])
        if d is None:
            missing.append(r['main'])
            d = {}
        out.append({'main': r['main'], 'helpers': r.get('helpers', []), 'status': d.get('status', 'Ready'),
                    'block': r.get('block'), 'examples': r.get('examples', []),
                    'docs': {k: d.get(k, '' if k in ('summary', 'code') else []) for k in FIELDS}})
    jobs.append({'page': page, 'rows': out})

src = open(os.path.join(HERE, 'component-page.js')).read()
jobs_js = 'const JOBS = ' + json.dumps(jobs, ensure_ascii=False) + ';\n'
src = re.sub(r'const JOBS = \[.*?\n\];\n', lambda _m: jobs_js, src, count=1, flags=re.S)  # a function: no backslash escapes in the JSON
src = '\n'.join(l for l in src.split('\n') if not l.strip().startswith('//'))
sys.stdout.write(src)
if missing:
    sys.stderr.write('No docs for: ' + ', '.join(missing) + ' (the Docs frame falls back to the description)\n')
sys.stderr.write(f'{len(src)} characters\n')
