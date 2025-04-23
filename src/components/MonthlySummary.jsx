// src/components/MonthlySummary.jsx
import React, { useContext, useMemo } from 'react';
import { ContextMarket } from '../Context/Context';

export const MonthlySummary = () => {
    const { products } = useContext(ContextMarket);

    // 1. Calcular gastos totales por mes (usando useMemo para eficiencia)
    const monthlySummaryData = useMemo(() => {
        const monthlyTotals = {}; // Objeto para { 'YYYY-MM': totalAmount }

        products.forEach(product => {
            const date = new Date(product.timestamp);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0'); // Mes 01-12
            const monthKey = `${year}-${month}`;

            if (!monthlyTotals[monthKey]) {
                monthlyTotals[monthKey] = 0;
            }

            monthlyTotals[monthKey] += product.price; // Sumar el precio del producto
        });

        // Convertir a array y ordenar por mes
        const formattedData = Object.entries(monthlyTotals)
            .map(([monthKey, total]) => ({
                month: monthKey,
                totalSpent: total
            }))
            .sort((a, b) => a.month.localeCompare(b.month)); // Ordenar cronológicamente

        return formattedData;
    }, [products]); // Recalcular solo si la lista de productos cambia

    // 2. Calcular el gasto total general
    const overallTotal = useMemo(() => {
        return monthlySummaryData.reduce((sum, monthData) => sum + monthData.totalSpent, 0);
    }, [monthlySummaryData]);

    return (
        <div className="monthly-summary-container" style={styles.container}>
            <h2>Resumen de Gastos Mensuales</h2>

            {monthlySummaryData.length > 0 ? (
                <>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>Mes (Año-Mes)</th>
                                <th style={styles.th}>Gasto Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {monthlySummaryData.map(data => (
                                <tr key={data.month}>
                                    <td style={styles.td}>{data.month}</td>
                                    <td style={styles.td}>${data.totalSpent.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td style={{...styles.td, ...styles.totalLabel}}><strong>Total General:</strong></td>
                                <td style={{...styles.td, ...styles.totalValue}}><strong>${overallTotal.toFixed(2)}</strong></td>
                            </tr>
                        </tfoot>
                    </table>
                </>
            ) : (
                <p style={styles.message}>No hay datos de gastos para mostrar.</p>
            )}
        </div>
    );
};

// Estilos básicos (puedes moverlos a un CSS)
const styles = {
    container: { padding: '20px', maxWidth: '600px', margin: '20px auto', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' },
    table: { width: '100%', borderCollapse: 'collapse', marginTop: '15px' },
    th: { background: '#f2f2f2', padding: '12px', border: '1px solid #ddd', textAlign: 'left' },
    td: { padding: '12px', border: '1px solid #ddd', textAlign: 'left' },
    totalLabel: { textAlign: 'right', fontWeight: 'bold' },
    totalValue: { fontWeight: 'bold', fontSize: '1.1em' },
    message: { fontStyle: 'italic', color: '#666', marginTop: '20px', textAlign: 'center' }
};
