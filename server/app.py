#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Minimal Flask app for MCP webhook endpoint
Listens on localhost:5000/mcp-hook for POST requests
"""

from flask import Flask, request, jsonify
import json

# Initialize Flask application
app = Flask(__name__)

@app.route('/mcp-hook', methods=['POST'])
def mcp_hook():
    """
    Handle POST requests to /mcp-hook endpoint
    Logs received JSON data and returns confirmation
    """
    try:
        # Get JSON data from request
        json_data = request.get_json()
        
        # Log the received JSON to console
        print("Received JSON data:")
        print(json.dumps(json_data, indent=2, ensure_ascii=False))
        
        # Return success response
        return jsonify({"status": "received"})
        
    except Exception as e:
        # Log any errors
        print(f"Error processing request: {str(e)}")
        return jsonify({"status": "error", "message": str(e)}), 400

@app.route('/', methods=['GET'])
def health_check():
    """
    Basic health check endpoint
    """
    return jsonify({"status": "running", "message": "MCP Hook Server is active"})

if __name__ == '__main__':
    # Run the Flask development server
    print("Starting MCP Hook Server on http://localhost:5000")
    print("Webhook endpoint: http://localhost:5000/mcp-hook")
    app.run(host='localhost', port=5000, debug=True)
