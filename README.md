# Http-parser

## This is a simple program to parse urls to check their status

### Node, Request, chalk are used for this project

**Install**

```
  1. Global mode
    npm install -g https://github.com/StellaJung-Student/http-parser
    http-parser urls.txt
    Or
    npm install https://github.com/StellaJung-Student/http-parser
    npx http-parser urls.txt

  2. Local mode
    npm intall
    node index.js urls.txt
```

**How can I use**

```
    1. default
    > http-parser urls.txt or node index.js urls.txt
    > http-parser urls1.txt urls2.html or node index.js urls1.txt urls2.html

    2. With timeout [ms]
    > http-parser urls.txt 5000 or node index.js urls.txt 5000

    3. version check
    > http-parser -v or http-parser /v
```

**Color Desription**

- Status
  - 200 : Green
  - 400 or 404 : Red
  - Others : Grey
