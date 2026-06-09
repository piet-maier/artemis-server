## Setting Up

All commands should be run from the `server` or `client` directories, respectively.

### Server

1. Install [Python](https://www.python.org/).
2. Run `python -m venv .venv` to create a [virtual environment](https://docs.python.org/3/library/venv.html).
3. Activate the virtual environment by running `.venv/Scripts/Activate.ps1` (Windows & PowerShell), or install the "Python Environments" extension to activate environments automatically.
4. Run `pip install -r requirements.txt` to install required packages.

### Client

1. Install [Node.js](https://nodejs.org/en).
2. Run `npm install --global corepack@latest` to install [corepack](https://github.com/nodejs/corepack).
3. Run `corepack enable pnpm` to enable [pnpm](https://pnpm.io/).
4. Run `pnpm install` to install required packages.

## Development

During development, run `flask run` from the `server` directory and `pnpm run dev` from the `client` directory. Then, open http://localhost:5173 in your browser.
