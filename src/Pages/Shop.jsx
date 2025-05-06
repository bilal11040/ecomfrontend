import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../Context/Allheadings";
import { ShopContext } from "../Context/ShopContext";
import { Link, useLocation } from "react-router-dom";
import Item from "../Components/item/Item";
import "./CSS/Shop.css";

const Shop = () => {
  const { products, loading } = useContext(ShopContext);
  const { user } = useContext(UserContext);
  const location = useLocation();

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  // ✅ Extract search term from URL
  const searchParams = new URLSearchParams(location.search);
  const searchTerm = searchParams.get("search")?.toLowerCase() || "";

  // ✅ Filter products based on category and search term
  const filteredProducts = Array.isArray(products)
    ? products.filter(
        (item) =>
          item.Category === "all" &&
          (item.Name.toLowerCase().includes(searchTerm) ||
            item.Description?.toLowerCase().includes(searchTerm)) // Optional: Description search
      )
    : [];

  useEffect(() => {
    console.log("Filtered Products:", filteredProducts);
  }, [filteredProducts]);

  if (loading) {
    return <p className="loading">Loading products...</p>;
  }

  if (filteredProducts.length === 0) {
    return <p className="no-products">No products found.</p>;
  }

  // ✅ Pagination Logic
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const handlePageClick = (pageNumber) => {
    if (pageNumber !== currentPage) {
      setCurrentPage(pageNumber);
      window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to top on page change
    }
  };

  // ✅ Pagination Display Logic
  const generatePagination = () => {
    let pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages = [1, 2, 3, "...", totalPages];
      } else if (currentPage >= totalPages - 2) {
        pages = [1, "...", totalPages - 2, totalPages - 1, totalPages];
      } else {
        pages = [1, "...", currentPage, "...", totalPages];
      }
    }
    return pages;
  };

  return (
    <div className="shop" style={{ marginBottom: 20 }}>
      <div className="header">
        <p>{user?.Shopheading || "Shop"}</p>
      </div>

      <div className="shop-indexsort">
        <p>
          Showing {startIndex + 1}-{Math.min(endIndex, filteredProducts.length)} of {filteredProducts.length} products
        </p>
      </div>

      <div className="products">
        {currentProducts.map((item) => (
          <Link to={`/product/${item.ProductId}?source=all`} key={item.ProductId}>
            <Item
              id={item.ProductId}
              name={item.Name}
              image={item.ImageUrl}
              NewPrice={item.NewPrice}
              old_price={item.OldPrice}
            />
          </Link>
        ))}
      </div>

      {/* ✅ Pagination Component */}
      <div className="pagination">
        <button disabled={currentPage === 1} onClick={() => handlePageClick(1)}>&laquo;</button>
        <button disabled={currentPage === 1} onClick={() => handlePageClick(currentPage - 1)}>&lt;</button>

        {generatePagination().map((page, index) =>
          page === "..." ? (
            <span key={index} className="dots">...</span>
          ) : (
            <button
              key={index}
              className={currentPage === page ? "active" : ""}
              onClick={() => handlePageClick(page)}
            >
              {page}
            </button>
          )
        )}

        <button disabled={currentPage === totalPages} onClick={() => handlePageClick(currentPage + 1)}>&gt;</button>
        <button disabled={currentPage === totalPages} onClick={() => handlePageClick(totalPages)}>&raquo;</button>
      </div>
    </div>
  );
};

export default Shop;
