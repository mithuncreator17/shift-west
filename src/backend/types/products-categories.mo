module {
  public type Product = {
    id : Nat;
    name : Text;
    price : Nat;
    category : Text;
  };

  public type Category = {
    id : Nat;
    name : Text;
  };

  public type Counters = {
    var nextProductId : Nat;
    var nextCategoryId : Nat;
  };
};
