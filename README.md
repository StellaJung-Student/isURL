# Http-checker

## This is a simple program to parse urls to check their status

### Node, Request, chalk are used for this project

### How to install from npm

This http-parser command-line tool is in npmjs.com now. Just enter `npm i -g http-checker` on the command line or you can use `npx http-checker -f urls.txt` if you don't want it as a global.

**Local Install**

```
  1. Global mode
    npm install -g https://github.com/StellaJung-Student/http-parser
    http-checker -f urls.txt
    Or
    npm install https://github.com/StellaJung-Student/http-parser
    npx http-checker -f urls.txt

  2. Local mode
    npm intall
    node index.js -f urls.txt
```

**How can I use**

```
    1. default
    > http-checker -f urls.txt or node index.js -f urls.txt
    > http-checker -f urls1.txt -f urls2.html or node index.js -f urls1.txt -f urls2.html

    2. With timeout [ms]
    > http-checker -f urls.txt -t 5000 or node index.js -f urls.txt -t 5000

    3. With filter
    > http-checker -f urls.txt --good
    > http-checker -f urls.txt --bad
    > http-checker -f urls.txt --all cf) --all is default

    4. optional ignoring urls from file
    > http-checker -i ignoreurls.txt -f urls.txt

    5. version check
    > http-checker -v or http-checker --version

    6. from local server
    > http-checker -l
```

**Color Desription**

- Status
  - 200 : Green
  - 400 or 404 : Red
  - Others : Grey

**Version history**

- 1.1.0 added new feature of ignoring urls

```
  -i or --ignore filename
  in the filename, the content will be like

  # This is a valid file to ignore URLs.
  # Ignore CBC website:
  http://www.cbc.ca

  # This is invalid.  It doesn't use http:// or https://
  www.google.com
```

- 1.2.0

```
  -l or --local
  In this case, the pre condition is http://localhost:3000 should run - telescope.
  This option provides the latest 10 blogs url into post.txt
```

- 2.0.0

```
  Name is changed to http-checker for production
```
