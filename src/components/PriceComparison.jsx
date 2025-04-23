// src/components/PriceComparison.jsx
import React, { useContext, useState, useMemo, useEffect } from 'react';
import { ContextMarket } from '../Context/Context';
// Puedes añadir estilos específicos si lo deseas
// import '../Styles/PriceComparison.css';

export const PriceComparison = () => {
    const { products } = useContext(ContextMarket);
    const [selectedProductKey, setSelectedProductKey] = useState(''); // Estado para el producto seleccionado
    const [comparisonData, setComparisonData] = useState(null); // Estado para los datos de comparación

    // 1. Identificar tipos de productos únicos (usando useMemo para eficiencia)
    const uniqueProductTypes = useMemo(() => {
        const uniqueKeys = new Set();
        const types = [];

        products.forEach(product => {
            // Crear una clave única combinando nombre, marca (opcional) y unidad
            // Convertir a minúsculas para evitar duplicados por capitalización
            const key = `${product.name.toLowerCase()}|${product.brand?.toLowerCase() || ''}|${product.unit.toLowerCase()}`;

            if (!uniqueKeys.has(key)) {
                uniqueKeys.add(key);
                types.push({
                    key: key, // Guardamos la clave para referencia
                    name: product.name,
                    brand: product.brand || '', // Asegurar que brand exista
                    unit: product.unit,
                    // Texto descriptivo para el dropdown
                    displayText: `${product.name} ${product.brand ? `(${product.brand})` : ''} - ${product.unit}`
                });
            }
        });

        // Ordenar alfabéticamente para el dropdown
        types.sort((a, b) => a.displayText.localeCompare(b.displayText));

        return types;
    }, [products]); // Recalcular solo si la lista de productos cambia

    // 2. Calcular datos de comparación cuando se selecciona un producto
    useEffect(() => {
        if (!selectedProductKey) {
            setComparisonData(null); // Limpiar si no hay selección
            return;
        }

        // Encontrar todas las compras del producto seleccionado
        const selectedProductEntries = products.filter(product => {
            const key = `${product.name.toLowerCase()}|${product.brand?.toLowerCase() || ''}|${product.unit.toLowerCase()}`;
            return key === selectedProductKey;
        });

        // Agrupar por mes y año
        const monthlyData = {}; // Objeto para { 'YYYY-MM': { prices: [], count: 0, total: 0 } }

        selectedProductEntries.forEach(entry => {
            const date = new Date(entry.timestamp);
            const year = date.getFullYear();
            // getMonth() es 0-indexado, sumar 1 y asegurar dos dígitos con padStart
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const monthKey = `${year}-${month}`;

            if (!monthlyData[monthKey]) {
                monthlyData[monthKey] = { prices: [], count: 0, total: 0 };
            }

            monthlyData[monthKey].prices.push(entry.price);
            monthlyData[monthKey].count += 1;
            monthlyData[monthKey].total += entry.price;
        });

        // Calcular promedio y formatear para mostrar
        const formattedData = Object.entries(monthlyData)
            .map(([monthKey, data]) => ({
                month: monthKey, // 'YYYY-MM'
                averagePrice: data.total / data.count,
                minPrice: Math.min(...data.prices),
                maxPrice: Math.max(...data.prices),
                purchaseCount: data.count
            }))
            .sort((a, b) => a.month.localeCompare(b.month)); // Ordenar por mes

        setComparisonData(formattedData);

    }, [selectedProductKey, products]); // Recalcular si cambia el producto seleccionado o la lista general

    return (
        <div className="price-comparison-container" style={styles.container}> {/* Añade estilos si quieres */}
            <h2>Comparar Precios por Mes</h2>

            {uniqueProductTypes.length > 0 ? (
                <>
                    {/* 3. Dropdown para seleccionar producto */}
                    <div style={styles.selectorContainer}>
                        <label htmlFor="productSelector" style={styles.label}>Selecciona un producto:</label>
                        <select
                            id="productSelector"
                            value={selectedProductKey}
                            onChange={(e) => setSelectedProductKey(e.target.value)}
                            style={styles.select}
                        >
                            <option value="">-- Elige un producto --</option>
                            {uniqueProductTypes.map(type => (
                                <option key={type.key} value={type.key}>
                                    {type.displayText}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* 4. Mostrar resultados de comparación */}
                    {comparisonData && comparisonData.length > 0 ? (
                        <div style={styles.resultsContainer}>
                            <h3>Historial de Precios para: {uniqueProductTypes.find(p => p.key === selectedProductKey)?.displayText}</h3>
                            <table style={styles.table}>
                                <thead>
                                    <tr>
                                        <th style={styles.th}>Mes (Año-Mes)</th>
                                        <th style={styles.th}>Precio Promedio</th>
                                        <th style={styles.th}>Precio Mínimo</th>
                                        <th style={styles.th}>Precio Máximo</th>
                                        <th style={styles.th}>Nº Compras</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {comparisonData.map(data => (
                                        <tr key={data.month}>
                                            <td style={styles.td}>{data.month}</td>
                                            <td style={styles.td}>${data.averagePrice.toFixed(2)}</td>
                                            <td style={styles.td}>${data.minPrice.toFixed(2)}</td>
                                            <td style={styles.td}>${data.maxPrice.toFixed(2)}</td>
                                            <td style={styles.td}>{data.purchaseCount}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : selectedProductKey ? (
                        <p style={styles.message}>No hay suficientes datos históricos para este producto.</p>
                    ) : (
                         <p style={styles.message}>Selecciona un producto para ver su historial de precios.</p>
                    )}
                </>
            ) : (
                <p style={styles.message}>No hay productos en la lista para comparar.</p>
            )}
        </div>
    );
};

// Estilos básicos (puedes moverlos a un CSS)
const styles = {
    container: { padding: '20px', maxWidth: '800px', margin: '20px auto', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' },
    selectorContainer: { marginBottom: '25px' },
    label: { marginRight: '10px', fontWeight: '500' },
    select: { padding: '8px 12px', minWidth: '300px', borderRadius: '4px', border: '1px solid #ccc' },
    resultsContainer: { marginTop: '20px' },
    table: { width: '100%', borderCollapse: 'collapse', marginTop: '15px' },
    th: { background: '#f2f2f2', padding: '10px', border: '1px solid #ddd', textAlign: 'left' },
    td: { padding: '10px', border: '1px solid #ddd', textAlign: 'left' },
    message: { fontStyle: 'italic', color: '#666', marginTop: '20px' }
};

