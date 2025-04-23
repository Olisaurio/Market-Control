import React, { useContext, useState, useMemo } from 'react';
import { ContextMarket } from '../Context/Context';
import { useAuth } from '../Context/AuthContext';
import '../Styles/ListProducts.css';

export const ListProducts = () => {
    const {
        products,
        SetProducts,
        setEditingProduct,
        categories
    } = useContext(ContextMarket);

    const { currentUser } = useAuth(); // Obtener el usuario actual

    const [sortCriteria, setSortCriteria] = useState('timestamp_desc');
    const [filterName, setFilterName] = useState('');
    const [filterBrand, setFilterBrand] = useState('');
    const [filterCategory, setFilterCategory] = useState('');

    const [showInactive, setShowInactive] = useState(false);

    const filteredAndSortedProducts = useMemo(() => {
        console.log("Recalculando lista filtrada/ordenada (con inactivos)...\nUsuario actual:", currentUser?.uid); // Log para depuración

        let result = products.filter(product => product.userId === currentUser?.uid);

        if (!showInactive) {
            result = result.filter(product => product.isActive !== false);
        }

        if (filterName) {
            const lowerCaseFilterName = filterName.toLowerCase();
            result = result.filter(product =>
                product.name.toLowerCase().includes(lowerCaseFilterName)
            );
        }
        if (filterBrand) {
            const lowerCaseFilterBrand = filterBrand.toLowerCase();
            result = result.filter(product =>
                product.brand && product.brand.toLowerCase().includes(lowerCaseFilterBrand)
            );
        }
        if (filterCategory) {
            result = result.filter(product => product.categoryId == filterCategory);
        }

        switch (sortCriteria) {
            case 'name_asc':
                result.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'name_desc':
                result.sort((a, b) => b.name.localeCompare(a.name));
                break;
            case 'price_asc':
                result.sort((a, b) => a.price - b.price);
                break;
            case 'price_desc':
                result.sort((a, b) => b.price - a.price);
                break;
            case 'timestamp_asc':
                result.sort((a, b) => a.timestamp - b.timestamp);
                break;
            case 'timestamp_desc':
            default:
                result.sort((a, b) => b.timestamp - a.timestamp);
                break;
        }

        return result;
    }, [products, sortCriteria, filterName, filterBrand, filterCategory, showInactive, currentUser]);


    const handleToggleActive = (id) => {
        const updatedProducts = products.map(product => {
            if (product.id === id) {
                return { ...product, isActive: !(product.isActive ?? true) };
            }
            return product;
        });
        SetProducts(updatedProducts);
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        alert("Editando producto. Ve a la sección 'Añadir Producto' para modificarlo.");
    };

    return (
        <div className="list-products-container">
            <h2>Lista de Productos</h2>

            {currentUser && (
                 <div className="filter-sort-controls">
                    <div className="filter-controls">
                        <label htmlFor="filterName">Nombre:</label>
                        <input type="text" id="filterName" className="filter-input" placeholder="Buscar por nombre..." value={filterName} onChange={(e) => setFilterName(e.target.value)} />
                    </div>
                    <div className="filter-controls">
                        <label htmlFor="filterBrand">Marca:</label>
                        <input type="text" id="filterBrand" className="filter-input" placeholder="Buscar por marca..." value={filterBrand} onChange={(e) => setFilterBrand(e.target.value)} />
                    </div>
                    <div className="filter-controls">
                        <label htmlFor="filterCategory">Categoría:</label>
                        <select id="filterCategory" className="filter-select" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
                            <option value="">-- Todas --</option>
                            {categories.map(category => (<option key={category.id} value={category.id}>{category.name}</option>))}
                        </select>
                    </div>

                     <div className="sort-controls">
                        <label htmlFor="sortCriteria">Ordenar por:</label>
                        <select id="sortCriteria" className="sort-select" value={sortCriteria} onChange={(e) => setSortCriteria(e.target.value)}>
                            <option value="timestamp_desc">Más Recientes</option>
                            <option value="timestamp_asc">Más Antiguos</option>
                            <option value="name_asc">Nombre (A-Z)</option>
                            <option value="name_desc">Nombre (Z-A)</option>
                            <option value="price_asc">Precio (Menor a Mayor)</option>
                            <option value="price_desc">Precio (Mayor a Menor)</option>
                        </select>
                    </div>

                    <div className="filter-controls" style={{ flexGrow: 0 }}>
                        <label htmlFor="showInactive" style={{ cursor: 'pointer' }}>Mostrar inactivos:</label>
                        <input
                            type="checkbox"
                            id="showInactive"
                            checked={showInactive}
                            onChange={(e) => setShowInactive(e.target.checked)}
                            style={{ cursor: 'pointer', width: '18px', height: '18px' }}
                        />
                    </div>
                </div>
            )}


            {!currentUser ? (
                 <p className="empty-message">Inicia sesión para ver tus productos.</p>
            ) : filteredAndSortedProducts.length > 0 ? (
                <ul>
                    {filteredAndSortedProducts.map(product => (
                        <li key={product.id} className={`product-item ${product.isActive === false ? 'inactive-product' : ''}`}>
                            <div className="product-info">
                                <strong>{product.name}</strong>
                                {product.brand && <span className="product-brand">Marca: {product.brand}</span>}
                                <span className="product-price">Precio: ${product.price.toFixed(2)} ({product.unit})</span>
                                {product.categoryName && <span className="product-category">Categoría: {product.categoryName}</span>}
                                <span className="product-date">Agregado: {product.date}</span>
                                {product.isActive === false && <span style={{ color: 'grey', fontStyle: 'italic', display: 'block' }}>(Inactivo)</span>}
                            </div>
                            <div className="product-actions">
                                <button onClick={() => handleEdit(product)} className="edit-button" title="Editar"></button>
                                <button
                                    onClick={() => handleToggleActive(product.id)}
                                    className={`toggle-active-button ${product.isActive === false ? 'activate' : 'deactivate'}`}
                                    title={product.isActive === false ? 'Activar producto' : 'Desactivar producto'}
                                >
                                    {product.isActive === false ? '🔄' : '➖'}
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="empty-message">
                    {products.length > 0 && !filteredAndSortedProducts.length && "No hay productos que coincidan con los filtros para este usuario."}
                    {products.length === 0 && "No has agregado ningún producto todavía."}
                </p>
            )}
        </div>
    );
};
