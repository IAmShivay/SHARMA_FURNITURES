# WhatsApp Business Automation — Complete Plan

## 3 Businesses

| # | Business | Type | Primary Goal |
|---|----------|------|-------------|
| 1 | FormiqStudio | Digital Agency | Lead capture, follow-up, client onboarding |
| 2 | Sharma Furnitures (LuxeHome) | E-commerce | Orders, cart recovery, reviews, promotions |
| 3 | Annvaya | Brand/Product | Customer engagement, support, updates |

---

## Phase 1: Setup (Day 1-3)

### 1.1 Buy Phone Numbers

Buy 3 new SIM cards (Jio or Airtel). Rs 200-300 each.

Do NOT use your personal number. Once connected to WhatsApp Business API, it cannot be used on regular WhatsApp.

| Business | Number | Purpose |
|----------|--------|---------|
| FormiqStudio | New SIM 1 | Lead follow-up, client communication |
| Sharma Furnitures | New SIM 2 | Order updates, promotions, cart recovery |
| Annvaya | New SIM 3 | Customer engagement, support |

### 1.2 Meta Business Account

1. Go to https://business.facebook.com
2. Create one business account (can manage all 3 numbers)
3. Verify business: upload GST certificate or utility bill
4. Verification takes 2-5 business days

### 1.3 AiSensy Accounts

| Business | Plan | Cost | Why |
|----------|------|------|-----|
| FormiqStudio | Basic (Rs 1,500/mo) | Rs 1,500/mo | Need broadcasts + automation for leads |
| Sharma Furnitures | Basic (Rs 1,500/mo) | Rs 1,500/mo | Need order flows + cart recovery |
| Annvaya | Free Forever | Rs 0/mo | Start free, upgrade when needed |

Sign up at https://app.aisensy.com for each.

### 1.4 Connect Numbers

For each business on AiSensy:
1. Go to Settings -> Connect WhatsApp
2. Enter the new phone number
3. Verify via OTP sent to that SIM
4. Link your Meta Business Account
5. API goes live immediately

---

## Phase 2: Message Templates (Day 3-5)

Submit these to Meta for approval. Takes 24-48 hours.

### FormiqStudio Templates

#### TEMPLATE 1: Welcome (after website form submission)
- Category: Marketing
- Name: `formiq_welcome`
```
Hi {{1}},

Thanks for reaching out to FormiqStudio!

Here's what happens next:
1. Our team reviews your requirements
2. We call you within 2 hours
3. We share a custom plan for your business

Have a question right now? Just reply here.

- Shivay, Founder
```
Buttons: [Call Us] [View Plans]

#### TEMPLATE 2: Follow-up (no reply after 2 hours)
- Category: Marketing
- Name: `formiq_followup_2h`
```
Hi {{1}},

This is Shivay from FormiqStudio. I noticed you were looking at our {{2}} services.

I'd love to understand your business better. Can we do a quick 10-minute call today?

No pitch, just advice. Even if you don't go with us, you'll walk away with a clear plan.
```
Buttons: [Yes, Call Me] [Not Now]

