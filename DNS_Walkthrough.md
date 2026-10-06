# DNS, in simple words

DNS (Domain Name System) helps browsers find websites. It turns a human-friendly domain name, such as `example.com`, into the computer address used by a web server.

## Resolver

A resolver is the service that looks up a domain for you. Your device usually asks a resolver provided by your internet company, router, or a public service.

## Nameserver

A nameserver stores and answers questions about a domain's DNS settings. The domain registrar tells the internet which nameservers are responsible for the domain.

## DNS record

A DNS record is one instruction in a domain's DNS settings. It can say where a website lives, where email should go, or which service manages the domain.

## CNAME

A CNAME record points one hostname to another hostname. For example, `www.example.com` can point to a hosting address supplied by a website platform. It is commonly used for `www` subdomains.

## Response

When a browser asks for a domain, the resolver checks the nameservers, reads the relevant record, and sends back a response. The browser then uses that response to connect to the website.

## HTTPS

HTTPS encrypts the connection between the browser and the website. It helps protect information while it travels and confirms that the browser is talking to the intended domain. Hosting services such as Netlify can issue and renew an SSL certificate so the site loads with `https://`.
