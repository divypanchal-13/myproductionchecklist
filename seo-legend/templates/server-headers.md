# Server and header templates

Headers affect crawling, caching, security, and rendering. Test every change on
staging and verify with `curl -I`. Do not copy a header blindly; understand what
it does and whether it breaks the site.

---

## 1. Target header set

| Header | Value | Purpose |
| --- | --- | --- |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains` | HTTPS enforcement (only after readiness) |
| `X-Content-Type-Options` | `nosniff` | Stop MIME sniffing |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Limit referrer leakage |
| `X-Frame-Options` | `SAMEORIGIN` | Clickjacking protection (legacy) |
| `Content-Security-Policy` | `frame-ancestors 'self'; ...` | Modern frame/script control |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` | Limit browser features |
| `Cache-Control` (HTML) | `no-cache` or `public, s-maxage=..., stale-while-revalidate=...` | Fresh HTML |
| `Cache-Control` (assets) | `public, max-age=31536000, immutable` | Hashed assets |
| `X-Robots-Tag` | `noindex, nofollow` (staging only) | Non-HTML/edge index control |
| `Link` | `<...>; rel=canonical` (optional) | Non-HTML canonicalisation |

Rules:

- One canonical host/protocol; redirect the others with `301`.
- Do not send conflicting `X-Robots-Tag` and meta robots directives.
- HSTS is hard to undo; confirm every subdomain supports HTTPS first.
- CSP must be tested; a broken policy can blank the page.
- Do not cache authenticated/personalised HTML publicly.
- Do not set `immutable` on non-hashed filenames.

---

## 2. Apache (.htaccess)

### Canonical host + HTTPS

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On

  # Force HTTPS
  RewriteCond %{HTTPS} !=on
  RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

  # Force one host (choose www or non-www, not both)
  RewriteCond %{HTTP_HOST} !^www\.example\.com$ [NC]
  RewriteRule ^ https://www.example.com%{REQUEST_URI} [L,R=301]

  # Optional: one trailing-slash policy
  # RewriteCond %{REQUEST_FILENAME} !-d
  # RewriteCond %{REQUEST_URI} !\.[a-zA-Z0-9]{2,5}$
  # RewriteRule ^(.*)/$ /$1 [L,R=301]
</IfModule>
```

### Reverse proxy to Node

```apache
<IfModule mod_proxy_http.c>
  ProxyPreserveHost On
  RequestHeader set X-Forwarded-Proto "https"
  RequestHeader set X-Forwarded-Host "%{HTTP_HOST}s"
  ProxyPass        / http://127.0.0.1:3000/
  ProxyPassReverse / http://127.0.0.1:3000/
</IfModule>
```

- `ProxyPreserveHost On` keeps the public host for generated URLs.
- Pass `X-Forwarded-Proto` so the app does not redirect HTTPS → HTTP.
- Keep the port in sync with `.env`/the process manager (automate it).
- Do not proxy `/robots.txt` or `/sitemap.xml` to an SPA fallback that returns
  HTML.

### Security headers

```apache
<IfModule mod_headers.c>
  Header always set X-Content-Type-Options "nosniff"
  Header always set Referrer-Policy "strict-origin-when-cross-origin"
  Header always set X-Frame-Options "SAMEORIGIN"
  Header always set Permissions-Policy "camera=(), microphone=(), geolocation=()"
  Header always set Content-Security-Policy "frame-ancestors 'self'"
  # Enable only after confirming all subdomains use HTTPS:
  # Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"
</IfModule>
```

### Caching

```apache
<IfModule mod_headers.c>
  # Hashed build assets
  <FilesMatch "\.(js|css|woff2?|png|jpe?g|webp|avif|svg|ico)$">
    Header set Cache-Control "public, max-age=31536000, immutable"
  </FilesMatch>

  # HTML should revalidate
  <FilesMatch "\.(html|xml|txt)$">
    Header set Cache-Control "public, max-age=0, must-revalidate"
  </FilesMatch>