#### TEMPLATE 3: Follow-up (no reply after 24 hours)
- Category: Marketing
- Name: `formiq_followup_24h`
```
Hi {{1}},

Quick update from FormiqStudio.

We're currently onboarding {{2}} new businesses this month. If you'd like to discuss your project, now is a good time.

Our Growth Plan starts at just Rs 6,999/month — website + ads + social media included.

Reply YES and I'll set up a call.
```
Buttons: [Yes, I'm Interested] [Maybe Later]

#### TEMPLATE 4: Client onboarding
- Category: Utility
- Name: `formiq_onboarding`
```
Hi {{1}}, welcome aboard!

Your {{2}} plan is now active. Here's your roadmap:

Day 1-3: Discovery call + brand assets collection
Day 4-10: Website design + content creation
Day 11-15: Website launch + ad campaign setup
Day 16+: Optimization + monthly reporting

Your account manager: Shivay
Direct line: +91 8918349445

We'll call you today to kick things off.
```

#### TEMPLATE 5: Monthly report notification
- Category: Utility
- Name: `formiq_monthly_report`
```
Hi {{1}},

Your monthly performance report for {{2}} is ready:

Website visitors: {{3}}
Leads generated: {{4}}
Ad spend: Rs {{5}}
Cost per lead: Rs {{6}}

Full report: {{7}}

Questions? Reply here or call your account manager.
```

#### TEMPLATE 6: Review request (after 30 days)
- Category: Marketing
- Name: `formiq_review_request`
```
Hi {{1}},

It's been a month since we started working together. We hope you're seeing results!

Would you take 30 seconds to share your experience? A quick Google review helps us help more businesses like yours.

Review here: {{2}}

Thank you!
```
Buttons: [Leave Review] [Not Now]

---

### Sharma Furnitures Templates

#### TEMPLATE 1: Order confirmation
- Category: Utility
- Name: `furniture_order_confirmed`
```
Hi {{1}},

Your order #{{2}} is confirmed!

Items: {{3}}
Total: Rs {{4}}
Payment: {{5}}
Estimated delivery: {{6}} days

Track your order anytime by replying TRACK.

Thank you for shopping with LuxeHome!
```

#### TEMPLATE 2: Shipping update
- Category: Utility
- Name: `furniture_shipped`
```
Hi {{1}},

Your order #{{2}} has been shipped!

Courier: {{3}}
Tracking ID: {{4}}
Expected delivery: {{5}}

Track here: {{6}}
```

#### TEMPLATE 3: Delivered + review request
- Category: Utility
- Name: `furniture_delivered`
```
Hi {{1}},

Your order #{{2}} has been delivered!

We hope you love your new {{3}}. If anything isn't perfect, reply here and we'll make it right within 24 hours.

Happy with your purchase? A quick review means a lot:
{{4}}
```
Buttons: [Leave Review] [Report Issue]

#### TEMPLATE 4: Abandoned cart recovery
- Category: Marketing
- Name: `furniture_cart_recovery`
```
Hi {{1}},

You left some items in your cart:

{{2}}
Total: Rs {{3}}

Your cart is saved for the next 24 hours.

Complete your order: {{4}}
```
Buttons: [Complete Order] [Need Help?]

#### TEMPLATE 5: Abandoned cart - discount (24h later)
- Category: Marketing
- Name: `furniture_cart_discount`
```
Hi {{1}},

Still thinking about it? Here's 10% off your cart!

{{2}}
Original: Rs {{3}}
With discount: Rs {{4}}

Use code: COMEBACK10
Offer expires in 12 hours.

Shop now: {{5}}
```
Buttons: [Shop Now] [Browse More]

#### TEMPLATE 6: New arrivals broadcast
- Category: Marketing
- Name: `furniture_new_arrivals`
```
Hi {{1}},

New arrivals at LuxeHome!

{{2}} — starting from Rs {{3}}

Free delivery across India.
Easy EMI available.

Browse: {{4}}

Reply STOP to unsubscribe.
```
Buttons: [Shop Now] [View All]

#### TEMPLATE 7: Festival/sale announcement
- Category: Marketing
- Name: `furniture_sale`
```
Hi {{1}},

{{2}} SALE at LuxeHome!

Up to {{3}}% off on selected furniture.
Sale ends: {{4}}

Top picks:
{{5}}

Shop now: {{6}}

Reply STOP to unsubscribe.
```
Buttons: [Shop Sale] [Remind Me Later]

#### TEMPLATE 8: COD confirmation (reduces refusals)
- Category: Utility
- Name: `furniture_cod_confirm`
```
Hi {{1}},

Your COD order #{{2}} is ready for dispatch.

Total to pay on delivery: Rs {{3}}

Please confirm you'll be available to receive it.

Reply YES to confirm or CANCEL to cancel.
```
Buttons: [Yes, Dispatch] [Cancel Order]

---

### Annvaya Templates

#### TEMPLATE 1: Welcome
- Category: Marketing
- Name: `annvaya_welcome`
```
Hi {{1}},

Welcome to Annvaya!

We're glad you're here. Browse our latest collection: {{2}}

Need help choosing? Reply here and we'll guide you.
```

#### TEMPLATE 2: Order confirmation
- Category: Utility
- Name: `annvaya_order_confirmed`
```
Hi {{1}},

Your Annvaya order #{{2}} is confirmed!

Total: Rs {{3}}
Estimated delivery: {{4}}

We'll update you when it ships.
```

#### TEMPLATE 3: Support auto-reply
- Category: Utility
- Name: `annvaya_support`
```
Hi {{1}},

Thanks for reaching out to Annvaya!

Our team typically responds within 1 hour during business hours (10 AM - 7 PM IST).

For urgent queries, call: {{2}}
```

---

## Phase 3: Chatbot Flows (Day 5-7)

Build in AiSensy Dashboard -> Flow Builder (drag-and-drop, no code).
Chatbot Flow Builder add-on costs Rs 2,500/month.

### AiSensy Node Types Reference

| Node Type | What It Does | When to Use |
|-----------|-------------|-------------|
| Text Message | Send plain text reply | Greetings, info |
| Quick Reply | Show 1-3 buttons, user taps one | Menu selection, yes/no |
| List Message | Show scrollable list (up to 10 items) | Product categories, service options |
| Media | Send image/video/document | Product photos, catalogs, PDFs |
| API Call | Hit external URL, use response | Order tracking, CRM lookup |
| Collect Input | Ask user to type something | Name, phone, order number |
| Tag Contact | Add/remove tag on contact | Segment leads |
| Assign Agent | Route to human agent | Support escalation |
| Delay | Wait before next step | Timed follow-ups |
| Condition | Branch based on value | Check tag, check input |
| Template | Send approved template message | Outside 24h window |

### How to Build in AiSensy Dashboard

1. Go to AiSensy Dashboard -> Chatbot -> Flow Builder
2. Click "Create New Flow"
3. Set trigger (keyword, first message, or template reply)
4. Drag nodes from left panel onto canvas
5. Connect nodes with arrows
6. Test with "Preview" button
7. Click "Publish"

---

### CHATBOT 1: FormiqStudio (Lead Capture Bot)

**Purpose:** Qualify leads, collect contact info, route to Shivay
**Trigger:** Any first message or keywords: hi, hello, website, ads, marketing, plan

```
NODE 1: Text Message (Welcome)
  Type: Text
  Message: "Hi! Welcome to FormiqStudio.
            We help local businesses get more customers
            through websites, ads, and social media."

NODE 2: Quick Reply (Service Selection)
  Type: Quick Reply
  Message: "What are you looking for?"
  Buttons:
    [1] "I need a website"
    [2] "I need ads/marketing"
    [3] "Rs 6,999 Growth Plan"
    [4] "Talk to someone"

  Button 1 -> NODE 3A
  Button 2 -> NODE 3B
  Button 3 -> NODE 3C
  Button 4 -> NODE 7

NODE 3A: Collect Input (Website Lead)
  Type: Collect Input
  Message: "Great! What's your business name?"
  Save as: {{business_name}}
  -> NODE 4

NODE 3B: Collect Input (Ads Lead)
  Type: Collect Input
  Message: "What's your monthly marketing budget?"
  Save as: {{budget}}
  -> NODE 4

NODE 3C: Text Message (Growth Plan Info)
  Type: Text
  Message: "The Growth Plan (Rs 6,999/month) includes:
            - Professional website
            - Facebook & Instagram ads
            - Social media management (12 posts/month)
            - Monthly performance report
            - Dedicated account manager
            - Cancel anytime"
  -> NODE 4

NODE 4: Collect Input (Name)
  Type: Collect Input
  Message: "What's your name?"
  Save as: {{name}}
  -> NODE 5

NODE 5: Collect Input (Phone)
  Type: Collect Input
  Message: "And your phone number? (We'll call, not spam)"
  Save as: {{phone}}
  -> NODE 6

NODE 6: Text + Tag + Assign
  Type: Text Message
  Message: "Thanks {{name}}! Our team will call you within 2 hours.
            Meanwhile, check our work: https://formiqstudio.in
            
            If urgent, call Shivay directly: +91 8918349445"
  Action: Tag contact as "new-lead"
  Action: Assign to agent "Shivay"
  -> END

NODE 7: Assign Agent (Live Handoff)
  Type: Assign Agent
  Message: "Connecting you to Shivay now..."
  Agent: Shivay
  -> END
```

**Keyword Triggers (separate mini-flows):**

| Keyword | Response |
|---------|----------|
| price, pricing, cost, rate | "Our Growth Plan starts at Rs 6,999/month. Check plans: formiqstudio.in/#pricing" |
| portfolio, work, examples | "See our recent work: formiqstudio.in/portfolio" |
| contact, call, phone | "Call Shivay: +91 8918349445 or reply here" |
| thanks, thank you | "You're welcome! Reach out anytime." |

---

### CHATBOT 2: Sharma Furnitures / LuxeHome (E-commerce Bot)

**Purpose:** Product browsing, order tracking, support, returns
**Trigger:** Any first message or keywords: hi, hello, furniture, sofa, bed, order, track

```
NODE 1: Text + Media (Welcome)
  Type: Text Message
  Message: "Welcome to LuxeHome!
            Premium furniture delivered across India."
  Media: Brand banner image

NODE 2: List Message (Main Menu)
  Type: List Message
  Message: "How can we help you today?"
  List Title: "Choose an option"
  Items:
    [1] "Browse Sofas"        -> NODE 3A
    [2] "Browse Beds"         -> NODE 3B
    [3] "Browse Dining"       -> NODE 3C
    [4] "Track My Order"      -> NODE 4
    [5] "Return / Exchange"   -> NODE 5
    [6] "Talk to Support"     -> NODE 6

NODE 3A: Media + Text (Sofas)
  Type: Media (Image)
  Image: Top 3 sofa collection image
  Message: "Our bestselling sofas, starting Rs 12,999.
            
            Browse all: https://furniture.formiqstudio.in/category/sofas
            
            Free delivery on orders above Rs 5,000.
            EMI available."
  -> Quick Reply: [View More] [Back to Menu]

NODE 3B: Media + Text (Beds)
  Type: Media (Image)
  Image: Bed collection image
  Message: "Premium beds with storage, starting Rs 15,999.
            
            Browse all: https://furniture.formiqstudio.in/category/beds
            
            Free delivery. Easy returns."
  -> Quick Reply: [View More] [Back to Menu]

NODE 3C: Media + Text (Dining)
  Type: Media (Image)
  Image: Dining table collection image
  Message: "Dining sets for every home, starting Rs 8,999.
            
            Browse all: https://furniture.formiqstudio.in/category/dining"
  -> Quick Reply: [View More] [Back to Menu]

NODE 4: Collect Input (Order Tracking)
  Type: Collect Input
  Message: "Please enter your order number (e.g., ORD-000123)"
  Save as: {{order_id}}
  -> NODE 4B

NODE 4B: API Call (Order Lookup)
  Type: API Call
  URL: https://furniture.formiqstudio.in/api/orders/track/{{order_id}}
  Method: GET
  On Success: "Order #{{order_id}}
               Status: {{response.status}}
               Estimated delivery: {{response.delivery_date}}"
  On Failure: "Sorry, we couldn't find that order number. Please double-check and try again, or reply HELP."
  -> Quick Reply: [Back to Menu] [Talk to Support]

NODE 5: Collect Input (Return Flow)
  Type: Collect Input
  Message: "Sorry to hear that. What's your order number?"
  Save as: {{return_order_id}}
  -> NODE 5B

NODE 5B: Collect Input (Issue Description)
  Type: Collect Input
  Message: "What's the issue? (damaged, wrong item, size issue, other)"
  Save as: {{return_reason}}
  -> NODE 5C

NODE 5C: Text + Tag + Assign
  Type: Text Message
  Message: "We've noted your return request for order #{{return_order_id}}.
            Reason: {{return_reason}}
            
            Our support team will contact you within 4 hours to arrange the return.
            
            We apologize for the inconvenience."
  Action: Tag contact as "return-request"
  Action: Assign to agent "Support"
  -> END

NODE 6: Assign Agent (Support)
  Type: Assign Agent
  Message: "Connecting you to our support team...
            Our hours: 10 AM - 7 PM IST.
            If outside hours, we'll reply first thing tomorrow."
  Agent: Support Team
  -> END
```

**Keyword Triggers:**

| Keyword / Regex | Response |
|-----------------|----------|
| track, order status, where is my order | Jump to NODE 4 (Order Tracking) |
| return, exchange, refund, damaged | Jump to NODE 5 (Return Flow) |
| sofa, couch | Jump to NODE 3A |
| bed, mattress | Jump to NODE 3B |
| dining, table | Jump to NODE 3C |
| delivery, shipping | "Free delivery across India on orders above Rs 5,000. Standard delivery: 7-10 days." |
| emi, installment | "EMI available on orders above Rs 10,000. No cost EMI for select banks." |
| discount, offer, sale | "Check our latest offers: furniture.formiqstudio.in/offers" |
| help | Jump to NODE 6 (Support) |
| menu, start, restart | Jump to NODE 2 (Main Menu) |

---

### CHATBOT 3: Annvaya (Product Discovery + Health Bot)

**Purpose:** Product education, recommendations, order support
**Trigger:** Any first message or keywords: hi, hello, organic, powder, herbal, ashwagandha, moringa

```
NODE 1: Text Message (Welcome)
  Type: Text Message
  Message: "Hi! Welcome to Annvaya.
            100% natural superfoods, herbal powders, and dried fruits.
            Sourced from Indian farms. No chemicals. No preservatives."

NODE 2: Quick Reply (Category Selection)
  Type: Quick Reply
  Message: "What are you looking for?"
  Buttons:
    [1] "Superfood Powders"
    [2] "Dried Fruits & Snacks"
    [3] "Dried Flowers & Herbs"
    [4] "Help Me Choose"

  Button 1 -> NODE 3A
  Button 2 -> NODE 3B
  Button 3 -> NODE 3C
  Button 4 -> NODE 4

NODE 3A: List Message (Superfood Powders)
  Type: List Message
  Message: "Our bestselling superfood powders:"
  Items:
    [1] "Ashwagandha Powder - Rs 299"     -> Send product card + buy link
    [2] "Moringa Powder - Rs 249"          -> Send product card + buy link
    [3] "Amla Powder - Rs 199"             -> Send product card + buy link
    [4] "Turmeric Powder - Rs 179"         -> Send product card + buy link
    [5] "Beetroot Powder - Rs 229"         -> Send product card + buy link
    [6] "Wheatgrass Powder - Rs 299"       -> Send product card + buy link
    [7] "View All Powders"                 -> Website link
  After selection: send product image + description + buy link
  -> Quick Reply: [Add to Cart] [Know Benefits] [Back to Menu]

NODE 3B: List Message (Dried Fruits)
  Type: List Message
  Message: "Healthy snacking, the natural way:"
  Items:
    [1] "Banana Chips - Rs 149"
    [2] "Mango Slices - Rs 199"
    [3] "Jackfruit Chips - Rs 179"
    [4] "Apple Chips - Rs 249"
    [5] "Amla Candy - Rs 129"
    [6] "View All Snacks"
  After selection: send product image + buy link
  -> Quick Reply: [Buy Now] [Back to Menu]

NODE 3C: List Message (Dried Flowers)
  Type: List Message
  Message: "For teas, garnishing, and wellness:"
  Items:
    [1] "Rose Petals - Rs 199"
    [2] "Hibiscus Flowers - Rs 179"
    [3] "Chamomile Flowers - Rs 249"
    [4] "Lavender - Rs 299"
    [5] "Mint Leaves - Rs 149"
    [6] "View All Flowers"
  -> Quick Reply: [Buy Now] [Back to Menu]

NODE 4: Quick Reply (Health Goal Recommender)
  Type: Quick Reply
  Message: "What's your health goal? I'll recommend the right product."
  Buttons:
    [1] "Better sleep & stress"
    [2] "Immunity & energy"
    [3] "Skin & hair"
    [4] "Weight management"

  Button 1 -> NODE 4A
  Button 2 -> NODE 4B
  Button 3 -> NODE 4C
  Button 4 -> NODE 4D

NODE 4A: Text + Media (Sleep & Stress)
  Message: "For better sleep and stress relief, try:
            
            1. Ashwagandha Powder - Reduces cortisol, improves sleep
            2. Chamomile Flowers - Calming herbal tea before bed
            3. Tulsi Powder - Adaptogenic stress relief
            
            Best combo: Ashwagandha + Chamomile Tea (Rs 499)"
  Media: Product combo image
  -> Quick Reply: [Buy Combo] [Know More] [Back to Menu]

NODE 4B: Text + Media (Immunity)
  Message: "For immunity and energy:
            
            1. Moringa Powder - 7x more Vitamin C than oranges
            2. Amla Powder - Richest natural source of Vitamin C
            3. Wheatgrass Powder - Complete nutrition in one spoon
            
            Best combo: Moringa + Amla (Rs 399)"
  -> Quick Reply: [Buy Combo] [Know More] [Back to Menu]

NODE 4C: Text + Media (Skin & Hair)
  Message: "For glowing skin and strong hair:
            
            1. Amla Powder - Apply on hair or drink with water
            2. Beetroot Powder - Natural glow from inside
            3. Rose Petals - Rose water face mist
            4. Neem Powder - Acne and skin clarity
            
            Best combo: Amla + Beetroot + Rose Petals (Rs 549)"
  -> Quick Reply: [Buy Combo] [Know More] [Back to Menu]

NODE 4D: Text + Media (Weight)
  Message: "For weight management:
            
            1. Moringa Powder - Boosts metabolism
            2. Wheatgrass Powder - Detox and cleanse
            3. Beetroot Powder - Pre-workout energy
            
            Best combo: Moringa + Wheatgrass (Rs 499)"
  -> Quick Reply: [Buy Combo] [Know More] [Back to Menu]
```

**Keyword Triggers:**

| Keyword | Response |
|---------|----------|
| ashwagandha | Ashwagandha product card + benefits + buy link |
| moringa | Moringa product card + benefits + buy link |
| amla | Amla product card + benefits + buy link |
| sleep, stress, anxiety | Jump to NODE 4A |
| immunity, energy, vitamin | Jump to NODE 4B |
| skin, hair, glow, acne | Jump to NODE 4C |
| weight, diet, detox, fat | Jump to NODE 4D |
| order, track, status | "Please share your order number" -> API lookup |
| price, cost | Send full price list image |
| organic, natural, chemical free | "All Annvaya products are 100% natural. No chemicals, no preservatives, no additives." |
| delivery, shipping | "We deliver pan-India. Free shipping on orders above Rs 499. Delivery in 3-5 days." |
| bulk, wholesale | "For bulk orders (10+ units), contact: +91 8918349445. Special pricing available." |
| help, support | Assign to agent |

---

## Phase 4: Automation Workflows (Day 7-10)

Build in AiSensy Dashboard -> Automation -> Create Sequence.

### AiSensy Automation Types

| Type | Trigger | Use Case |
|------|---------|----------|
| Tag-based | Contact gets a tag | Lead nurture after qualification |
| Time-based | Scheduled at specific time | Daily/weekly broadcasts |
| Event-based | Webhook from your app | Order placed, cart abandoned |
| Reply-based | User replies with keyword | Confirmation flows (YES/NO) |
| Inactivity-based | No reply after X time | Follow-up sequences |

### Dashboard Steps to Create Automation

1. AiSensy Dashboard -> Automation -> Create New
2. Name the sequence
3. Set trigger (tag added / webhook / schedule)
4. Add steps: Send Template -> Wait -> Condition -> Send Template
5. Set conditions: "Did they reply?" / "Tag exists?" / "Time elapsed?"
6. Activate

---

### FORMIQSTUDIO AUTOMATIONS (3 workflows)

#### Workflow 1: Lead Nurture Sequence
**Type:** Tag-based
**Trigger:** Contact tagged "new-lead" (by chatbot after form/chat)

```
Step 1 [Instant]
  Action: Send template "formiq_welcome"
  
Step 2 [Wait 2 hours]
  Condition: Did they reply?
    YES -> Action: Assign to Shivay
           Action: Tag "hot-lead"
           Action: Stop sequence
    NO  -> Continue

Step 3 [After 2h, no reply]
  Action: Send template "formiq_followup_2h"

Step 4 [Wait 24 hours]
  Condition: Did they reply?
    YES -> Action: Assign to Shivay
           Action: Tag "hot-lead"
           Action: Stop sequence
    NO  -> Continue

Step 5 [After 24h, no reply]
  Action: Send template "formiq_followup_24h"

Step 6 [Wait 7 days]
  Condition: Did they reply?
    YES -> Action: Assign to Shivay
           Action: Stop sequence
    NO  -> Action: Tag "cold-lead"
           Action: Remove tag "new-lead"
           Action: Stop sequence (re-engage in 30 days via broadcast)
```

#### Workflow 2: Client Onboarding
**Type:** Tag-based
**Trigger:** Contact tagged "active-client" (manually by Shivay after signing)

```
Step 1 [Instant]
  Action: Send template "formiq_onboarding"

Step 2 [Wait 30 days]
  Action: Send template "formiq_monthly_report"
  (Shivay fills in template params with actual numbers before sending)

Step 3 [Wait 30 days after Step 2]
  Action: Send template "formiq_review_request"

Step 4 [Repeat every 30 days]
  Action: Send template "formiq_monthly_report"
```

#### Workflow 3: Cold Lead Re-engagement
**Type:** Tag-based
**Trigger:** Contact tagged "cold-lead" for 30+ days

```
Step 1 [Day 30 after cold tag]
  Action: Send template with case study
  Message: "Hi {{name}}, one of our clients got 38 leads in their first month.
            Want to see how? Reply YES."

Step 2 [Wait 7 days]
  Condition: Did they reply YES?
    YES -> Remove "cold-lead" tag, add "re-engaged", assign to Shivay
    NO  -> Stop (don't spam further)
```

---

### FURNITURE AUTOMATIONS (5 workflows)

#### Workflow 1: Order Lifecycle
**Type:** Event-based (webhook)
**Trigger:** POST from backend when order is created

```
Step 1 [Instant]
  Action: Send template "furniture_order_confirmed"
  Params: customer_name, order_id, items, total, payment_method, delivery_days

Step 2 [Condition: Payment method = COD?]
  YES -> Step 2A
  NO  -> Wait for shipping webhook

Step 2A [Instant after Step 1]
  Action: Send template "furniture_cod_confirm"
  Wait for reply:
    "YES" / Button "Yes, Dispatch" -> Tag "cod-confirmed"
    "CANCEL" / Button "Cancel Order" -> Tag "cod-cancelled"
                                        Webhook to backend: cancel order
    No reply in 12h -> Send reminder: "Hi {{name}}, please confirm your COD order #{{order_id}}"
    No reply in 24h -> Auto-cancel, tag "cod-no-response"

Step 3 [Webhook: order shipped]
  Action: Send template "furniture_shipped"
  Params: customer_name, order_id, courier, tracking_id, delivery_date, tracking_url

Step 4 [Webhook: order delivered + 3 days]
  Action: Send template "furniture_delivered"
  Params: customer_name, order_id, product_name, review_link
```

#### Workflow 2: Abandoned Cart Recovery
**Type:** Event-based (webhook)
**Trigger:** POST from frontend when cart is abandoned for 1 hour

```
Step 1 [1 hour after abandonment]
  Action: Send template "furniture_cart_recovery"
  Params: customer_name, cart_items, cart_total, cart_link

Step 2 [Wait 24 hours]
  Condition: Did they purchase? (check via API/webhook)
    YES -> Stop sequence
    NO  -> Continue

Step 3 [24h after Step 1]
  Action: Send template "furniture_cart_discount"
  Params: customer_name, cart_items, original_price, discounted_price, cart_link
  (10% discount code auto-generated)

Step 4 [Wait 48 hours]
  Condition: Did they purchase?
    YES -> Stop
    NO  -> Tag "window-shopper", stop sequence
```

#### Workflow 3: Re-engagement (inactive customers)
**Type:** Tag-based + Time-based
**Trigger:** No purchase in 60 days (check weekly via scheduled job)

```
Step 1 [Day 60]
  Action: Send template "furniture_new_arrivals"
  Params: customer_name, category, website_link
  Content: Latest products in their previously browsed category

Step 2 [Day 90, if no purchase]
  Action: Send template "furniture_sale"
  Params: customer_name, discount_percent, sale_end_date, top_picks, website_link
  Content: Exclusive 15% off code

Step 3 [Day 120, if still no purchase]
  Action: Send text "We miss you" with 20% off code
  This is the last message. Don't spam beyond this.
```

#### Workflow 4: Post-Purchase Upsell
**Type:** Time-based
**Trigger:** 14 days after delivery confirmed

```
Step 1 [Day 14 after delivery]
  Action: Send template with related products
  Message: "Hi {{name}}, how's your new {{product}}?
            Customers who bought {{product}} also loved:
            - {{related_1}} (Rs {{price_1}})
            - {{related_2}} (Rs {{price_2}})
            Browse: {{link}}"
```

#### Workflow 5: Review Collection
**Type:** Time-based
**Trigger:** 7 days after delivery

```
Step 1 [Day 7 after delivery]
  Action: Send template "furniture_delivered" (with review link)
  
Step 2 [Wait 3 days]
  Condition: Did they leave a review? (check via API)
    YES -> Send "Thank you for your review! Here's 10% off your next order: THANKYOU10"
    NO  -> Send gentle reminder: "Your feedback helps other customers. Takes 30 seconds: {{review_link}}"
    
Step 3 [If still no review after 7 more days]
  Stop. Don't ask again.
```

---

### ANNVAYA AUTOMATIONS (5 workflows)

#### Workflow 1: Welcome + Product Education
**Type:** Tag-based
**Trigger:** New contact (first message, QR scan, or ad click)

```
Step 1 [Instant]
  Action: Send template "annvaya_welcome"
  Action: Tag "new-subscriber"

Step 2 [Wait 1 day]
  Action: Send product education message
  Message: "Did you know? 1 spoon of Moringa Powder has 7x more Vitamin C than oranges.
            Try it in your morning smoothie: {{product_link}}"

Step 3 [Wait 3 days]
  Action: Send bestseller highlight
  Message: "Our #1 bestseller: Ashwagandha Powder
            Helps with: Sleep, stress, energy
            1,000+ happy customers
            Rs 299: {{buy_link}}"

Step 4 [Wait 7 days]
  Condition: Did they purchase?
    YES -> Move to "customer" segment, stop
    NO  -> Send first-order discount: "Use code WELCOME15 for 15% off your first order"
```

#### Workflow 2: Post-Purchase Reorder Reminder
**Type:** Time-based
**Trigger:** 25 days after order delivered (most powders last ~30 days)

```
Step 1 [Day 25 after delivery]
  Action: Send template
  Message: "Hi {{name}}, your {{product}} might be running low.
            Reorder now and get 10% off: {{reorder_link}}
            Code: REORDER10"

Step 2 [Wait 5 days]
  Condition: Did they reorder?
    YES -> Stop
    NO  -> Send: "Last day for 10% off on your {{product}} refill: {{link}}"

Step 3 [Wait 30 more days, no reorder]
  Send: "We miss you! Here's 20% off to come back: COMEBACK20"
  Stop after this.
```

#### Workflow 3: Health Tip Series (Engagement)
**Type:** Time-based
**Trigger:** Contact tagged "subscriber" for 3+ days

```
Send one health tip per week (rotate through these):

Week 1: "Morning ritual: Mix 1 tsp Moringa + 1 tsp Amla in warm water. Drink on empty stomach. Boosts immunity all day."
Week 2: "Sleep hack: 1 tsp Ashwagandha in warm milk before bed. Works in 3-5 days."
Week 3: "Hair tip: Mix Amla powder + coconut oil. Apply for 30 min. Wash. Do weekly for thicker hair."
Week 4: "Detox water: Beetroot powder + lemon + honey. Drink daily for glowing skin."

Each tip ends with: "Shop Annvaya: {{link}} | Reply STOP to unsubscribe"
```

#### Workflow 4: Support Auto-routing
**Type:** Reply-based
**Trigger:** Message contains "help" / "issue" / "problem" / "complaint" / "damaged" / "wrong"

```
Step 1 [Instant]
  Action: Send template "annvaya_support"
  Message: "We're sorry you're facing an issue. Our team will respond within 1 hour.
            If urgent, call: +91 8918349445"
  Action: Tag "support-ticket"
  Action: Assign to support agent

Step 2 [If no agent reply in 30 min]
  Action: Escalate to Shivay
  Action: Send internal notification
```

#### Workflow 5: Bulk/Wholesale Inquiry
**Type:** Reply-based
**Trigger:** Message contains "bulk" / "wholesale" / "B2B" / "reseller" / "distributor"

```
Step 1 [Instant]
  Action: Send message
  Message: "Thanks for your interest in bulk orders!
            
            Minimum order: 50 units per product
            Discount: 30-40% off MRP
            Custom labeling available
            
            Our team will send you the bulk price list.
            
            In the meantime, what products are you interested in?"
  Action: Tag "bulk-inquiry"
  Action: Assign to Shivay
```

---

## Phase 5: Integrations (Day 10-14)

### Website -> AiSensy Webhook

#### FormiqStudio (Next.js API route)
```javascript
// app/api/whatsapp/route.ts
export async function POST(req) {
  const { name, phone, plan } = await req.json();

  await fetch('https://backend.aisensy.com/campaign/t1/api/v2', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      apiKey: process.env.AISENSY_API_KEY,
      campaignName: 'formiq_welcome',
      destination: phone.replace(/\D/g, ''),
      userName: 'FormiqStudio',
      templateParams: [name, plan],
    }),
  });

  return Response.json({ success: true });
}
```

#### Furniture (Express backend)
```javascript
// backend/src/utils/whatsapp.ts
export const sendWhatsApp = async (
  phone: string,
  templateName: string,
  params: string[]
) => {
  const res = await fetch('https://backend.aisensy.com/campaign/t1/api/v2', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      apiKey: process.env.AISENSY_API_KEY,
      campaignName: templateName,
      destination: phone.replace(/\D/g, ''),
      userName: 'LuxeHome',
      templateParams: params,
    }),
  });
  return res.json();
};

// Usage in order controller:
// After order creation:
await sendWhatsApp(
  order.phone,
  'furniture_order_confirmed',
  [order.customerName, order.orderId, order.items, order.total, order.paymentMethod, order.deliveryDays]
);
```

### AiSensy -> Your Backend Webhook

For order tracking bot, AiSensy sends user's message to your backend:

```javascript
// backend/src/routes/whatsapp.routes.ts
router.post('/webhook/whatsapp', async (req, res) => {
  const { message, sender } = req.body;

  if (message.match(/^ORD-\d+$/)) {
    const order = await Order.findOne({ orderId: message });
    if (order) {
      await sendWhatsApp(sender, 'furniture_shipped', [
        order.customerName,
        order.orderId,
        order.courier,
        order.trackingId,
        order.estimatedDelivery,
        order.trackingUrl,
      ]);
    }
  }

  res.json({ success: true });
});
```

---

## Phase 6: Opt-in Collection (Ongoing)

You need explicit opt-in before sending marketing messages.

### Methods

| Method | Where | How |
|--------|-------|-----|
| Website widget | All 3 sites | "Get updates on WhatsApp" checkbox on forms |
| Click-to-WhatsApp ads | Facebook/Instagram | Ad CTA opens WhatsApp, first message = opt-in |
| QR code | Physical store, business cards, packaging | Scan to start WhatsApp chat |
| Order checkout | Furniture site | "Send order updates on WhatsApp" checkbox |
| Post-purchase | Furniture confirmation page | "Want delivery updates on WhatsApp?" |

### Opt-in message (auto-reply when they scan QR or click widget)
```
Hi! You'll now receive updates from [Business Name] on WhatsApp.

You can unsubscribe anytime by replying STOP.

How can we help you today?
```

---

## Cost Summary

### Monthly Recurring

| Item | Cost |
|------|------|
| AiSensy FormiqStudio (Basic) | Rs 1,500 |
| AiSensy Furniture (Basic) | Rs 1,500 |
| AiSensy Annvaya (Free) | Rs 0 |
| Chatbot Flow Builder add-on (if needed) | Rs 2,500 |
| Message credits FormiqStudio (est. 200 msgs) | Rs 200-400 |
| Message credits Furniture (est. 500 msgs) | Rs 500-1,000 |
| Message credits Annvaya (est. 50 msgs) | Rs 50-100 |
| **Total** | **Rs 4,250 - 5,500/mo** |

### One-time

| Item | Cost |
|------|------|
| 3 SIM cards | Rs 600-900 |
| Setup time | 2 weeks |

### Message Credit Rates (India)

| Type | Per Message | When Used |
|------|------------|-----------|
| Marketing | Rs 1.09 | Broadcasts, promotions, re-engagement |
| Utility | Rs 0.145 | Order updates, shipping, OTP |
| Service | Free | Customer replies within 24h window |

---

## KPIs to Track

### FormiqStudio
| Metric | Target |
|--------|--------|
| Lead response time | Under 5 minutes |
| Follow-up reply rate | 30%+ |
| Lead to call conversion | 40%+ |
| Call to client conversion | 20%+ |

### Furniture
| Metric | Target |
|--------|--------|
| Cart recovery rate | 15-25% |
| COD confirmation rate | 85%+ |
| Post-delivery review rate | 10%+ |
| Repeat purchase rate | 20%+ within 90 days |

### Annvaya
| Metric | Target |
|--------|--------|
| First response time | Under 30 minutes |
| Support resolution rate | 90%+ |
| Customer satisfaction | 4.5/5+ |

---

## Action Checklist

### Week 1
- [ ] Buy 3 SIM cards
- [ ] Create Meta Business Account at business.facebook.com
- [ ] Submit business verification documents
- [ ] Sign up on AiSensy for all 3 businesses
- [ ] Connect phone numbers to AiSensy
- [ ] Submit all message templates for Meta approval

### Week 2
- [ ] Build chatbot flows in AiSensy Flow Builder
- [ ] Set up automation sequences (lead nurture, order lifecycle, cart recovery)
- [ ] Add AISENSY_API_KEY to Infisical for each business
- [ ] Integrate FormiqStudio contact form with AiSensy webhook
- [ ] Integrate Furniture backend with AiSensy (order confirmation)
- [ ] Add WhatsApp opt-in checkbox to all website forms
- [ ] Test all flows end-to-end
- [ ] Update WhatsApp numbers on all websites

### Week 3
- [ ] Print QR codes for physical locations
- [ ] Set up Click-to-WhatsApp ads on Facebook
- [ ] Monitor message delivery rates
- [ ] Fine-tune bot responses based on real conversations
- [ ] Apply for Blue Tick verification (all 3 businesses)

### Ongoing
- [ ] Weekly: Review conversation analytics in AiSensy dashboard
- [ ] Monthly: Audit message costs, optimize template usage
- [ ] Monthly: A/B test message copy for better response rates
- [ ] Quarterly: Review and update chatbot flows

---

## Resources

- AiSensy Dashboard: https://app.aisensy.com
- AiSensy Flow Builder: https://aisensy.com/features/chatbot-flow-builder
- Meta Business Manager: https://business.facebook.com
- WhatsApp Template Guidelines: https://developers.facebook.com/docs/whatsapp/message-templates
- AiSensy API Docs: https://documenter.getpostman.com/view/15880774/UVsEVpHH
