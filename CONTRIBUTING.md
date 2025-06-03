# Contributing to PortaLLM

Thank you for your interest in contributing to PortaLLM. This project aims to empower users to connect browser-based LLMs to their local systems using an open, modular architecture. Whether you're a developer, tester, designer, or curious user, your contributions are welcome.

---

## What You Can Contribute

* Code contributions: MCP tool modules, browser extension improvements, Flask backends, parsing logic, etc.
* Tool plugins: Add new locally executable tools following the MCP schema
* Bug reports: Clear, reproducible reports are extremely valuable
* Documentation: Improve or add to README, architecture diagrams, or user guides
* Testing: Unit tests, integration tests, or just trying things out and reporting edge cases
* UX/UI ideas: Web UI mockups, human-friendly feedback loops, better defaults

---

## Project Setup

You’ll need:

* Python 3.10+ with pip
* Chrome or Brave (to load the extension)
* Optional: Node.js (for MCP tools or dev scripts)

```bash
# Clone the repo
git clone https://github.com/yourname/portallm.git
cd portallm

# Start the server
cd server
pip install -r requirements.txt
python app.py
```

To load the extension:

* Open chrome://extensions
* Enable Developer Mode
* Click “Load unpacked” and select the extension/ folder

---

## Branching Model

* main — Stable, production-ready branch
* dev — Active development happens here
* Feature branches: feature/your-topic
* Bugfix branches: fix/your-bug

Please submit pull requests against dev.

---

## Code Style & Guidelines

* Follow existing code patterns where possible
* Python: Use Black (black .) and type annotations where helpful
* JavaScript: Keep functions modular and well-commented
* Don’t break the browser extension unless you're fixing it

---

## Tool Plugin Guidelines (MCP modules)

MCP tools should:

* Accept JSON requests via function or CLI
* Return structured JSON
* Be self-contained and executable
* Be registered in a future settings.json or tools.json

We will maintain a template in examples/.

---

## License

All contributions are made under the terms of the GNU GPL v3.
By submitting a PR, you agree to license your code under this license.

---

## Thank You

Your support makes PortaLLM better, safer, and more empowering. Let's build the local-first AI we actually want to use.
