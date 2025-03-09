import React, { useState, useContext, useEffect } from "react";
import { ContextMarket } from "../Context/Context";
import md5 from "md5";

export const ListProducts = () => {
  const { products, total, setTotal, SetProducts, selectedStore, selectedCategory } = useContext(ContextMarket);
  const [sortType, setSortType] = useState("none");
  const [filterCategory, setFilterCategory] = useState("all");
  
  // Obtener fecha actual formateada
  const getCurrentDate = () => {
    const today = new Date();
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return today.toLocaleDateString("es-ES", options);
  };

  // Calcular el total
  const totalProducts = () => {
    let total = 0;
    products.forEach((product) => {
      total = total + product.price;
    });
    setTotal(total);
  };

  // Eliminar un producto
  const handleDelete = (id) => {
    const updatedProducts = products.filter((product) => product.id !== id);
    SetProducts(updatedProducts);
  };

  // Ordenar productos
  const sortProducts = (type) => {
    setSortType(type);
    let sortedProducts = [...products];

    if (type === "name") {
      sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
    } else if (type === "price-asc") {
      sortedProducts.sort((a, b) => a.price - b.price);
    } else if (type === "price-desc") {
      sortedProducts.sort((a, b) => b.price - a.price);
    } else if (type === "date-newest") {
      sortedProducts.sort((a, b) => {
        // Si tienen timestamp
        if (a.timestamp && b.timestamp) {
          return new Date(b.timestamp) - new Date(a.timestamp);
        }
        // Si no, intentamos convertir la fecha de string
        return new Date(b.date) - new Date(a.date);
      });
    } else if (type === "date-oldest") {
      sortedProducts.sort((a, b) => {
        if (a.timestamp && b.timestamp) {
          return new Date(a.timestamp) - new Date(b.timestamp);
        }
        return new Date(a.date) - new Date(b.date);
      });
    } else if (type === "category") {
      sortedProducts.sort((a, b) => (a.categoryName || "").localeCompare(b.categoryName || ""));
    }

    SetProducts(sortedProducts);
  };

  // Filtrar productos por categoría
  const getFilteredProducts = () => {
    if (filterCategory === "all") {
      return products;
    }
    return products.filter(product => product.categoryId === parseInt(filterCategory));
  };

  useEffect(() => {
    const productsWithIds = products.map((product) => {
      if (!product.id) {
        const idString = `${product.name}-${product.price}-${Date.now()}`;
        return { ...product, id: md5(idString) };
      }
      return product;
    });

    if (JSON.stringify(productsWithIds) !== JSON.stringify(products)) {
      SetProducts(productsWithIds);
    }
  }, []);

  useEffect(() => {
    totalProducts();
  }, [products]);

  // Obtener categorías únicas para el filtro
  const uniqueCategories = [...new Set(products
    .filter(product => product.categoryId)
    .map(product => ({ id: product.categoryId, name: product.categoryName })))];

  return (
    <>
      <div className="aside">
        <h2>Lista de productos - {getCurrentDate()}</h2>





        <div className="filter-sort-controls">
          <div className="sort-controls">
            <label>Ordenar por: </label>
            <select
              value={sortType}
              onChange={(e) => sortProducts(e.target.value)}
              className="sort-select"
            >
              <option value="none">Sin ordenar</option>
              <option value="name">Nombre (A-Z)</option>
              <option value="price-asc">Precio (menor a mayor)</option>
              <option value="price-desc">Precio (mayor a menor)</option>
              <option value="date-newest">Fecha (más reciente primero)</option>
              <option value="date-oldest">Fecha (más antigua primero)</option>
              <option value="category">Categoría</option>
            </select>
          </div>

          {uniqueCategories.length > 0 && (
            <div className="filter-controls">
              <label>Filtrar por categoría: </label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="filter-select"
              >
                <option value="all">Todas las categorías</option>
                {uniqueCategories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {products.length === 0 ? (
          <p className="empty-message">No hay productos en la lista</p>
        ) : (
          <ul>
            {getFilteredProducts().map((product) => (
              <li key={product.id} className="product-item">
                <div className="product-info">
                  <strong>{product.name}</strong>
                  <br />${product.price.toFixed(2)}
                  <br />
                  <span className="product-date">Fecha: {product.date}</span>
                  {product.storeName && (
                    <span className="product-store">
                      <br />
                      Tienda: {product.storeName}
                    </span>
                  )}
                  {product.categoryName && (
                    <span className="product-category">
                      <br />
                      Categoría: {product.categoryName}
                    </span>
                  )}
                  <br />
                  <small className="product-id">
                    ID: {product.id.substring(0, 8)}...
                  </small>
                </div>
                <button
                  className="delete-button"
                  onClick={() => handleDelete(product.id)}
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        )}
        <div className="total-value">Valor Total: ${total.toFixed(2)}</div>
      </div>
    </>
  );
};