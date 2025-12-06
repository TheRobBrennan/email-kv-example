export default {
  async fetch(request, env) {
    // Handle CORS
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    if (request.method !== 'POST') {
      return json({ error: 'POST only' }, 405);
    }

    try {
      const body = await request.json();
      const { email, firstName, lastName } = body;
      
      if (!email) {
        return json({ error: 'Email required' }, 400);
      }

      // Get existing entry if any
      const existing = await env.EMAILS.get(email);
      let value;
      
      if (existing) {
        // Merge: preserve original timestamp, update other fields
        const parsed = JSON.parse(existing);
        value = {
          ...parsed,
          ...(firstName && { firstName }),
          ...(lastName && { lastName }),
          updatedAt: new Date().toISOString(),
        };
      } else {
        // New entry
        value = {
          timestamp: new Date().toISOString(),
          ...(firstName && { firstName }),
          ...(lastName && { lastName }),
        };
      }
      
      await env.EMAILS.put(email, JSON.stringify(value));

      return json({ message: 'Subscribed!' });
    } catch (err) {
      return json({ error: err.message }, 500);
    }
  },
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
