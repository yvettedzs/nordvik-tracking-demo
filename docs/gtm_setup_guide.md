# GTM + GA4 Setup Notes

**Set-up note:** The container ID `GTM-TNJ369RV` is set in the five `.html` pages (two places per file). The GA4 gtag.js snippet is deliberately not used, because GTM delivers the Google tag.

## 1. Google tag (page views)
1. In GTM: **Tags, New**. Name: `GA4 - Google tag`. Choose **Google tag**.
2. Tag ID: `G-SEV5E8K3BB`.
3. Triggering: **Initialization - All Pages**. Save.

## 2. Variables (for the custom parameters)
**Variables, User-Defined, New**, type **Data Layer Variable**:
- Name `dlv - market`, Data Layer Variable Name `market`.
- Name `dlv - product_interest`, Data Layer Variable Name `product_interest`.

## 3. Triggers (five)
**Triggers, New, Custom Event.** Set **Event name** to one of the five names below, exactly as written, and leave **This trigger fires on** at **All Custom Events**. GTM did not accept a dash in the trigger names, so they are named `CE_<event>`:

`view_item`, `add_to_cart`, `begin_checkout`, `purchase`, `quote_request`

## 4. Event tags (five)
For `view_item`, `add_to_cart`, `begin_checkout` and `purchase`:
1. **Tags, New, Google Analytics: GA4 Event.** Name `GA4 - <event>`.
2. Measurement ID `G-SEV5E8K3BB`. Event Name: the event (for example `purchase`).
3. Tick **Send Ecommerce data**, with the source set to **Data Layer**.
4. Event Parameters: add `market` = `{{dlv - market}}` (parameter name in the left box, variable in the right box).
5. Trigger: the matching `CE_<event>`. Save.

For `quote_request`: the same, but without e-commerce data and with two parameters: `market` = `{{dlv - market}}` and `product_interest` = `{{dlv - product_interest}}`.

## 5. Test with Preview mode
1. Click **Preview** (top right), enter `https://yvettedzs.github.io/nordvik-tracking-demo/` and connect.
2. In the site tab, open a product, add it to the cart, go to Checkout, place the order, then send a quote request.
3. In the Tag Assistant tab, click each event in the left list and confirm that the matching tag shows under **Tags Fired**.
4. Evidence: `docs/screenshots/01_tag_assistant_purchase_fired.png` and `02_tag_details_market.png`.

## 6. Check in GA4 DebugView
Preview mode sends debug traffic automatically. In GA4 open **Admin, DebugView** and confirm that the five events arrive with their parameters (click an event to see `transaction_id`, `value` and `market`). Evidence: `04_ga4_debugview_purchase.png` and `04a_ga4_debugview_purchase_market.png`.

## 7. Publish and finish
1. GTM: **Submit, Publish**, version name `v1 five events`.
2. GA4: on a web stream `purchase` is marked as a key event automatically. Confirm it under **Admin, Events, Key events**.
3. Open each UTM test link from `tracking_plan.md` once. Check **Realtime** straight away and, a day later, **Reports, Acquisition, Traffic acquisition** with the dimension **Session source / medium**.
4. Optional, not done in this demo: register `market` and `product_interest` as event-scoped custom dimensions under **Admin, Custom definitions**.

## Debugging checklist
| Symptom | Likely cause |
|---|---|
| Preview can't connect | Container ID mistyped, or the site has not redeployed yet (wait 1 to 2 minutes) |
| Tag doesn't fire | Event name typo (case matters) or the wrong trigger attached |
| `page_view` counted twice | gtag.js snippet pasted on the site as well as GTM |
| E-commerce data missing | **Send Ecommerce data** not ticked, or the source is not Data Layer |
| Parameters empty | Data Layer Variable name does not match (`market`, `product_interest`) |
| Nothing in reports | Standard reports lag 24 to 48 hours; use Realtime and DebugView |

## Problems I hit along the way
- **`market` arrived with no value:** I had typed the variable name into the parameter *name* box and left the value box empty. Fixing it to name `market`, value `{{dlv - market}}` made the value (for example `DE`) appear in Tag Assistant and DebugView.
- **Empty "first user source" card in Realtime:** attribution is not shown reliably for a returning browser. The user snapshot and, a day later, the Traffic acquisition report were the dependable checks.
- **Preview traffic in the reports:** my own Tag Assistant sessions appear as a `tagassistant.google.com / referral` source. In a real property, this kind of internal traffic would have to be excluded.
