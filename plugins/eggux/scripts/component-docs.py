#!/usr/bin/env python3
"""EGG UX component docs, step 2 of 2.

Reads the JSON returned by scripts/component-docs.js (one or more files) and writes one
Markdown file per component page to references/components/, plus an index (README.md).
Links each component to the usage guides that mention it and to its row in code-mapping.md.

    python3 plugins/eggux/scripts/component-docs.py data1.json data2.json ...
"""
import html
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # plugins/eggux
OUT = os.path.join(ROOT, 'references', 'components')
GUIDES = [os.path.join(ROOT, 'skills', 'build-ui', d) for d in ('components', 'patterns')]
CODE_MAP = os.path.join(ROOT, 'references', 'code-mapping.md')
DOCS = os.path.join(ROOT, 'skills', 'tidy-component', 'docs.json')  # the Docs frames' content


def slug(name):
    return re.sub(r'[^a-z0-9]+', '-', name.lower().replace('&', 'and')).strip('-')


def load(paths):
    pages = {}
    generated = ''
    for p in paths:
        data = json.load(open(p))
        generated = max(generated, data.get('generated', ''))
        for page in data['pages']:
            pages[page['page']] = page
    return pages, generated


def guide_index():
    idx = {}
    for d in GUIDES:
        for f in sorted(os.listdir(d)):
            if not f.endswith('.md'):
                continue
            text = open(os.path.join(d, f)).read()
            for name in set(re.findall(r'`([^`]+)`', text)):
                idx.setdefault(name, []).append(os.path.relpath(os.path.join(d, f), OUT))
    return idx


def code_index():
    idx = {}
    for line in open(CODE_MAP):
        if not line.startswith('| `'):
            continue
        cells = [c.strip() for c in line.strip().strip('|').split('|')]
        if len(cells) < 2:
            continue
        for name in re.findall(r'`([^`]+)`', cells[0]):
            idx.setdefault(name, []).append((cells[1], cells[2] if len(cells) > 2 else ''))
    return idx


def tokens_block(t):
    rows = []
    for key, label in (('colors', 'Colors'), ('sizes', 'Spacing and size'), ('radii', 'Radius'),
                       ('text', 'Text styles'), ('effects', 'Effects')):
        if t.get(key):
            rows.append(f'- {label}: ' + ', '.join(f'`{v}`' for v in t[key]))
    return rows


def render_component(c, guides, codes):
    out = [f"## {c['name']}", '']
    kind = 'Component set' if c['type'] == 'set' else 'Component'
    meta = f"{kind} · {c['variants']} variant{'s' if c['variants'] != 1 else ''} · default size {c['size'].replace('x', ' × ')}"
    out += [meta, '']
    if c['description']:
        out += [html.unescape(c['description']), '']
    d = DOC.get(c['name'])
    if d:
        for key, title in (('use', 'Use for'), ('avoid', 'Not for'), ('anatomy', 'Anatomy'),
                           ('rules', 'Content and behavior'), ('a11y', 'Accessibility')):
            if d.get(key):
                items = [f'{i + 1}. {x}' for i, x in enumerate(d[key])] if key == 'anatomy' else [f'- {x}' for x in d[key]]
                out += [f'**{title}**', ''] + items + ['']
    if c['variantProps']:
        out += ['| Variant property | Values |', '|---|---|']
        out += [f"| {n} | {', '.join(v)} |" for n, v in c['variantProps']]
        out.append('')
    if c['props']:
        out += ['| Property | Type | Default |', '|---|---|---|']
        for n, t, d in c['props']:
            d = html.unescape(d).replace('\n', ' ⏎ ').replace('|', '\\|')
            out.append(f'| {n} | {t.lower().replace("_", " ")} | {d} |')
        out.append('')
    if c['slots']:
        out += ['Slots (fill them in the instance, never detach): ' + ', '.join(f'`{s}`' for s in c['slots']), '']
    if c['parts'] or c['icons']:
        line = []
        if c['parts']:
            line.append('Built from: ' + ', '.join(f'`{p}`' for p in c['parts']))
        if c['icons']:
            line.append('Icons: ' + ', '.join(c['icons']))
        out += ['. '.join(line), '']
    tok = tokens_block(c['tokens'])
    if tok:
        out += ['Tokens and styles:'] + tok + ['']
    g = guides.get(c['name'])
    if g:
        links = ', '.join(f'[{os.path.basename(x)[:-3]}]({x})' for x in sorted(set(g)))
        out += [f'Guides: {links}', '']
    cm = codes.get(c['name'])
    if cm:
        code, notes = cm[0]
        out += [f'Code: {code}' + (f' ({notes})' if notes else ''), '']
    return out


def render_page(page, generated, guides, codes):
    name = page['page']
    out = [f'# {name}', '',
           f'Generated from the EGG UI master library on {generated} by `scripts/component-docs.js` and',
           '`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.',
           'Usage rules live in the guides linked under each component.', '']
    out += ['| Component | Variants | Slots |', '|---|---|---|']
    for c in page['components']:
        out.append(f"| [{c['name']}](#{slug(c['name'])}) | {c['variants']} | {', '.join(c['slots']) or '-'} |")
    out.append('')
    extras = sorted(set(page.get('extras', [])))
    if extras:
        out += ['On the Figma page: ' + ', '.join(f'"{e}"' for e in extras), '']
    for c in page['components']:
        out += render_component(c, guides, codes)
    return '\n'.join(out).rstrip() + '\n'


def main(paths):
    global DOC
    DOC = json.load(open(DOCS)) if os.path.exists(DOCS) else {}
    pages, generated = load(paths)
    guides, codes = guide_index(), code_index()
    os.makedirs(OUT, exist_ok=True)
    index = ['# Component reference', '',
             f'One file per component page of the EGG UI master library, generated on {generated}.',
             'Each component lists its variants, properties with defaults, slots, the components and icons',
             'it is built from, the tokens and styles it uses, its usage guides and its code mapping. Main',
             'components also list when to use them, anatomy, rules and accessibility from',
             '`skills/tidy-component/docs.json`, the same content as the Docs frame on the Figma page.', '',
             '## Regenerate', '',
             '1. Run `scripts/component-docs.js` with `use_figma` on the master library, a few pages per call',
             '   (set `PAGES`), and save each returned JSON to a file.',
             '2. Run `python3 plugins/eggux/scripts/component-docs.py <json files>`.',
             '3. Review the diff; commit with the release.', '',
             '## Pages', '', '| Page | Components |', '|---|---|']
    total = 0
    for name in sorted(pages, key=str.lower):
        page = pages[name]
        fn = slug(name) + '.md'
        open(os.path.join(OUT, fn), 'w').write(render_page(page, generated, guides, codes))
        comps = ', '.join(c['name'] for c in page['components'])
        index.append(f'| [{name}]({fn}) | {comps} |')
        total += len(page['components'])
    index += ['', f'{total} components on {len(pages)} pages.', '']
    open(os.path.join(OUT, 'README.md'), 'w').write('\n'.join(index))
    print(f'{len(pages)} pages, {total} components → {OUT}')


if __name__ == '__main__':
    main(sys.argv[1:])
