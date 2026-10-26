# GTM + GA4 Setup Guide (click by click)

**Before you start:** the 5 `.html` files already contain the container ID `GTM-TNJ369RV` (2 places per file). Upload the files to the repo and switch on Pages. Do not add the gtag.js snippet from GA4. GTM delivers the Google tag.

## 1. Google tag (page views)
1. In GTM: **Tags, New**. Name: `GA4 - Google tag`. Choose **Google tag**.
2. Tag ID: `G-SEV5E8K3BB`.
3. Triggering: **Initialization - All Pages**. Save.

## 2. Variables (for the custom parameters)
**Variables, User-Defined, New**, type **Data Layer Variable**:
- Name `dlv - market`, Data Layer Variable Name `market`.
- Name `dlv - product_interest`, Data Layer Variable Name `product_interest`.

## 3. Triggers (five)
**Triggers, New, Custom Event.** Event name exactly as below, "This trigger fires on: All Custom Events". Name them `CE - <event>`:
`view_item`, `add_to_cart`, `begin_checkout`, `purchase`, `quote_request`.

## 4. Event tags (five)
For `view_item`, `add_to_cart`, `begin_checkout`, `purchase`:
1. **Tags, New, Google Analytics: GA4 Event.** Name `GA4 - <event>`.
2. Measurement ID `G-SEV5E8K3BB`. Event Name = the event (e.g. `purchase`).
3. Tick **Send Ecommerce data**, source **Data Layer**.
4. Event Parameters: add `market` = `{{dlv - market}}`.
5. Trigger: the matching `CE - <event>`. Save.

For `quote_request`: same, but no e-commerce data, and two parameters: `market` = `{{dlv - market}}`, `product_interest` = `{{dlv - product_interest}}`.

## 5. Test with Preview mode
1. Click **Preview** (top right). Enter `https://yvettedzs.github.io/nordvik-tracking-demo/` and connect.
2. In the site tab: open a product, add to cart, go to Checkout, place the order, then send a quote request.
3. In the Tag Assistant tab, click each event in the left list and confirm the matching tag shows **Tags Fired**. 
4. **Screenshot:** the event list with `purchase` selected and its tag fired.

## 6. Check in GA4 DebugView
Preview mode sends debug traffic automatically. In GA4: **Admin, DebugView**. Confirm the five events arrive with parameters (click an event to see `transaction_id`, `value`, `market`). **Screenshot** this too.

## 7. Publish and finish
1. GTM: **Submit, Publish**, version name `v1 five events`.
2. GA4: **Admin, Events**, mark `purchase` as a **key event**. Optional: **Admin, Custom definitions**, add event-scoped dimensions `market` and `product_interest`.
3. Open each UTM test link from `tracking_plan.md` (once each), then check **Realtime** and, a day later, **Reports, Acquisition** for the source and medium.

## Debugging checklist
| Symptom | Likely cause |
|---|---|
| Preview can't connect | Container ID mistyped, or the site hasn't redeployed yet (wait 1 to 2 minutes) |
| Tag doesn't fire | Event name typo (case matters) or wrong trigger attached |
| `page_view` counted twice | gtag.js snippet pasted on the site as well as GTM |
| Ecommerce data missing | "Send Ecommerce data" not ticked, or source not Data Layer |
| Parameters empty | Data Layer Variable name doesn't match (`market`, `product_interest`) |
| Nothing in reports | Standard reports lag 24 to 48 hours; use Realtime and DebugView |
