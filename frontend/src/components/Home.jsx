import MetaData from "./layout/MetaData";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getProducts } from "../actions/productActions";
import Product from "./product/Product";
import Loader from "./layout/Loader";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const Home = () => {

  const dispatch = useDispatch();

  const { products, loading, error, productsCount } = useSelector((state) => state.products);

  useEffect(() => {
    if (error) {
      toast.error(error);
      return;
      // return toast.error("This is a custom error!", {
      //   style: {
      //     backgroundColor: '#3498db', // Change the background color
      //     color: 'white', // Change the text color
      //     fontWeight: 'bold', // Optional: make the text bold
      //     borderRadius: '10px', // Optional: add some border-radius
      //   },
      // });
    }
    dispatch(getProducts());
  }, [dispatch, error]);

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
  );
}

export default Home;
