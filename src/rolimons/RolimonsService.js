import RolimonsItemDetails from "./RolimonsItemDetails";
import RolimonsScraper from "./RolimonsScraper";
import RolimonsRepository from "./RolimonsRepository";

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
