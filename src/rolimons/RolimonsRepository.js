import axios from "axios";

export default class RolimonsRepository {
  findManyRolimonsItemsDetailsByMarketPlace() {
    return axios("https://www.rolimons.com/marketplace/new");
  }
}
