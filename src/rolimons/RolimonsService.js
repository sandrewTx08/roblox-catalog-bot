import RolimonsItemDetails from "./RolimonsItemDetails";
import RolimonsScraper from "./RolimonsScraper";
import RolimonsRepository from "./RolimonsRepository";

export default class RolimonsService {
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
      .findManyRolimonsItemsDetailsByMarketPlace()
      .then(
        ({ data }) =>
          new RolimonsItemDetails(
            new RolimonsScraper(data).marketPlaceItemsDetails()
          )
      );
  }
}
