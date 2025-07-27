import { Products, columns } from './columns';
import { DataTable } from './data-table';
import { useEffect, useState } from 'react';
import PaginationBar from './pegination';

interface ProductData {
  id: number;
  pidUser: string;
  pidProduct: string;
  pidOrder: string;
  productName: string;
  productLink: string;
  productCategory: string;
  productPrice: string;
  productWeight: string;
  productQuantity: string;
  productInfo: string;
  createdAt: string;
}

interface TableDataProps {
  products: ProductData[];
}

const TableData = ({ products }: TableDataProps) => {
  const [page, setPage] = useState(1);
  const [last, setLast] = useState(1);
  const [fetch, setFetch] = useState<boolean>(false);
  const [filteredProducts, setFilteredProducts] = useState<Products[]>([]);

  useEffect(() => {
    setPage(1);
  }, [fetch]);

  useEffect(() => {
    // Calculate the start and end indices for the current page
    const startIndex = (page - 1) * 5;
    const endIndex = startIndex + 5;
    // Slice the data to get only the products for the current page
    //setFilteredProducts(products.slice(startIndex, endIndex));
  }, [page, fetch, products]);

  useEffect(() => {
    //const data = Math.ceil(products.length / 5);
    //setLast(data);
  }, [products]);

  const handlePrev = () => {
    if (page > 1) {
      setPage((prevState) => prevState - 1);
    }
  };

  const handleNext = () => {
    if (page < last) {
      setPage((prevState) => prevState + 1);
    }
  };

  const handleSearchValueChange = (value: string) => {
    if (!value) {
      setFetch(!fetch);
    }
  };

  const handleClick = (currentPage: number) => {
    setPage(currentPage);
  };

  const handleSearch = () => {
    setFetch(!fetch);
  };

  const handleDelete = (id: number) => {
    setFilteredProducts((prevProducts) =>
      prevProducts.filter((product) => product.id !== id),
    );
  };

  return (
    <div className="flex flex-col justify-between bg-white dark:bg-[#161629]">
      <DataTable
        columns={columns}
        onSearchClick={handleSearch}
        onSearchValueChange={handleSearchValueChange}
        data={filteredProducts}
        onDelete={handleDelete}
      />
      <PaginationBar
        lastPage={last}
        currentPage={page}
        handlePrev={handlePrev}
        handleNext={handleNext}
        handleClick={handleClick}
      />
    </div>
  );
};

export default TableData;
