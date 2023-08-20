import { ContainerBuilder } from "node-dependency-injection";
import RolimonsRepository from "../rolimons/RolimonsRepository";
import RobloxService from "../roblox/RobloxService";
import RolimonsService from "../rolimons/RolimonsService";
import RobloxRepository from "../roblox/RobloxRepository";
import UGCLimitedSniperStrategy from "../strategies/UGCLimitedSniperStrategy";
import FreeItemsSniperStrategy from "../strategies/FreeItemsSniperStrategy";
import Strategy from "./Strategy";

export default class StrategyBuilder {
  #container = new ContainerBuilder();

  /**
   *
   * @param {string} ROBLOSECURITY
   * @private
   */
  constructor(ROBLOSECURITY) {
    this.#container.register(RobloxRepository.name, RobloxRepository);
    this.#container.register(RobloxService.name, RobloxService, [
      this.#container.get(RobloxRepository.name),
    ]);

    this.#container.register(RolimonsRepository.name, RolimonsRepository);
    this.#container.register(RolimonsService.name, RolimonsService, [
      this.#container.get(RolimonsRepository.name),
    ]);

    this.#container.register(Strategy.name, Strategy, [
      ROBLOSECURITY,
      this.#container.get(RobloxService.name),
    ]);

    this.#container.register(
      UGCLimitedSniperStrategy.name,
      UGCLimitedSniperStrategy,
      [
        ROBLOSECURITY,
        this.#container.get(RobloxService.name),
        this.#container.get(RolimonsService.name),
      ]
    );

    this.#container.register(
      FreeItemsSniperStrategy.name,
      FreeItemsSniperStrategy,
      [ROBLOSECURITY, this.#container.get(RobloxService.name)]
    );
  }

  /**
   *
   * @template {{[x: string]: any}} T
   * @param {string} ROBLOSECURITY
   * @param {T} strategy
   * @returns {T['prototype']}
   */
  static build(ROBLOSECURITY, strategy) {
    return new StrategyBuilder(ROBLOSECURITY).#container.get(strategy.name);
  }
}
