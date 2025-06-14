import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../Context/ShopContext';
import { useParams } from 'react-router-dom';
import Breadcrum from '../Components/Breadcrums/Breadcrum';
import ProductDisplay from '../Components/ProductDisplay/ProductDisplay';
import DescriptionBox from '../Components/DescriptionBox/DescriptionBox';
import RelatedProducts from '../Components/RelatedProducts/RelatedProducts';

const Product = () => {
  const { all_product } = useContext(ShopContext);
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!productId) {
      setError('Product ID is missing.');
      setLoading(false);
      return;
    }

    if (Array.isArray(all_product) && all_product.length > 0) {
      const foundProduct = all_product.find((e) => e.id === Number(productId));

      if (foundProduct) {
        setProduct(foundProduct);
      } else {
        setError('Product not found.');
      }

      setLoading(false);
    } else {
      setError('Products are still loading...');
    }
  }, [all_product, productId]);

  if (loading) {
    return <div>Loading product...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  console.log('Product Data: ', product);

  return (
    <div>
      {product && <Breadcrum product={product} />}
      {product && <ProductDisplay product={product} />}
      {product && <DescriptionBox product={product} />}
      {product && <RelatedProducts />}
    </div>
  );
};

export default Product;
