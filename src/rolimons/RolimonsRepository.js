import axios from "axios";

export default class RolimonsRepository {
  findManyRolimonsItemsDetails() {
    return axios("https://www.rolimons.com/marketplace/new");
  }
}
