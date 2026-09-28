# Our Little Universe 🎂

A small interactive birthday world made for Ranoda.

## Edit the text
Everything you might want to change is in the `CONFIG` block at the top of `js/main.js`:
- `name`: her name
- `memories`: photo file names and captions
- `letter`: the letter, line by line
- `promises`, `loves`, `secrets`: the gift cards, the love bubbles, the hidden stars

## Add or change photos
Put the big version in `images/full/` and a small version (about 500px) with the **same file name** in `images/thumb/`, then add a line for it in `memories`.

## Run it locally
Double-click `index.html`, or run a tiny server in this folder:
```
python -m http.server 8000
```
then open http://localhost:8000

## Publish on GitHub Pages
Settings → Pages → Source: "Deploy from a branch" → Branch: `main` / `(root)` → Save.
