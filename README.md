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
wrangler kv namespace create "EMAILS"
```

> **Note:** The command syntax changed in Wrangler v4. Use `kv namespace` (with a space) instead of `kv:namespace`.

Example output:

```text
⛅️ wrangler 4.53.0
───────────────────
Resource location: remote

🌀 Creating namespace with title "EMAILS"
✨ Success!
To access your new KV Namespace in your Worker, add the following snippet to your configuration file:
[[kv_namespaces]]
binding = "EMAILS"
id = "69a23d3a9ff840ad9f00723d035707d6"
```

### 4. Update wrangler.toml

Edit `worker/wrangler.toml` and replace `YOUR_KV_NAMESPACE_ID` with the id from step 3.

### 5. Deploy the Worker

```bash
cd worker
wrangler deploy
```

If this is your first deployment, Wrangler will prompt you to create a workers.dev subdomain.

Example output:

```text
⛅️ wrangler 4.53.0
───────────────────
Total Upload: 1.18 KiB / gzip: 0.57 KiB
Your Worker has access to the following bindings:
Binding                                            Resource
env.EMAILS (69a23d3a9ff840ad9f00723d035707d6)      KV Namespace

Uploaded email-worker (2.83 sec)
Deployed email-worker triggers (39.64 sec)
  https://email-worker.poos-ai.workers.dev
Current Version ID: b7c760fc-6171-48b4-8850-3f5df1c19b20
```

Note the URL it outputs (e.g., `https://email-worker.your-subdomain.workers.dev`)

### 6. Update index.html

Edit `index.html` and replace the `WORKER_URL` with your worker URL from step 5.

### 7. Deploy Static Site

From the project root:

```bash
wrangler pages deploy . --project-name=email-signup-site
```

If this is your first deployment, Wrangler will prompt you to create the project and specify a production branch.

Example output:

```text
⛅️ wrangler 4.53.0
───────────────────
✔ The project you specified does not exist: "email-signup-site". Would you like to create it? › Create a new project
✔ Enter the production branch name: … main
✨ Successfully created the 'email-signup-site' project.
✨ Success! Uploaded 5 files (1.63 sec)

🌎 Deploying...
✨ Deployment complete! Take a peek over at https://0f4f5528.email-signup-site.pages.dev
```

Or upload `index.html` manually via Cloudflare Dashboard > Pages > Create Project > Direct Upload.

## Testing

1. Visit your Pages URL
2. Enter an email and click "Notify Me"
3. Check KV storage in Cloudflare Dashboard > Workers & Pages > KV > your namespace

## View Stored Emails

```bash
wrangler kv key list --namespace-id=YOUR_KV_NAMESPACE_ID
```

> **Note:** Use `kv key` (with a space) instead of `kv:key` in Wrangler v4.
