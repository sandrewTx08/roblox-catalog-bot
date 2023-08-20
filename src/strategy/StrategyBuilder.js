import { ContainerBuilder } from "node-dependency-injection";
import RolimonsRepository from "../rolimons/RolimonsRepository";
import RobloxService from "../roblox/RobloxService";
import RolimonsService from "../rolimons/RolimonsService";
import RobloxRepository from "../roblox/RobloxRepository";
import UGCLimitedStrategy from "../strategies/UGCLimitedStrategy";
import FreeProductsStrategy from "../strategies/FreeProductsStrategy";

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

    this.#container.register(UGCLimitedStrategy.name, UGCLimitedStrategy, [
      ROBLOSECURITY,
      this.#container.get(RobloxService.name),
      this.#container.get(RolimonsService.name),
    ]);

    this.#container.register(FreeProductsStrategy.name, FreeProductsStrategy, [
      ROBLOSECURITY,
      this.#container.get(RobloxService.name),
    ]);
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
