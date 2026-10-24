# Treesun testimonial moderation — Wix Core implementation

## Decision
**Use Wix Dashboard authentication** for all production administration. Do not build or deploy the public prototype's `#/admin` route as a secure login. Wix CMS holds testimonials and Wix Editor displays only approved, consented entries. No new hosting service is needed.

## Roles
- **Site Owner:** full access, controls collaborators and site publication.
- **Content Editor:** scoped permissions to add/edit approved CMS collections where permitted; should not manage billing, payments or collaborator access.
- **Testimonial Publisher:** an owner or designated person who verifies authenticity, permission and publishing suitability. This may initially be the owner rather than a separate role.

Configure Wix collaborators and CMS collection permissions based on Wix's current role capabilities. Do not expose collection write permissions to visitors.

## Collection: Testimonials
Create a CMS collection with the following fields (recommended keys and types):

| Field | Type | Notes |
| --- | --- | --- |
| `customerName` | Text | Approved display name; don't use sensitive identifiers |
| `company` | Text | Optional, with approval |
| `jobTitle` | Text | Optional, with approval |
| `quote` | Rich text or Text | Exact wording approved by customer |
| `division` | Text / Tags | Industrial Engineering / 3D Printing & Scale Models |
| `consentGranted` | Boolean | Required before publication |
| `consentReference` | Text | Internal record reference; do not expose publicly |
| `status` | Text | Draft / In Review / Published / Archived |
| `sortOrder` | Number | Homepage ordering |
| `photo` | Image | Optional approved photo |
| `featured` | Boolean | Display on homepage |
| `lastReviewed` | Date | Optional moderation timestamp |

Keep access to internal consent reference restricted. For stronger confidentiality, use a separate, staff-only collection for approval records if Wix permissions cannot isolate fields within the same collection.

## Moderation workflow
1. Staff adds a testimonial to the Wix collection as **Draft**.
2. Verify the identity and statement independently. Obtain documented permission for the exact quote, attribution and any photo/logo.
3. Reviewer marks it **In Review**, then **Published** and sets `consentGranted=true` only after review.
4. Public dataset is filtered to `status=Published`, `consentGranted=true`, `featured=true` (where relevant). Sort by `sortOrder`.
5. Editing a live testimonial should trigger re-review when the meaning or attribution changes; remove it from public view until it is approved.
6. Unpublish immediately if the customer revokes consent. Keep only minimal records needed for legitimate audit/retention policies.

## Homepage
Create a Wix repeater connected to Testimonials. Display customer name, approved quote and optional approved role/company/photo. Do not invent a star rating or customer logos. If no approved records exist, hide the repeater or show neutral explanatory copy.

## Browser prototype
- Open `#/admin` in the GitHub preview.
- Add customer name and quote, record the consent checkbox, and save draft.
- Publish only consented entries.
- Use **Unpublish**, **Edit**, and **Delete** to manage records.
- Published entries appear on the home page in the same browser.

The demo intentionally uses browser `localStorage` only. It is **not authentication** and is not safe for personal or confidential information. Do not host it as a production admin tool. It does not update Wix CMS.

## Acceptance tests in Wix
- Anonymous visitor cannot add, edit or delete Testimonials collection items.
- Content editor can access only intended collections.
- Draft/in-review/archived records are not publicly visible.
- Published entries require permission, appear in the correct division and disappear when unpublished.
- Customer attribution and photos match exact approvals.
- Phone/mobile and keyboard layouts show no clipping.
- Live site publishing and CMS live/sandbox behavior are verified.
