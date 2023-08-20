import axios from "axios";
import RobloxService from "../roblox/RobloxService";
import User from "../user/User";

export default class Strategy {
  /**
   *
   * @type {User}
   */
  user;
  #robloxService;

  /**
   *
   * @param {string} ROBLOSECURITY
   * @param {RobloxService} robloxService
   */
  constructor(ROBLOSECURITY, robloxService) {
    axios.defaults.headers.common.Cookie = `.ROBLOSECURITY=${ROBLOSECURITY};`;
    this.#robloxService = robloxService;
  }

  setUser() {
    return this.#robloxService.getUser().then((user) => {
      this.user = user;
      return this;
    });
  }

  setXCsrfToken() {
    return this.#robloxService.getXCsrfToken().then((xCsrfToken) => {
      axios.defaults.headers.common["x-csrf-token"] =
        xCsrfToken || axios.defaults.headers.common["x-csrf-token"] || "";
      return this;
    });
  }
}
