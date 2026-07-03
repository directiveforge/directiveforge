// Minimal transactional-email helper for weekly practice recaps.
// Wire this up to Resend once you have an API key in .env.local.

const RESEND_ENDPOINT = "https://api.resend.com/emails";

export async function sendPracticeRecap(to: string, summary: string): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    // No key configured — skip silently in local/hobby setups.
    return false;
  }

  const response = await fetch(RESEND_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Tempo Deck <recap@tempodeck.app>",
      to,
      subject: "Your weekly tempo recap",
      text: summary,
    }),
  });

  return response.ok;
}
