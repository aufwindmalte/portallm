// Content script for monitoring ChatGPT/Claude markdown responses
// Sends latest response content to local MCP server

(function() {
    'use strict';
    
    // Configuration
    const CONFIG = {
        targetClass: 'markdown',
        checkInterval: 5000, // 5 seconds
        serverUrl: 'http://localhost:5000/mcp-hook',
        source: 'ChatGPT' // Could be dynamically detected
    };
    
    let lastSentContent = '';
    
    /**
     * Finds all elements with the target class on the page
     * @returns {NodeList} List of markdown elements
     */
    function findMarkdownElements() {
        return document.querySelectorAll(`.${CONFIG.targetClass}`);
    }
    
    /**
     * Gets the inner text from the last markdown element
     * @returns {string|null} Text content or null if no elements found
     */
    function getLatestMarkdownContent() {
        const elements = findMarkdownElements();
        
        if (elements.length === 0) {
            console.log('[PortalLM] No markdown elements found on page');
            return null;
        }
        
        // Get the last element (most recent response)
        const lastElement = elements[elements.length - 1];
        const content = lastElement.innerText.trim();
        
        console.log(`[PortalLM] Found ${elements.length} markdown elements, extracting from last one`);
        return content;
    }
    
    /**
     * Sends content to local MCP server
     * @param {string} content - The text content to send
     */
    async function sendToMCPServer(content) {
        const payload = {
            source: CONFIG.source,
            content: content
        };
        
        try {
            const response = await fetch(CONFIG.serverUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });
            
            if (response.ok) {
                console.log('[PortalLM] Successfully sent content to MCP server');
            } else {
                console.warn('[PortalLM] MCP server responded with error:', response.status);
            }
            
        } catch (error) {
            // Fail-safe: Log error but don't break the extension
            console.warn('[PortalLM] Failed to reach MCP server:', error.message);
        }
    }
    
    /**
     * Main monitoring function - checks for new content and sends if changed
     */
    function checkForNewContent() {
        const content = getLatestMarkdownContent();
        
        // Fail-safe: Skip if no content found
        if (!content) {
            return;
        }
        
        // Only send if content has changed since last time
        if (content !== lastSentContent) {
            console.log('[PortalLM] New content detected, sending to MCP server');
            sendToMCPServer(content);
            lastSentContent = content;
        }
    }
    
    /**
     * Detects the current platform (ChatGPT vs Claude)
     * @returns {string} Platform name
     */
    function detectPlatform() {
        const hostname = window.location.hostname;
        
        if (hostname.includes('openai.com') || hostname.includes('chatgpt.com')) {
            return 'ChatGPT';
        } else if (hostname.includes('claude.ai') || hostname.includes('anthropic.com')) {
            return 'Claude';
        }
        
        return 'Unknown';
    }
    
    // Initialize
    console.log('[PortalLM] Content script loaded');
    
    // Update source based on current platform
    CONFIG.source = detectPlatform();
    console.log(`[PortalLM] Detected platform: ${CONFIG.source}`);
    
    // Start monitoring for new content every 5 seconds
    const intervalId = setInterval(checkForNewContent, CONFIG.checkInterval);
    
    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        clearInterval(intervalId);
        console.log('[PortalLM] Content script cleanup completed');
    });
    
    // Optional: Also check immediately when DOM changes (for faster detection)
    const observer = new MutationObserver((mutations) => {
        // Debounce rapid changes
        clearTimeout(observer.timeoutId);
        observer.timeoutId = setTimeout(() => {
            const hasMarkdownChanges = mutations.some(mutation => 
                Array.from(mutation.addedNodes).some(node => 
                    node.nodeType === Node.ELEMENT_NODE && 
                    (node.classList?.contains(CONFIG.targetClass) || 
                     node.querySelector?.(`.${CONFIG.targetClass}`))
                )
            );
            
            if (hasMarkdownChanges) {
                console.log('[PortalLM] DOM change detected with new markdown content');
                checkForNewContent();
            }
        }, 1000);
    });
    
    // Start observing DOM changes
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
})();