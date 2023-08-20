import RobloxService from "../roblox/RobloxService";
import Strategy from "../strategy/Strategy";

export default class FreeItemsSniperStrategy extends Strategy {
  #robloxService;

  /**
   *
   * @param {string} ROBLOSECURITY
   * @param {RobloxService} robloxService
   */
  constructor(ROBLOSECURITY, robloxService) {
    super(ROBLOSECURITY, robloxService);
  }

  purchaseManyFreeItems() {}
}
