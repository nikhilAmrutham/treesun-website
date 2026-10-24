# Treesun Technical Solutions — Website Prototype

Tesla-inspired responsive concept for **treesuntech.in**. This is a **browser-only, dependency-free static prototype** while the live website remains on **Wix Core**.

## See the design without installing anything

- Browse `index.html` in GitHub's file viewer, or enable **GitHub Pages** from **Settings → Pages** (where eligible) to publish a separate review preview.
- Your live Wix website is unchanged.
- This repository has no build step, package manager, server, or environment secrets.

## Scope
- Homepage with two divisions and first-screen **6 Solution Areas / 100+ Projects / Trusted By** placeholders
- Industrial Engineering Solutions and 3D Printing & Scale Models landing pages with six service-detail routes
- Project gallery and individual project examples
- Product catalogue, filters, product detail, local demo cart and checkout information screen
- Quote request UI for ZIP files (containing STL/STEP/STP) and custom projects
- Contact / physical store placeholder information and four policy pages

**Important:** All images and example entries are illustrative, not evidence of Treesun work. The 100+ project figure must be verified. No testimonials, logos, credentials, product prices or company address have been invented. Forms, checkout, file handling, tracking and payment are demonstration-only, not connected to Wix.

See [WIX-INTEGRATION.md](WIX-INTEGRATION.md) for the real Wix Core implementation path and [CONTENT-REPLACEMENT.md](CONTENT-REPLACEMENT.md) for launch checklist.

## Architecture
```
GitHub source / visual prototype
    |
    +-- index.html              semantic shell
    +-- styles.css              Tesla-inspired responsive design
    +-- data.js                 editable demo content
    +-- app.js                  zero-dependency front-end interactions
    |
Wix Core production (separately configured)
    +-- Wix Editor pages + Wix CMS: services, projects, company details
    +-- Wix Stores: products, checkout, tax, shipping, orders
    +-- Wix Forms: enquiries and ZIP attachment submissions
    +-- CAD analysis service: deferred
```

## Review checklist
Use a mobile browser viewport as well as desktop. Check navigation, gallery filters, quote form, product configuration, add-to-cart, cart quantity and empty-cart states. Submitting forms never sends data; it displays the Wix integration requirement.

## Privacy
Do not upload customer CAD files to this prototype. Upload controls inspect only the selected filename locally; no file is transferred or stored.