</IfModule>
```

Adjust for your build: Next.js may already set `Cache-Control` on
`/_next/static/*`. Prefer `Header setifempty` if the app's headers should win.

### Block sensitive paths

```apache
<FilesMatch "^\.(env|git|htaccess|htpasswd)">
  Require all denied
</FilesMatch>

RedirectMatch 404 /\.git
RedirectMatch 404 /node_modules
RedirectMatch 404 /\.next
RedirectMatch 404 /(package-lock\.json|yarn\.lock|pnpm-lock\.yaml)$
```

### Staging noindex

```apache
<IfModule mod_headers.c>
  Header always set X-Robots-Tag "noindex, nofollow, noarchive"
</IfModule>
```

Combine with authentication and `Disallow: /` in staging robots.txt.

---

## 3. NGINX

```nginx
server {
    listen 80;
    server_name example.com www.example.com;
    return 301 https://www.example.com$request_uri;
}

server {
    listen 443 ssl http2;
    server_name example.com;
    return 301 https://www.example.com$request_uri;

    ssl_certificate     /etc/ssl/example.com.pem;
    ssl_certificate_key /etc/ssl/example.com.key;
}

server {
    listen 443 ssl http2;
    server_name www.example.com;

    ssl_certificate     /etc/ssl/example.com.pem;
    ssl_certificate_key /etc/ssl/example.com.key;

    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    location ~* ^/_next/static/ {
        proxy_pass http://127.0.0.1:3000;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    location = /robots.txt {
        proxy_pass http://127.0.0.1:3000;
        add_header Cache-Control "public, max-age=0, must-revalidate";
    }

    location ~ /\.(?!well-known) {
        deny all;
    }
}
```

- `try_files` must not return `200` for missing routes; ensure the app returns a
  real 404.
- Do not let a catch-all proxy hide 5xx errors.
- Run `nginx -t` before reloading.

---

## 4. Next.js `headers()`

```ts
// next.config.ts
import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Content-Security-Policy", value: "frame-ancestors 'self'" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
      {
        source: "/_next/static/(.*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

export default nextConfig;
```

- If Apache/NGINX also sets a header, the edge usually wins. Avoid duplicates
  with different values.
- Do not set `X-Robots-Tag: noindex` globally in `next.config`; use middleware or
  server config for staging only.
- Verify the built output, not just the config.

---

## 5. Verification

```bash
# Full header dump
curl -sI https://www.example.com/ | sort

# Follow redirects and show every hop
curl -sIL https://example.com/ | grep -Ei '^(HTTP/|location:)'

# Status + redirects + final URL
curl -s -o /dev/null -w '%{http_code} %{num_redirects} %{url_effective}\n' \
  -L https://example.com/

# Check a staging header does not leak to production
curl -sI https://www.example.com/ | grep -i x-robots-tag

# HSTS
curl -sI https://www.example.com/ | grep -i strict-transport-security

# Cache-Control on a hashed asset
curl -sI https://www.example.com/_next/static/<path> | grep -i cache-control

# Mixed content scan (manual): DevTools Console + Network, filter http://
```

Checklist:

- [ ] `http://` and the non-canonical host redirect once to the canonical HTTPS
      URL.
- [ ] No redirect chains or loops.
- [ ] Security headers present on HTML and error pages.
- [ ] HSTS only if all subdomains are ready.
- [ ] Hashed assets `immutable`; HTML revalidates.
- [ ] No `X-Robots-Tag: noindex` in production.
- [ ] `robots.txt`/`sitemap.xml` return the real content type, not HTML.
- [ ] No `.env`, `.git`, source maps, or backups exposed.
- [ ] Error pages do not leak stack traces.
- [ ] CSP does not break scripts/styles (test console).

## 6. Common mistakes

| Mistake | Effect |
| --- | --- |
| HSTS before subdomains are HTTPS | Subdomains become unreachable |
| CSP with `unsafe-inline` missing | Inline scripts blocked, page breaks |
| Caching HTML `immutable` | Users see stale content for a year |
| `X-Robots-Tag: noindex` on `/*` | Whole site deindexed |
| Proxy without `X-Forwarded-Proto` | App redirects HTTPS → HTTP |
| `try_files` SPA fallback | Soft 404s for missing routes |
| Duplicate `Cache-Control` headers | Unpredictable caching |
| Blocking `/_next/static` | JS/CSS missing, rendering fails |
