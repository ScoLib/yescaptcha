const { default: axios } = require("axios");
const { sleep } = require("./utils");

/**
 * http://www.yescaptcha.com/
 * https://yescaptcha.atlassian.net/wiki/spaces/YESCAPTCHA/overview?homepageId=33020
 */
class Solver {
  constructor(apikey, pollingFrequency = 5000, verbose = false) {
    this._apikey = apikey;
    this._pollingFrequency = pollingFrequency;
    this._verbose = verbose;
  }

  get apikey() { return this._apikey; }
  get pollingFrequency() { return this._pollingFrequency; }
  set apikey(update) { this._apikey = update; }

  async pollResponse(taskId, pollingFreq = this.pollingFrequency) {
    let data = {
      clientKey: this.apikey,
      taskId
    }
    await sleep(pollingFreq);
    const response = await axios.post('https://api.yescaptcha.com/getTaskResult', data)
    // console.log(response)

    if (response.data.errorId == 0) {
      switch (response.data.status) {
        case 'ready': return { data: response.data.solution.gRecaptchaResponse, taskId };
        case "processing": 
          if (this._verbose) {
            console.log('task processing')
          }
          return this.pollResponse(taskId, pollingFreq);
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
        ...args
      }
    }
    const response = await axios.post('https://api.yescaptcha.com/createTask', data)
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