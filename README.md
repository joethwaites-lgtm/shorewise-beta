# Shorewise v18 demo

Static stakeholder demo for Shorewise. It can be hosted from GitHub Pages because `index.html` is at the root of this folder.

## GitHub Pages

1. Create a new repository and upload every file in this folder to the repository root.
2. In **Settings → Pages**, choose **Deploy from a branch**, then select the main branch and `/ (root)`.
3. Wait for GitHub to publish the Pages URL.

No build command is required.

The repository also contains a structured GitHub issue form for local knowledge. After publishing, contributors with a GitHub account can open **Issues → New issue → Location intelligence**. For instructors who do not use GitHub, copy the same questions from `CONTRIBUTING.md` into a short Google Form or Tally form and add its link to the website.

## Important demo limitations

- Forecasts and routing are fetched in the browser from third-party services. Their availability, licensing and rate limits must be reviewed before commercial release.
- Broad tide/current models are not navigation data and do not resolve local races, rips, harbour streams or shipping movements.
- Hazard records are curated and deliberately conservative; coverage is not exhaustive.
- River locations without human-validated gauge thresholds remain research leads rather than green recommendations.
- The demo has no account backend, subscription system, admin workflow or protected API-key storage.
- GitHub Pages is public. Do not add API secrets, private contributor details or unpublished access information to this repository.

## Recommended next production work

- Store spots, evidence, review dates and hazard rules in a managed database.
- Add a moderation/admin workflow for Paddle UK, instructors and local clubs.
- Proxy paid/licensed data feeds through a backend; never expose secret keys in browser code.
- Add monitoring, analytics with consent, privacy controls and a documented incident process.
