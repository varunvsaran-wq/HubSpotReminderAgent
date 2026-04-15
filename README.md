# IFG Follow-Up Reminder Agent

> **Grow. Partner. Exit. On Your Terms.**
> A daily digest tool for Iconic Founders Group that surfaces pipeline contacts needing follow-up, enriched with Claude AI next-action suggestions.

---

## Stack

| Layer    | Technology                                 |
|----------|--------------------------------------------|
| Frontend | React 18 + Vite (no UI library — pure CSS) |
| Backend  | Node.js + Express                          |
| AI       | Anthropic Claude (`claude-sonnet-4-6`)     |
| Email    | Nodemailer (SMTP — works with Gmail, Outlook, SendGrid) |
| Data     | Mock CSV dataset (28 contacts with edge cases) |

---

## Quick Start

### 1. Install dependencies

```bash
# From the project root
npm install          # installs concurrently
npm run install:all  # installs backend + frontend dependencies
```

### 2. Configure environment

```bash
cp backend/.env.example backend/.env
```

Open `backend/.env` and fill in:

```env
# Required for AI suggestions
ANTHROPIC_API_KEY=sk-ant-...

# Required for email delivery
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your@gmail.com
SMTP_PASS=your_gmail_app_password   # Gmail → Settings → Security → App Passwords
EMAIL_FROM=your@gmail.com
EMAIL_FROM_NAME=Iconic Founders Group
```

> **Gmail tip:** Use an [App Password](https://myaccount.google.com/apppasswords), not your regular password. 2FA must be enabled.

### 3. Run

```bash
npm run dev
```

This starts both servers concurrently:
- **Backend API** → `http://localhost:3001`
- **Frontend UI** → `http://localhost:5173`

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Usage

1. **Select a threshold** — choose 7, 14, or 30 days
2. **Click "Generate AI Digest"** — the backend filters stale contacts and calls Claude to generate a personalized next action + draft message for each
3. **Browse the digest** — filter by contact type (Seller / Buyer / Referral Partner), sort by staleness or deal stage
4. **Expand draft messages** — each card has a collapsible "Draft Message" section with a copy button
5. **Send email digest** — click "Send Email Digest", enter a recipient, and the branded HTML email is delivered

---

## Mock Dataset — Edge Cases

The CSV (`backend/data/contacts.csv`) includes 28 contacts covering:

| Edge Case | Contact | Days Since Activity |
|-----------|---------|---------------------|
| Today (boundary — never stale) | Rachel Stone | 0 |
| 1 day ago | Marcus Chen | 1 |
| 3 days ago | Patricia Owens | 3 |
| 6 days ago | Robert Harmon | 6 |
| **7 days exactly** (boundary) | Diana Flores | **7** |
| 8 days | Kevin Lao | 8 |
| 12 days | Amanda Pierce | 12 |
| 13 days | Sandra Torres | 13 |
| **14 days exactly** (boundary) | Michael Stern | **14** |
| 15 days | Lauren Beck | 15 |
| 20 days | Gregory Walsh | 20 |
| 21 days | Monica Vasquez | 21 |
| 26 days | James Holton | 26 |
| 29 days | Priya Nair | 29 |
| **30 days exactly** (boundary) | Frank Deluca | **30** |
| 36 days | Lisa Huang | 36 |
| 41 days | Nina Patel | 41 |
| 45 days | Alicia Brennan | 45 |
| 54 days | Steven Cho | 54 |
| 60 days | Daniel Park | 60 |
| 73 days | Brian Foster | 73 |
| 75 days | David Russo | 75 |
| 90 days | Heather Quinn | 90 |
| 120 days | Andre Williams | 120 |
| 180 days | Tina Marsh | 180 |
| **Never contacted** | Carlos Mendez | null |
| **Never contacted** | Gary Thompson | null |

All 5 deal stages, all 3 contact types, and all 6 industries are represented.

---

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`  | `/api/health` | Config status check |
| `GET`  | `/api/contacts` | All 28 contacts |
| `GET`  | `/api/contacts/stale?threshold=14` | Contacts not touched in ≥ N days |
| `POST` | `/api/digest/generate` | Generate AI digest `{ threshold: 14 }` |
| `POST` | `/api/digest/email` | Send email `{ to, threshold, contacts }` |

---

## What I'd Build Next (with full HubSpot access)

1. **Live HubSpot sync** — replace the CSV with real-time data via the HubSpot Contacts and Engagements APIs, so the digest always reflects actual CRM state including emails, calls, and meetings logged.
2. **Owner-scoped digests** — route each advisor's contacts to their own inbox automatically on a cron schedule (e.g., every weekday at 7am), so each team member only sees their own pipeline.
3. **Feedback loop** — a "Mark as contacted" button in the email that fires a webhook back to HubSpot to log a note, closing the loop without requiring anyone to touch the CRM manually.
4. **Smart prioritization** — weight urgency by deal stage (Actionable contacts with 7+ days of silence rank above Monitoring contacts with 30+ days) so the digest leads with what matters most.
