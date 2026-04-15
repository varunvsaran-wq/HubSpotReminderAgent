const Anthropic = require('@anthropic-ai/sdk');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const DEAL_STAGE_CONTEXT = {
  'Business Development': 'early outreach and relationship building stage',
  Prospect: 'initial qualification and NDA / intake stage',
  Actionable: 'active deal structuring — LOI, exclusivity, or purchase agreement stage',
  Active: 'under active engagement — due diligence or deal execution',
  'Monitoring (Stay in Touch)': 'long-term nurture; not ready yet but worth maintaining',
};

const CONTACT_TYPE_CONTEXT = {
  Seller: 'a business owner considering selling their company',
  Buyer: 'a buyer or PE firm seeking acquisition targets',
  'Referral Partner': 'a trusted referral source who sends deal flow',
};

async function generateSuggestions(contacts) {
  if (!contacts.length) return [];

  const contactList = contacts
    .map(
      (c, i) =>
        `${i + 1}. ID: ${c.id}
   Name: ${c.contact_name}
   Company: ${c.company}
   Type: ${c.contact_type} — ${CONTACT_TYPE_CONTEXT[c.contact_type] || c.contact_type}
   Industry: ${c.industry}
   Deal Stage: ${c.deal_stage} (${DEAL_STAGE_CONTEXT[c.deal_stage] || c.deal_stage})
   Days Since Last Contact: ${c.days_since_activity === null ? 'Never contacted' : `${c.days_since_activity} days`}
   Last Activity Note: ${c.last_activity_note || 'No note on record'}`
    )
    .join('\n\n');

  const prompt = `You are an expert M&A advisor assistant for Iconic Founders Group, a boutique advisory firm specializing in blue-collar business acquisitions and exits (industries: HVAC, Roofing, Landscape, Remediation, Wastewater, Industrial Services).

For each contact provide:
1. next_action: one crisp sentence — a specific, actionable step
2. draft_message: 2-3 sentences max, professional and warm, written from the IFG advisor's perspective (Sellers: no pressure; Buyers: deal-focused; Referral Partners: collegial)

Contacts needing follow-up:
${contactList}

Respond ONLY with a valid JSON array (no markdown, no extra text) in this exact format:
[
  {
    "id": "1",
    "next_action": "...",
    "draft_message": "..."
  }
]`;

  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 8192,
    messages: [{ role: 'user', content: prompt }],
  });

  const raw = message.content[0].text.trim();
  // Strip markdown code fences if present
  const json = raw.replace(/^```json?\n?/, '').replace(/\n?```$/, '');
  const suggestions = JSON.parse(json);

  // Map suggestions back by id
  const byId = {};
  suggestions.forEach((s) => {
    byId[String(s.id)] = s;
  });
  return byId;
}

module.exports = { generateSuggestions };
