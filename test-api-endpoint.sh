#!/bin/bash
# Test the AI Ask API endpoint

echo "=== Testing /api/ai/ask ==="
curl -s http://localhost:3000/api/ai/ask \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "question": "What is Algerias role in European energy security?",
    "context": "Algeria is a major natural gas supplier to Europe via pipelines to Italy and Spain."
  }' | python3 -m json.tool 2>/dev/null || echo "Raw response received"

echo ""
echo "=== Testing /api/ai/summarize ==="
curl -s http://localhost:3000/api/ai/summarize \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Algeria holds a unique position in the Mediterranean energy landscape. As one of Africas largest natural gas producers and a key supplier to European markets, the countrys energy policy decisions reverberate across the continent. The existing pipeline infrastructure connecting Algerian gas fields to Italy and Spain provides established routes that can be expanded.",
    "maxLength": 3
  }' | python3 -m json.tool 2>/dev/null || echo "Raw response received"
