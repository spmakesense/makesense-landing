// Outgoing SMS. Production: set SMS_WEBHOOK_URL to any HTTP endpoint (an SMS provider, Make, Zapier)
// that accepts POST {to, text}. Without it, messages are only logged and the app runs in demo mode.

export const DEMO_MODE = !process.env.SMS_WEBHOOK_URL;

export async function sendSms(to: string, text: string): Promise<boolean> {
  const url = process.env.SMS_WEBHOOK_URL;
  if (!url) {
    console.log(`[sms demo] → ${to}: ${text}`);
    return true;
  }
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...(process.env.SMS_WEBHOOK_TOKEN ? { authorization: `Bearer ${process.env.SMS_WEBHOOK_TOKEN}` } : {}),
      },
      body: JSON.stringify({ to, text, sender: process.env.SMS_SENDER || "Chotmim" }),
    });
    return res.ok;
  } catch (e) {
    console.error("sms failed", e);
    return false;
  }
}
