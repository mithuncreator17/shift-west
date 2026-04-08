import Types "../types/products-categories";
import Lib "../lib/products-categories";
import Map "mo:core/Map";

mixin (
  products : Map.Map<Nat, Types.Product>,
  categories : Map.Map<Nat, Types.Category>,
  counters : Types.Counters,
) {
  // Seed default data on first deploy
  do {
    let (newPid, newCid) = Lib.seedDefaultData(products, categories, counters.nextProductId, counters.nextCategoryId);
    counters.nextProductId := newPid;
    counters.nextCategoryId := newCid;
  };

  // --- Query methods ---

  public query func listProducts() : async [Types.Product] {
    Lib.listProducts(products);
  };

  public query func getProduct(id : Nat) : async ?Types.Product {
    Lib.getProduct(products, id);
  };

  public query func listCategories() : async [Types.Category] {
    Lib.listCategories(categories);
  };

  public query func getCategory(id : Nat) : async ?Types.Category {
    Lib.getCategory(categories, id);
  };

  // --- Admin update methods ---

  public func addProduct(name : Text, price : Nat, category : Text, password : Text) : async { #ok : Types.Product; #err : Text } {
    let result = Lib.addProduct(products, counters.nextProductId, name, price, category, password);
    switch (result) {
      case (#ok(_)) { counters.nextProductId += 1 };
      case (#err(_)) {};
    };
    result;
  };

  public func updateProduct(id : Nat, name : Text, price : Nat, category : Text, password : Text) : async { #ok : Types.Product; #err : Text } {
    Lib.updateProduct(products, id, name, price, category, password);
  };

  public func deleteProduct(id : Nat, password : Text) : async { #ok : Bool; #err : Text } {
    Lib.deleteProduct(products, id, password);
  };

  public func addCategory(name : Text, password : Text) : async { #ok : Types.Category; #err : Text } {
    let result = Lib.addCategory(categories, counters.nextCategoryId, name, password);
    switch (result) {
      case (#ok(_)) { counters.nextCategoryId += 1 };
      case (#err(_)) {};
    };
    result;
  };

  public func deleteCategory(id : Nat, password : Text) : async { #ok : Bool; #err : Text } {
    Lib.deleteCategory(categories, products, id, password);
  };
};
