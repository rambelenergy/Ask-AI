#!/usr/bin/env node
// Quick test script for OpenRouter API
const fs = require('fs');
const envContent = fs.readFileSync('.env.local', 'utf8');
const envVars = {};
for (const line of envContent.split('\n')) {
  const match = line.match(/^([A-Z_]+)=(.*)$/);
  if (match) envVars[match[1]] = match[2];
}

const API_KEY = envVars.OPENROUTER_API_KEY;
const MODEL = envVars.OPENROUTER_MODEL || 'openrouter/owl-alpha';

console.log('Testing OpenRouter API...');
console.log('API Key present:', API_KEY ? 'Yes (starts with ' + API_KEY.slice(0, 12) + '...)' : 'No');
console.log('Model:', MODEL);

if (!API_KEY) {
  console.error('ERROR: OPENROUTER_API_KEY not found in .env.local');
  process.exit(1);
}

async function testAsk() {
  try {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'RamBelEnergy Test'
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: 'You are an energy analyst. Answer based on provided context only.' },
          { role: 'user', content: 'Context: Algeria is a major natural gas supplier to Europe.\n\nQuestion: What is Algeria\'s role in European energy security?' }
        ],
        max_tokens: 150,
        temperature: 0.3
      })
    });

    const data = await res.json();
    
    if (!res.ok) {
      console.error('API Error:', res.status, data);
      process.exit(1);
    }

    console.log('\n✅ OpenRouter API test successful!');
    console.log('Response:', data.choices?.[0]?.message?.content?.slice(0, 200) + '...');
    console.log('Model used:', data.model);
    console.log('Tokens used:', data.usage?.total_tokens);
    
  } catch (err) {
    console.error('Fetch error:', err.message);
    process.exit(1);
  }
}

testAsk();
