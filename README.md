# automated-pubs
Uses `node-html-to-image` to add an overlay image as text.

## Installation
1. Clone into the repository:
```bash
$ git clone https://github.com/thelasallian/automated-pubs

```

2. Build and run Dockerfile:
```
$ docker build -t <image-name> .
$ docker run -d -p <host-port>:<container-port> --name <container-name> <image-name>
```

# NOTES:
- `node-html-to-image` uses *Puppeteer* under the hood, which makes deploying a pain. The Dockerfile ensures that Puppeteer is installed and works. Please install with Docker or make sure Puppeteer can be ran on your system.

# TO DO:
Courtesy to @angelocguerra:
1. Choose Type of Newsbite
- A: Headline w/ Generic Visual
     [ ] 1.1. Univ
     [ ] 1.2. Menage
     [ ] 1.3. Sports
     [ ] 1.4. Vanguard
     [ ] 1.5. Breaking News
     [ ] 1.6. Just In
     [ ] 1.7. Update
     [ ] 1.8. Halalan 2025
     [ ] 1.9. Univ LA
     [ ] 2.0 Just In LA
     [ ] 2.1. National Situationer

- B: Headline w/ New Visual
     [ ] 1.1. Univ
     [ ] 1.2. Menage
     [ ] 1.3. Sports
     [ ] 1.4. Vanguard
     [ ] 1.5. Breaking News
     [ ] 1.6. Just In
     [ ] 1.7. Update
     [ ] 1.8. Halalan 2025

- [ ] C: Quote Visual
