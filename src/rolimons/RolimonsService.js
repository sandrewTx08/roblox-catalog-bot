import RolimonsItemDetails from "./RolimonsItemDetails.js";
import RolimonsScraper from "./RolimonsScraper.js";
import RolimonsRepository from "./RolimonsRepository.js";

export class RolimonsService {
  #rolimonsRepository;

  /**
   *
   * @param {RolimonsRepository} rolimonsRepository
   */
  constructor(rolimonsRepository) {
    this.#rolimonsRepository = rolimonsRepository;
  }

  findManyRolimonsItemsDetails() {
    return this.#rolimonsRepository
      .findManyRolimonsItemsDetails()
      .then(
        ({ data }) =>
          new RolimonsItemDetails(
            new RolimonsScraper(data).rolimonsItemDetails()
          )
      );
  }
}

export default RolimonsService;
