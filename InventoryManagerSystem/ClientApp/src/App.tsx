import React from "react";
import { Route, Switch } from "react-router";
import DashboardPage from "./Pages/DashboardPage";
import AllProductsPage from "./Pages/ProductsPage";
import axios from "axios";
import "./custom.css";
import ProductViewPage from "./Pages/ProductViewPage";
import ListingsPage from "./Pages/ListingsPage";
import ListingViewPage from "./Pages/ListingViewPage";
import EditListingPage from "./Pages/EditListingPage";
import NewListingPage from "./Pages/NewListingPage";
import NewProductPage from "./Pages/NewProductPage";
import EditProductPage from "./Pages/EditProductPage";
import SalesPgae from "./Pages/SalesPage";

//axios.defaults.baseURL = "https://localhost:44361/";

axios.interceptors.response.use(
  (response: any): any => {
    console.log(
      "I RETURN THE FOLLOWING",
      { status: response.status, data: { ...response.data.data } },
      "FROM ",
      response
    );
    return { status: response.status, data: { ...response.data } };
  },
  (error) => {
    if (error.message != null && error.message === "AXIOS CANCELED") return;
    console.log(
      "ERR! Got hit by an error that can cause issues in the app. Details?",
      error.response
    );

    return {
      status: error.response.status,
      data: { ...error.response.data },
      config: { ...error.response.config },
    };
  }
);

export default function App() {
  return (
    <Switch>
      <Route exact path="/" component={DashboardPage} />
      <Route exact path="/products/New" component={NewProductPage} />
      <Route exact path="/Products" component={AllProductsPage} />
      <Route exact path="/Products/:webCode?" component={ProductViewPage} />
      <Route
        exact
        path="/products/:webCode?/edit"
        component={EditProductPage}
      />
      <Route exact path="/listings" component={ListingsPage} />
      <Route exact path="/listings/New" component={NewListingPage} />
      <Route
        exact
        path="/listings/:listingId?/:productName?/edit"
        component={EditListingPage}
      />
      <Route
        exact
        path="/listings/:listingId?/:productName?"
        component={ListingViewPage}
      />
      <Route exact path="/sales" component={SalesPgae} />
    </Switch>
  );
}
