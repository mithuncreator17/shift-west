import Types "../types/products-categories";
import Map "mo:core/Map";
import Iter "mo:core/Iter";

module {
  public type Product = Types.Product;
  public type Category = Types.Category;
  public type Result<T, E> = { #ok : T; #err : E };

  let ADMIN_PASSWORD = "subash7";

  public func listProducts(products : Map.Map<Nat, Product>) : [Product] {
    products.values().toArray();
  };

  public func getProduct(products : Map.Map<Nat, Product>, id : Nat) : ?Product {
    products.get(id);
  };

  public func addProduct(
    products : Map.Map<Nat, Product>,
    nextId : Nat,
    name : Text,
    price : Nat,
    category : Text,
    password : Text,
  ) : Result<Product, Text> {
    if (password != ADMIN_PASSWORD) {
      return #err("Wrong password");
    };
    let product : Product = { id = nextId; name; price; category };
    products.add(nextId, product);
    #ok(product);
  };

  public func updateProduct(
    products : Map.Map<Nat, Product>,
    id : Nat,
    name : Text,
    price : Nat,
    category : Text,
    password : Text,
  ) : Result<Product, Text> {
    if (password != ADMIN_PASSWORD) {
      return #err("Wrong password");
    };
    switch (products.get(id)) {
      case null { #err("Product not found") };
      case (?_existing) {
        let updated : Product = { id; name; price; category };
        products.add(id, updated);
        #ok(updated);
      };
    };
  };

  public func deleteProduct(
    products : Map.Map<Nat, Product>,
    id : Nat,
    password : Text,
  ) : Result<Bool, Text> {
    if (password != ADMIN_PASSWORD) {
      return #err("Wrong password");
    };
    switch (products.get(id)) {
      case null { #err("Product not found") };
      case (?_p) {
        products.remove(id);
        #ok(true);
      };
    };
  };

  public func listCategories(categories : Map.Map<Nat, Category>) : [Category] {
    categories.values().toArray();
  };

  public func getCategory(categories : Map.Map<Nat, Category>, id : Nat) : ?Category {
    categories.get(id);
  };

  public func addCategory(
    categories : Map.Map<Nat, Category>,
    nextId : Nat,
    name : Text,
    password : Text,
  ) : Result<Category, Text> {
    if (password != ADMIN_PASSWORD) {
      return #err("Wrong password");
    };
    let category : Category = { id = nextId; name };
    categories.add(nextId, category);
    #ok(category);
  };

  public func deleteCategory(
    categories : Map.Map<Nat, Category>,
    products : Map.Map<Nat, Product>,
    id : Nat,
    password : Text,
  ) : Result<Bool, Text> {
    if (password != ADMIN_PASSWORD) {
      return #err("Wrong password");
    };
    switch (categories.get(id)) {
      case null { #err("Category not found") };
      case (?cat) {
        let inUse = products.any(func(_, p) = p.category == cat.name);
        if (inUse) {
          return #err("Cannot delete category: products are using it");
        };
        categories.remove(id);
        #ok(true);
      };
    };
  };

  public func seedDefaultData(
    products : Map.Map<Nat, Product>,
    categories : Map.Map<Nat, Category>,
    nextProductId : Nat,
    nextCategoryId : Nat,
  ) : (Nat, Nat) {
    if (not categories.isEmpty() or not products.isEmpty()) {
      return (nextProductId, nextCategoryId);
    };
    // Seed categories
    let topwear : Category = { id = nextCategoryId; name = "Topwear" };
    let bottomwear : Category = { id = nextCategoryId + 1; name = "Bottomwear" };
    let hoodies : Category = { id = nextCategoryId + 2; name = "Hoodies" };
    categories.add(topwear.id, topwear);
    categories.add(bottomwear.id, bottomwear);
    categories.add(hoodies.id, hoodies);
    // Seed products
    let p1 : Product = { id = nextProductId; name = "Acid Wash Oversized Tee"; price = 899; category = "Topwear" };
    let p2 : Product = { id = nextProductId + 1; name = "Graffiti Cargo Pants"; price = 1799; category = "Bottomwear" };
    let p3 : Product = { id = nextProductId + 2; name = "West Coast Hoodie"; price = 1499; category = "Hoodies" };
    products.add(p1.id, p1);
    products.add(p2.id, p2);
    products.add(p3.id, p3);
    (nextProductId + 3, nextCategoryId + 3);
  };
};
