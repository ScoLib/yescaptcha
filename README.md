# yescaptcha

## Install

```sh
npm install yescaptcha
```

## Usage


Recaptcha,
```js
const Captcha = require("yescaptcha")

// A new 'solver' instance with our API key
const solver = new Captcha.Solver("<Your yescaptcha api key>")

/* Example ReCaptcha Website */
solver.recaptcha('websiteKey', 'websiteURL')
.then((res) => {
    console.log(res)
})
```
