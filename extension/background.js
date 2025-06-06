// PortalLM Background Service Worker
// Handles communication between extension components and local MCP server

console.log('PortalLM background script loaded');

// Configuration for local MCP server
const MCP_SERVER_URL = 'http://localhost:5000';

// Handle extension installation
chrome.runtime.onInstalled.addListener((details) => {
  console.log('PortalLM extension installed:', details.reason);
  
  // Set default configuration
  chrome.storage.local.set({
    mcpServerUrl: MCP_SERVER_URL,
    enabled: true,
    lastSync: Date.now()
  });
});

// Handle messages from content scripts and popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Background received message:', request);
  
  switch (request.action) {
    case 'sendToMCP':
      // Forward request to local MCP server
      sendToMCPServer(request.data)
        .then(response => sendResponse({ success: true, data: response }))
        .catch(error => sendResponse({ success: false, error: error.message }));
      return true; // Keep message channel open
      
    case 'getStatus':
      // Check MCP server connectivity
      checkMCPServerStatus()
        .then(status => sendResponse({ status }))
        .catch(() => sendResponse({ status: 'offline' }));
      return true;
      
    default:
      sendResponse({ error: 'Unknown action' });
  }
});

// Function to communicate with local MCP server
async function sendToMCPServer(data) {
  try {
    const response = await fetch(`${MCP_SERVER_URL}/mcp-hook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to communicate with MCP server:', error);
    throw error;
  }
}

// Function to check MCP server status
async function checkMCPServerStatus() {
  try {
    const response = await fetch(`${MCP_SERVER_URL}/health`, {
      method: 'GET',
      timeout: 3000
    });
    return response.ok ? 'online' : 'error';
  } catch (error) {
    return 'offline';
  }
}
