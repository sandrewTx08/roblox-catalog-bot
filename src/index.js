import { ContainerBuilder } from "node-dependency-injection";
import RolimonsRepository from "./rolimons/RolimonsRepository";
import RobloxService from "./roblox/RobloxService";
import RolimonsService from "./rolimons/RolimonsService";
import RobloxRepository from "./roblox/RobloxRepository";
import axios from "axios";
import UGCLimitedSniperController from "./ugc-limited-sniper/UGCLimitedSniperController";

export default class UGCLimitedSniper {
  #container = new ContainerBuilder();

  /**
   *
   * @private
   * @param {string} ROBLOSECURITY
   */
  constructor(ROBLOSECURITY) {
    axios.defaults.headers.common.Cookie = `.ROBLOSECURITY=${ROBLOSECURITY};`;

    this.#container.register(RolimonsRepository.name, RolimonsRepository);
    this.#container
      .register(RolimonsService.name, RolimonsService)
      .addArgument(this.#container.get(RolimonsRepository.name));

    this.#container.register(RobloxRepository.name, RobloxRepository);
    this.#container
      .register(RobloxService.name, RobloxService)
      .addArgument(this.#container.get(RobloxRepository.name));

    this.#container
      .register(UGCLimitedSniperController.name, UGCLimitedSniperController)
      .addArgument(this.#container.get(RobloxService.name))
      .addArgument(this.#container.get(RolimonsService.name));
  }

  /**
   *
   * @param {string} ROBLOSECURITY
   * @returns {UGCLimitedSniperController}
   */
  static start(ROBLOSECURITY) {
    return new UGCLimitedSniper(ROBLOSECURITY).#container.get(
      UGCLimitedSniperController.name
    );
  }
}
