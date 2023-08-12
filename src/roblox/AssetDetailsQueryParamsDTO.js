export default class AssetDetailsQueryParamsDTO {
  Category;
  salesTypeFilter;
  SortType;
  IncludeNotForSale;
  Limit;

  /**
   *
   * @param {number} category
   * @param {number} salesTypeFilter
   * @param {number} sortType
   * @param {boolean} includeNotForSale
   * @param {number} limit
   */
  constructor(category, salesTypeFilter, sortType, includeNotForSale, limit) {
    this.Category = category;
    this.salesTypeFilter = salesTypeFilter;
    this.SortType = sortType;
    this.IncludeNotForSale = includeNotForSale;
    this.Limit = limit;
  }
}
