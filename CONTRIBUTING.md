# Http-parser

## This is a simple program to parse urls to check their status

### Node, Request, chalk are used for this project

**Install**

```
  1. Global mode
    npm install -g https://github.com/StellaJung-Student/http-parser
    http-parser -f urls.txt
    Or
    npm install https://github.com/StellaJung-Student/http-parser
    npx http-parser -f urls.txt

  2. Local mode
    npm intall
    node index.js -f urls.txt
```

**How can I use**

```
    1. default
    > http-parser -f urls.txt or node index.js -f urls.txt
    > http-parser -f urls1.txt -f urls2.html or node index.js -f urls1.txt -f urls2.html

    2. With timeout [ms]
    > http-parser -f urls.txt -t 5000 or node index.js -f urls.txt -t 5000

    3. With filter
    > http-parser -f urls.txt --good
    > http-parser -f urls.txt --bad
    > http-parser -f urls.txt --all cf) --all is default

    4. optional ignoring urls from file
    > http-parser -i ignoreurls.txt -f urls.txt

    5. version check
    > http-parser -v or http-parser --version

    6. from local server
    > http-parser -l
```

**Color Desription**

- Status
  - 200 : Green
  - 400 or 404 : Red
  - Others : Grey

**Usage - Prettier**

- Apply prettier
  - npm run prettier-fix
- Check prettier formatting
  - npm run prettier

**Usage - Eslint**

- Apply eslint
  - npm run eslint-fix
- Check eslint standard
  - npm run eslint

**Integration to VScode**

- Recommendation to install ESLint and Prettier.
- check .vscode folder's settings.json and [here](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

**Usage - Test**
```
  Test Should be in __tests__ although the filename include "test".
```

- Check test
  - npm run test
- Check test coverage
  - npm run test:coverage