export async function fetchJson(url, options) {
  const res = await fetch(url, options);
  const text = await res.text();

  let data;
  if (!text) {
    data = {};
  } else {
    try {
      data = JSON.parse(text);
    } catch {
      data = {
        success: false,
        message: text.slice(0, 500) || 'Invalid JSON response',
      };
    }
  }

  return { ok: res.ok, status: res.status, data };
}

