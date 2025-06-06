#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Flask server for MCP hook endpoint
Provides health check and structured JSON payload logging
"""

import logging
import json
from datetime import datetime
from flask import Flask, request, jsonify

# Configure logging with timestamp format
logging.basicConfig(
    level=logging.INFO,
    format='[%(levelname)s] %(asctime)s %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)

logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)


@app.route('/', methods=['GET'])
def health_check():
    """
    Health check endpoint
    Returns current status and ISO-8601 timestamp
    """
    return jsonify({
        "status": "ok",
        "timestamp": datetime.now().isoformat()
    })


@app.route('/mcp-hook', methods=['POST'])
def mcp_hook():
    """
    MCP hook endpoint for structured JSON payloads
    Expected format: {"source": "...", "content": "..."}
    Logs source and first 200 chars of content
    """
    try:
        # Check if request contains JSON
        if not request.is_json:
            logger.warning("Received non-JSON request")
            return jsonify({"error": "Content-Type must be application/json"}), 400
        
        # Parse JSON payload
        data = request.get_json()
        
        # Validate required keys
        if not data or 'source' not in data or 'content' not in data:
            logger.warning("Missing required keys: source, content")
            return jsonify({"error": "Missing required keys: source, content"}), 400
        
        # Extract and validate data
        source = data.get('source', '').strip()
        content = data.get('content', '')
        
        if not source:
            logger.warning("Empty source field")
            return jsonify({"error": "Source cannot be empty"}), 400
        
        # Log the received data
        content_preview = content[:200] if content else "[empty]"
        logger.info(f"Source: {source}")
        logger.info(f"Content preview: {content_preview}")
        
        # Return success response
        return jsonify({"status": "ok"}), 200
        
    except json.JSONDecodeError:
        logger.error("Invalid JSON format")
        return jsonify({"error": "Invalid JSON format"}), 400
    
    except Exception as e:
        logger.error(f"Internal server error: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500


@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors"""
    return jsonify({"error": "Endpoint not found"}), 404


@app.errorhandler(405)
def method_not_allowed(error):
    """Handle method not allowed errors"""
    return jsonify({"error": "Method not allowed"}), 405


if __name__ == '__main__':
    logger.info("Starting Flask server on localhost:5000")
    # Development server - not for production use
    app.run(
        host='localhost',
        port=5000,
        debug=True,  # Enable debug mode for development
        use_reloader=True  # Auto-reload on code changes
    )
