const { default: axios } = require("axios");
const { sleep } = require("./utils");

/**
 * http://www.yescaptcha.com/
 * https://yescaptcha.atlassian.net/wiki/spaces/YESCAPTCHA/overview?homepageId=33020
 */
class Solver {
  constructor(apikey, options = {}) {
    this._apikey = apikey;
    this._pollingFrequency = options.pollingFrequency || 5000;
    this._verbose = options.verbose || false;
    this._baseUrl = options.baseUrl || 'https://api.yescaptcha.com';
  }

  get apikey() { return this._apikey; }
  get pollingFrequency() { return this._pollingFrequency; }
  set apikey(update) { this._apikey = update; }

  async pollResponse(taskId) {
    let data = {
      clientKey: this.apikey,
      taskId
    }
    await sleep(this.pollingFrequency);
    const response = await axios.post(`${this._baseUrl}/getTaskResult`, data)
    // console.log(response)

    if (response.data.errorId == 0) {
      switch (response.data.status) {
        case 'ready': return { data: response.data.solution.gRecaptchaResponse, taskId };
        case "processing": 
          if (this._verbose) {
            console.log('task processing')
          }
          return this.pollResponse(taskId);
        default: {
          throw new Error(response.data.errorDescription);
        }
      }
    } else {
      throw new Error(response.data.errorDescription)
    }

  }

  async recaptcha(websiteKey, websiteURL, args = { type: 'NoCaptchaTaskProxyless' }) {

    let data = {
      clientKey: this.apikey,
      task: {
        websiteURL,
        websiteKey,
        softID: 2305,
        ...args
      }
    }
    const response = await axios.post(`${this._baseUrl}/createTask`, data)
    // console.log(response)
    if (response.data.errorId == 0) {
      if (this._verbose) {
        console.log(`create task: ${response.data.taskId}`)
      }
      return this.pollResponse(response.data.taskId);
    }

    throw new Error(response.data.errorDescription);
  }

}

module.exports = {
  Solver
}