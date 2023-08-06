export default class ItemsDetailsQueryParamsDTO {
  id;
  itemType;

  /**
   *
   * @param {string} itemType
   * @param {number} id
   */
  constructor(itemType, id) {
    this.itemType = itemType;
    this.id = id;
  }
}
