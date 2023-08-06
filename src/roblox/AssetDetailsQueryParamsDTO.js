export default class AssetDetailsQueryParamsDTO {
  Category;
  salesTypeFilter;
  SortType;
  IncludeNotForSale;
  Limit;

  /**
   *
   * @param {number} Category
   * @param {number} salesTypeFilter
   * @param {number} SortType
   * @param {boolean} IncludeNotForSale
   * @param {number} Limit
   */
  constructor(Category, salesTypeFilter, SortType, IncludeNotForSale, Limit) {
    this.Category = Category;
    this.salesTypeFilter = salesTypeFilter;
    this.SortType = SortType;
    this.IncludeNotForSale = IncludeNotForSale;
    this.Limit = Limit;
  }
}
