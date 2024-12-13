import MetaData from "./layout/MetaData";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getProducts } from "../actions/productActions";
import Product from "./product/Product";
import Loader from "./layout/Loader";

const Home = () => {
  const dispatch = useDispatch();

  const { products, loading, error, productsCount } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  return (
    <>
      {loading ? <Loader /> :
        <>
          <MetaData title="Buy Products Online" />
          <h1 id="products_heading">Latest Products</h1>
          <section id="products" className="container mt-5">
            <div className="row">
              {products && products.map((product) => (
                <Product key={product._id} product={product} />
              ))}
            </div>
          </section>
        </>}

    </>
  )
}

export default Home