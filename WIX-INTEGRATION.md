# Wix Core integration guide

The code in this repo is an independent **design prototype**, not an automatically installable Wix site or a production storefront. Keep your current Wix Core subscription and treesuntech.in live until migration is complete.

## Implement in Wix Editor (no new hosting)
1. Recreate the shared global header, hero, stats, dual-division cards, project gallery, quotation banner and footer in Wix Editor, following the prototype.
2. Add CMS collections: `Solutions` (slug, title, division, summary, detail, hero photo), `Projects` (slug, title, division, category, approved images, narrative), `CompanyDetails` (address, phone, email, map link, opening hours) and optionally `Testimonials` (approved quote, attribution, consent).
3. Create dynamic item pages for Solutions and Projects, and a filterable Projects gallery.
4. Configure Wix Stores for real catalogue entries, variations, stock or made-to-order, INR, GST, pickup/shipping zones and the supported Indian gateway. **Use native Wix checkout** for orders; the demo bag in this repository is not a payment mechanism.
5. Create separate Wix Forms for industrial RFQs, printing enquiries and architectural model requests. For CAD upload, ask for a ZIP archive containing STL/STEP/STP and configure file access permissions and retention. Test file-size limits in the actual plan.
6. Replace all illustrative images, product entries, stats, addresses and policy placeholders with verified content. Add customer logos and testimonials only after approval.
7. Test responsive breakpoints, Core limits, accessibility, submission routing, mobile checkout, tax invoices and payment flow on a staging/duplicate Wix site.
8. Set SEO titles, 301 redirects from existing paths and preserve the currently live domain until the replacement is signed off.

## Architecture boundary
GitHub stores versioned prototype code. Wix Editor **does not import arbitrary static HTML/CSS/JS as native Wix pages**. Some standalone visuals could be embedded, but site navigation, cart, customer accounts, forms and checkout should remain Wix-native for production. The future CAD analysis and automated quotation engine can be added as a separate service when required.

## Browser-based review
For eligible repositories, GitHub Pages can serve the `main` branch root after enabling it under **Settings → Pages**. Private repository Pages eligibility depends on GitHub plan; Pages is not required to edit code or use Wix. Do not publish a public preview containing confidential customer assets.

## Testimonial content administration

See [TESTIMONIALS-WIX.md](TESTIMONIALS-WIX.md) for the moderation workflow, suggested schema and role model. Use the Wix Dashboard as the single trusted login; do not deploy the public `#/admin` demo route as production administration.
