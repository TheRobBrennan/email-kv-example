# Email Signup with Cloudflare KV

## Project Structure

```text
email-kv-example/
├── index.html          # Static site (frontend)
├── worker/
│   ├── index.js        # Cloudflare Worker (backend)
│   └── wrangler.toml   # Worker config
```

## Setup Steps

### 1. Install Wrangler CLI

```bash
npm install -g wrangler
```

### 2. Login to Cloudflare

```bash
wrangler login
```

### 3. Create KV Namespace

```bash
cd worker
wrangler kv:namespace create "EMAILS"
```

This outputs something like:

```text
{ binding = "EMAILS", id = "abc123..." }
```

### 4. Update wrangler.toml

Edit `worker/wrangler.toml` and replace `YOUR_KV_NAMESPACE_ID` with the id from step 3.

### 5. Deploy the Worker

```bash
cd worker
wrangler deploy
```

Note the URL it outputs (e.g., `https://email-worker.your-subdomain.workers.dev`)

### 6. Update index.html

Edit `index.html` and replace the `WORKER_URL` with your worker URL from step 5.

### 7. Deploy Static Site

From the project root:

```bash
cd ..
wrangler pages deploy . --project-name=email-signup-site
```

Or upload `index.html` manually via Cloudflare Dashboard > Pages > Create Project > Direct Upload.

## Testing

1. Visit your Pages URL
2. Enter an email and click "Notify Me"
3. Check KV storage in Cloudflare Dashboard > Workers & Pages > KV > your namespace

## View Stored Emails

```bash
wrangler kv:key list --namespace-id=YOUR_KV_NAMESPACE_ID
```
