# Tracking Plan: Nordvik Demo Shop

Fictional shop, no personal data. GA4 property "Nordvik Demo", Measurement ID `G-SEV5E8K3BB`, delivered through Google Tag Manager.

## Events

| # | Event | When it fires | Data layer trigger | Key parameters |
|---|---|---|---|---|
| 1 | `view_item` | Product page loads | `event: view_item` | `currency`, `value`, `items[]` (id, name, category, price, quantity), `market` |
| 2 | `add_to_cart` | "Add to cart" clicked | `event: add_to_cart` | same as above |
| 3 | `begin_checkout` | Checkout page loads with items | `event: begin_checkout` | `currency`, `value`, `items[]`, `market` |
| 4 | `purchase` | "Place test order" clicked | `event: purchase` | `transaction_id`, `currency`, `value`, `tax`, `shipping`, `items[]`, `market` |
| 5 | `quote_request` | Quote form submitted | `event: quote_request` | `product_interest`, `market` |

`page_view` and the UTM source/medium/campaign are collected automatically by the Google tag.

## Rules
- Event and parameter names follow GA4's recommended e-commerce names, lowercase with underscores.
- `value` is the gross price in EUR incl. VAT; `tax` is the VAT part. (A production shop would agree one convention with finance.)
- `transaction_id` is unique per order. Sending the same ID twice is how duplicate purchases happen, which Step 8 checks.
- Before every e-commerce push the data layer clears `ecommerce` (`ecommerce: null`) so old items don't leak into the next event.
- `market` (DE, AT, FR, NL, UK, SE) is sent with every event. It comes from the `?market=` link parameter, default DE.
- No personal data: the quote form collects only a product and a market.
- Consent: not implemented in this demo. A real setup would use Consent Mode so tags wait for consent (strict in DE and AT).

## UTM convention
All lowercase, no spaces. Parameters: `utm_source`, `utm_medium`, `utm_campaign` (`<theme>_<market>`), optional `utm_content`.

| Channel | utm_source | utm_medium |
|---|---|---|
| Google Ads | `google` | `cpc` |
| Meta | `meta` | `paid_social` |
| TikTok | `tiktok` | `paid_social` |
| Affiliates | `<partner>` | `affiliate` |
| Email | `newsletter` | `email` |
| SEO | (none, organic) | `organic` |

## Test links
Base: `https://yvettedzs.github.io/nordvik-tracking-demo/`

| Test | Link ending |
|---|---|
| Google | `?utm_source=google&utm_medium=cpc&utm_campaign=brand_search_de&market=DE` |
| Meta | `?utm_source=meta&utm_medium=paid_social&utm_campaign=spring_lookalike_at&market=AT` |
| TikTok | `?utm_source=tiktok&utm_medium=paid_social&utm_campaign=video_test_fr&market=FR` |
| Affiliate | `?utm_source=gardenblog&utm_medium=affiliate&utm_campaign=review_nl&market=NL` |
| Email | `?utm_source=newsletter&utm_medium=email&utm_campaign=autumn_offer_uk&market=UK` |
| **Deliberately broken** (for Step 8) | `?utm_source=Meta&utm_campaign=spring%20sale` (capital letter, missing medium, space) |
