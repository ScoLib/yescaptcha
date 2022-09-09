# yescaptcha

http://www.yescaptcha.com/

## Install

```sh
npm install yescaptcha
```

## Usage


Recaptcha,
```js
const Captcha = require("yescaptcha")

// A new 'solver' instance with our API key
const solver = new Captcha.Solver("<Your yescaptcha api key>", {
  pollingFrequency: 5000,
  verbose: false,
  baseUrl: 'https://api.yescaptcha.com', // https://china.yescaptcha.com
})

/* Example ReCaptcha Website */
solver.recaptcha('websiteKey', 'websiteURL', {
  type: 'NoCaptchaTaskProxyless', // more arg see https://yescaptcha.atlassian.net/wiki/spaces/YESCAPTCHA/overview?homepageId=33020
}).then((res) => {
    console.log(res)
})
```
