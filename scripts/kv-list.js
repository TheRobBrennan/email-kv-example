#!/usr/bin/env node

const { execSync } = require('child_process');

const NAMESPACE_ID = '69a23d3a9ff840ad9f00723d035707d6';

// Get list of keys
const keysJson = execSync(
  `wrangler kv key list --namespace-id=${NAMESPACE_ID} --remote`,
  { encoding: 'utf-8' }
);
const keys = JSON.parse(keysJson);

if (keys.length === 0) {
  console.log('No subscribers found.');
  process.exit(0);
}

// Fetch values for each key
const entries = keys.map(({ name }) => {
  const value = execSync(
    `wrangler kv key get --namespace-id=${NAMESPACE_ID} --remote "${name}"`,
    { encoding: 'utf-8' }
  ).trim();
  return { key: name, value };
});

// Print table
console.log('\n' + '='.repeat(100));
console.log('Key'.padEnd(30) + 'Value');
console.log('='.repeat(100));

entries.forEach(({ key, value }) => {
  console.log(key.padEnd(30) + value);
});

console.log('='.repeat(100));
console.log(`Total: ${entries.length} subscriber(s)\n`);
