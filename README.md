# Portfolio site

Static site for GitHub Pages. No build step.

## Files

- `index.html`: home page (intro, project cards, about, contact)
- `styles.css`: all styling (light and dark mode, mobile friendly)
- `projects/alaska-delta-benchmarking.html`: case study
- `projects/erp-internship-framework.html`: case study
- `projects/_template.html`: copy this for every new project
- `resume.pdf`: NOT included. Add your own file with this exact name so the Download resume button works.

## Before publishing

1. Search every file for `todo` and replace each yellow placeholder with real content.
2. Add `resume.pdf` to the root. Consider removing your phone number from the public copy.
3. Confirm with your ArchLynk director that the ERP framework page is okay to share.
4. Check the site on your phone.

## Adding a project

1. Copy `projects/_template.html` and rename it, for example `anylogistix-simulation.html`.
2. Fill in each section.
3. In `index.html`, change the matching "Coming soon" card into a link card (copy the structure of the first two cards).

## Images

Create an `images/` folder, drop screenshots in it, and reference them as `../images/name.png` from project pages.
