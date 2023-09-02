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
      const _xCsrfToken =
        xCsrfToken ||
        axios.defaults.headers.common["x-csrf-token"] ||
        axios.defaults.headers.common["X-CSRF-TOKEN"] ||
        "";
      axios.defaults.headers.common["x-csrf-token"] = _xCsrfToken;
      axios.defaults.headers.common["X-CSRF-TOKEN"] = _xCsrfToken;
      return this;
    });
  }
}
