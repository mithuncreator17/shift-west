import Types "types/products-categories";
import ProductsCategoriesApi "mixins/products-categories-api";
import Map "mo:core/Map";

actor {
  let products = Map.empty<Nat, Types.Product>();
  let categories = Map.empty<Nat, Types.Category>();
  let counters : Types.Counters = { var nextProductId = 0; var nextCategoryId = 0 };

  include ProductsCategoriesApi(products, categories, counters);
};
