# Email Signup with Cloudflare KV

A simple example demonstrating how to collect email signups using Cloudflare Workers and KV storage. Includes two form examples:

**Live Demo:** <https://email-signup-site.pages.dev>

1. **Simple Email Only** - Stores just the email as the key with a timestamp
2. **Email + Name** - Stores email as the key with firstName, lastName, and timestamp as JSON value

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
2. Try both forms:
   - **Example 1**: Enter just an email and click "Notify Me"
   - **Example 2**: Enter email, first name, and last name, then click "Sign Up"
3. Check KV storage in Cloudflare Dashboard > Workers & Pages > KV > your namespace

## View Stored Emails

```bash
wrangler kv key list --namespace-id=YOUR_KV_NAMESPACE_ID
```

> **Note:** Use `kv key` (with a space) instead of `kv:key` in Wrangler v4.

To view a specific entry's value:

```bash
wrangler kv key get --namespace-id=YOUR_KV_NAMESPACE_ID "user@example.com"
```

## KV Data Structure

The worker stores data with the email as the key and a JSON value:

**New signup:**

```json
{
  "timestamp": "2024-12-06T07:55:00.000Z",
  "firstName": "John",
  "lastName": "Doe"
}
```

**After re-submitting (merge behavior):**

```json
{
  "timestamp": "2024-12-06T07:55:00.000Z",
  "firstName": "Jane",
  "lastName": "Doe",
  "updatedAt": "2024-12-06T08:30:00.000Z"
}
```

The worker merges data on duplicate emails:

- Preserves the original `timestamp`
- Updates `firstName`/`lastName` if provided
- Adds `updatedAt` to track the latest submission
