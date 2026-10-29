# danion1.github.io

My portfolio site, built with [Astro](https://astro.build) and published to GitHub Pages at <https://danion1.github.io> on every push to `main`.

## Add a project (5 steps)

1. Copy `src/content/projects/robot-arm.md` to `src/content/projects/<new-name>.md` (the file name becomes the address: `/projects/<new-name>/`).
2. Put its images and video in `public/media/<new-name>/` and point `cover`, `video` and `images` in the file header to them (`/media/<new-name>/...`).
3. Edit the header (`title`, `summary`, `order`, `tags`, `facts`, `repo`) and write the text below it in Markdown.
4. Not ready yet? Set `status: coming-next`: it shows as a card on the home page, with no page of its own.
5. Run `npm run build && npm run check-links`, look at it with `npm run preview`, then commit and push.

## Commands

| Command | What it does |
|---|---|
| `npm install` | installs the exact versions in `package-lock.json` |
| `npm run dev` | live preview at `http://localhost:4321` while editing |
| `npm run build` | builds the site into `dist/` |
| `npm run preview` | serves `dist/` at `http://localhost:4321` |
| `npm run check-links` | checks every link and file in `dist/` (add `-- --offline` to skip external links) |

Personal details (name, e-mail, LinkedIn, resume) live in `src/site.ts`. No analytics and no third-party fonts or scripts: the site loads nothing from other domains.
