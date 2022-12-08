export interface ProductsData {
  edges: Products;
}

export interface Products extends Array<Product> {}

export interface Product {
  description: string;
  wordpress_id: number;
  attributes: [
    {
      name?: string;
      options?: string[];
      variation?: boolean;
    }
  ]
  name: string;
  price: number;
  id: string;
  sku: number;
  slug: string;
  categories?: [
    {
      name: string;
      slug: string;
      id: string;
    }
  ]
  images: [{ src: string }];
  product_variations: [
    {
      attributes: [
        {
          name: string;
          option: string;
          id: string;
        }
      ]
      image: {
        src: string;
      }
    }
  ] | null
}

export interface ItemsQueryResult {
  allWcProducts: {
    edges: [
      {
        node: Product;
      }
    ];
  };
}
