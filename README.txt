Delta-SVD project showcase

Static English research project page for GitHub Pages.
Serve locally with: python3 -m http.server 8765
No build step or runtime dependencies.

Files:
  index.html / style.css / app.js: presentation and interactive comparisons
  assets/: optimized selected image examples and aggregate result data
  downloads/: research poster, SD-v1.5 result CSV and evidence metadata

Deployment: GitHub Pages, main branch, repository root; .nojekyll disables Jekyll.
Only this website is published. Model weights, original image directories,
credentials, reviewer correspondence and unpublished full manuscripts are not
part of this repository.

Interpretation:
DINO is measured against subject reference images. The percentage retained is
a ratio of means, not a subject success rate. Delta storage excludes a shared
base; full-checkpoint storage includes pipeline components. Threshold t refers
to cumulative singular values, not squared energy. See downloads/evidence.json
for source hashes and bootstrap details. Image examples follow matched prompt
and image-index selections from the existing project figure script.

The GitHub source link refers to the website, not the full research codebase.
