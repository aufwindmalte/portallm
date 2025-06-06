# Test Suite Structure

## Directory Layout
```
tests/
├── server/           # Flask server tests
│   └── test_app.py   # Endpoint validation
├── extension/        # Chrome extension tests
│   └── test_content_script.js
└── integration/      # End-to-end tests
    └── test_workflow.py
```

## Testing Principles
1. All tests must be in new files (existing test files are locked)
2. Follow AAA pattern: Arrange-Act-Assert
3. Include negative test cases for error handling

Example test case:
```python
def test_mcp_hook_endpoint(client):
    # Arrange: Create sample payload
    payload = {"source": "ChatGPT", "content": "test"}
    
    # Act: Send POST request
    response = client.post('/mcp-hook', json=payload)
    
    # Assert: Validate response
    assert response.status_code == 200
    assert b"received" in response.data