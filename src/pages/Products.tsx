import React from 'react';
import ProductCatalog from '../components/ProductCatalog';

const Products: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Furniture Catalog</h1>
          <p className="text-gray-600">
            Discover our collection of beautiful furniture pieces for your home
          </p>
        </div>
        
        <ProductCatalog 
          userStyle="modern"
          className="w-full"
        />
      </div>
    </div>
  );
};

export default Products;
