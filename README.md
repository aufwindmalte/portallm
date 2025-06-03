# PortaLLM – Local AI-to-System Bridge

**PortaLLM** is an open-source bridge between browser-based AI chat tools (like ChatGPT, Claude, or Gemini) and your local machine. It enables intelligent conversations to trigger real-world actions — like file operations, document creation, app automation, or scripting — without API tokens, cloud lock-in, or vendor control.

> Talk to your AI. Let your system respond.

---

## Why PortaLLM?

Language models are powerful reasoning tools — but in the browser, they are disconnected from your actual system. PortaLLM closes this gap.

With a simple browser extension and a local server, you can:

* Use GPT to generate files or rename folders
* Trigger automation (e.g., create a Word doc, sort PDFs)
* Let LLMs guide command-line tasks
* Access your local filesystem securely and privately
* Keep everything offline, open, and under your control

---

## How It Works

```
Browser LLM (ChatGPT, Claude)
    |
[ Extension ]
    |
Detected AI responses (text)
    |
Local MCP API (Flask server on localhost)
    |
Local actions (file ops, Office, scripts)
```

---

## Project Structure

```
portallm/
├── extension/        # Chrome/Brave extension (Manifest V3, content + background scripts)
├── server/           # Flask-based local MCP endpoint
├── docs/             # Project documentation
├── examples/         # Sample JSON payloads and GPT prompts
├── tests/            # Optional test scripts
└── LICENSE           # GPL v3 license
```

---

## Features

* Local-first: All logic runs on your machine
* Dynamic GPT-to-system connection: From conversation to automation
* No tokens. No vendor billing. No surveillance
* Modular design: Easily add more system capabilities
* Works with any browser-based LLM

---

## Setup Guide

### 1. Start the local server (Flask)

```
cd server
pip install flask
python app.py
```

This will start a local endpoint at:
`http://localhost:5000/mcp-hook`

---

### 2. Load the browser extension

1. Open `chrome://extensions` (Chrome or Brave)
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `extension/` folder

The extension will detect new LLM responses and send them to your local server.

---

### 3. Example Use Case

ChatGPT outputs:

```
Please rename the following files alphabetically:
- delta.txt
- alpha.txt
- beta.txt
```

→ PortaLLM extension captures it
→ Sends it to `localhost:5000/mcp-hook`
→ Your MCP server executes the logic on your machine

---

## Philosophy

This project is for developers, tinkerers, system nerds, and AI explorers who want real agency over their tools.

PortaLLM is released under the GNU GPL v3 to ensure:

* Transparency
* Open contributions
* Resistance to proprietary capture

We believe automation should be yours — not rented.

---

## Contributing

We welcome developers, testers, writers, and rebels.

To get involved:

* Fork the repo
* Check out CONTRIBUTING.md
* Open issues or submit pull requests
* Share new automation modules or use cases!

---

## Inspiration & Credits

* Inspired by the limitations of token-billed APIs
* Motivated by the power of Claude, ChatGPT, and open LLMs
* Influenced by the ethos of the CCC, FSF, and hacker communities

---

## License

This project is licensed under the GNU General Public License v3.0
See LICENSE for details.
