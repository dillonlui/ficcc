import { createReadStream } from 'node:fs';
import { access, stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, isAbsolute, join, normalize, resolve, sep } from 'node:path';
import { Readable } from 'node:stream';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const clientRoot = join(root, 'dist', 'client');
const entryPath = join(
  root,
  '.vercel',
  'output',
  'functions',
  '_render.func',
  'dist',
  'server',
  'entry.mjs',
);

const portFlag = process.argv.indexOf('--port');
const port = Number(portFlag >= 0 ? process.argv[portFlag + 1] : process.env.PORT || 4321);

await access(entryPath).catch(() => {
  throw new Error('Vercel server output is missing. Run `npm run build` before previewing.');
});

const { default: entrypoint } = await import(pathToFileURL(entryPath).href);
const render = typeof entrypoint === 'function'
  ? entrypoint
  : entrypoint?.fetch?.bind(entrypoint);

if (!render) throw new Error('The generated Vercel entrypoint does not expose a request handler.');

const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.mp4': 'video/mp4',
  '.pdf': 'application/pdf',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.webm': 'video/webm',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml; charset=utf-8',
};

function resolveStaticCandidates(pathname) {
  let decoded;
  try {
    decoded = decodeURIComponent(pathname);
  } catch {
    return [];
  }

  if (decoded.includes('\0')) return [];

  const relativePath = normalize(decoded).replace(/^[/\\]+/, '');
  if (isAbsolute(relativePath) || relativePath.split(sep).includes('..')) return [];

  const candidate = resolve(clientRoot, relativePath);
  if (candidate !== clientRoot && !candidate.startsWith(`${clientRoot}${sep}`)) return [];

  return pathname.endsWith('/')
    ? [join(candidate, 'index.html')]
    : [candidate, join(candidate, 'index.html')];
}

async function findStaticFile(pathname) {
  for (const candidate of resolveStaticCandidates(pathname)) {
    try {
      const details = await stat(candidate);
      if (details.isFile()) return { path: candidate, size: details.size };
    } catch {
      // Continue to the next candidate before handing the request to Astro SSR.
    }
  }
  return null;
}

function toWebRequest(request) {
  const url = new URL(request.url || '/', `http://${request.headers.host || 'localhost'}`);
  const init = {
    method: request.method,
    headers: request.headers,
  };

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    init.body = Readable.toWeb(request);
    init.duplex = 'half';
  }

  return new Request(url, init);
}

function sendWebResponse(webResponse, response) {
  response.statusCode = webResponse.status;
  response.statusMessage = webResponse.statusText;

  for (const [name, value] of webResponse.headers) {
    if (name !== 'set-cookie') response.setHeader(name, value);
  }
  const setCookies = webResponse.headers.getSetCookie?.() || [];
  if (setCookies.length) response.setHeader('Set-Cookie', setCookies);

  if (!webResponse.body) return response.end();
  return Readable.fromWeb(webResponse.body).pipe(response);
}

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url || '/', `http://${request.headers.host || 'localhost'}`);
    const staticFile = await findStaticFile(url.pathname);

    if (staticFile) {
      response.statusCode = 200;
      response.setHeader('Content-Type', contentTypes[extname(staticFile.path)] || 'application/octet-stream');
      response.setHeader('Content-Length', staticFile.size);
      if (url.pathname.startsWith('/_astro/')) {
        response.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      }
      if (request.method === 'HEAD') return response.end();
      return createReadStream(staticFile.path).pipe(response);
    }

    if (typeof entrypoint === 'function') return render(request, response);
    const webResponse = await render(toWebRequest(request));
    return sendWebResponse(webResponse, response);
  } catch (error) {
    console.error(error);
    if (!response.headersSent) response.statusCode = 500;
    response.end('Internal Server Error');
  }
});

server.listen(port, '127.0.0.1', () => {
  console.log(`SSR preview listening on http://127.0.0.1:${port}`);
});

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => server.close(() => process.exit(0)));
}
