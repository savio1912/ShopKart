import axios from "axios";
import { useEffect, useReducer, useState } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Product from "../components/Product";
import { Helmet } from "react-helmet-async";
import logger from "use-reducer-logger";
const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, products: action.payload };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
const HomeScreen = () => {
  const [{ loading, error, products }, dispatch] = useReducer(logger(reducer), {
    loading: true,
    error: "",
    products: [],
  });

  useEffect(() => {
    async function fetchData() {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const result = await axios.get("api/products");
        dispatch({ type: "FETCH_SUCCESS", payload: result.data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: err.message });
      }
    }
    fetchData();
  }, []);

  return (
    <>
      <Helmet>
        <title>ShopKart</title>
      </Helmet>
      <h1 className="homescreentitle">Featured Products</h1>

      <div className="products">
        <Row>
          {loading ? (
            <div>Loading....</div>
          ) : error ? (
            <div>Error...</div>
          ) : (
            products.map((product) => (
              <Col sm={6} md={4} lg={3} className="mb-3">
                <Product product={product}></Product>
              </Col>
            ))
          )}
        </Row>
      </div>
    </>
  );
};
export default HomeScreen;
