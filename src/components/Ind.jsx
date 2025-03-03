import { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import "./ind.css";

const SalesSimulator = () => {
    const [month, setMonth] = useState("");
    const [salesAmount, setSalesAmount] = useState("");
    const [chartType, setChartType] = useState("bar");
    const [salesData, setSalesData] = useState([]);
    const chartRef = useRef(null);
    let chartInstance = useRef(null);

    // Cargar datos guardados en localStorage al inicio
    useEffect(() => {
        const storedData = JSON.parse(localStorage.getItem("salesData")) || [];
        setSalesData(storedData);
    }, []);

    // Guardar datos en localStorage cuando cambian
    useEffect(() => {
        localStorage.setItem("salesData", JSON.stringify(salesData));
        updateChart();
    }, [salesData, chartType]);

    // Manejo del formulario
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!month || isNaN(salesAmount) || salesAmount <= 0) {
            alert("Por favor, ingrese un mes y un monto válido.");
            return;
        }

        // Actualizar datos de ventas
        setSalesData((prevData) => {
            const existingIndex = prevData.findIndex((entry) => entry.month === month);
            if (existingIndex !== -1) {
                prevData[existingIndex].salesAmount = parseFloat(salesAmount);
                return [...prevData];
            } else {
                return [...prevData, { month, salesAmount: parseFloat(salesAmount) }];
            }
        });

        // Reiniciar inputs
        setMonth("");
        setSalesAmount("");
    };

    // Crear/Actualizar gráfico
    const updateChart = () => {
        if (chartInstance.current) {
            chartInstance.current.destroy();
        }

        const ctx = chartRef.current.getContext("2d");
        chartInstance.current = new Chart(ctx, {
            type: chartType,
            data: {
                labels: salesData.map((entry) => entry.month),
                datasets: [
                    {
                        label: "Ventas Mensuales",
                        data: salesData.map((entry) => entry.salesAmount),
                        backgroundColor: colors.background.slice(0, salesData.length), // Aplica colores
                        borderColor: colors.border.slice(0, salesData.length),         // Aplica bordes
                        borderWidth: 1
                    },
                ],
            },
            options: {
                responsive: true,
                scales: {
                    y: { beginAtZero: true },
                },
                plugins: {
                    datalabels: {
                        display: chartType === "pie",
                        color: "#333",
                        font: { weight: "bold", size: 14 },
                        formatter: (value, context) => {
                            const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                            return ((value / total) * 100).toFixed(2) + "%";
                        },
                    },
                },
            },
            plugins: [ChartDataLabels],
        });
    };

    // Resetear gráfico y datos
    const resetChart = () => {
        setSalesData([]);
        localStorage.removeItem("salesData");
    };
//
    return (
        <div className="container">
            <form onSubmit={handleSubmit} className="form">
                <h1>Simulador de Ventas Mensuales</h1>
                {/* Selección de mes */}
                <label>Selecciona un mes:</label>
                <select value={month} onChange={(e) => setMonth(e.target.value)} className="inputForm">
                    <option value="" disabled>Selecciona un mes</option>
                    {["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"].map((m) => (
                        <option key={m} value={m}>{m}</option>
                    ))}
                </select>

                {/* Input para ventas */}
                <label>Ingresa el monto de ventas:</label>
                <input type="number" placeholder="Cantidad" value={salesAmount} onChange={(e) => setSalesAmount(e.target.value)} className="inputForm" />

                {/* Botón para agregar datos */}
                <button type="submit" className="button-submit">Agregar cantidad de venta</button>

                {/* Selección del tipo de gráfico */}
                <label>Selecciona el tipo de gráfico:</label>
                <select value={chartType} onChange={(e) => setChartType(e.target.value)} className="inputForm">
                    <option value="bar">Barras</option>
                    <option value="line">Líneas</option>
                    <option value="pie">Pastel</option>
                </select>

                {/* Contenedor del gráfico */}
                <div className="chart-container">
                    <canvas ref={chartRef} width="100%"></canvas>
                </div>

                {/* Botón para resetear gráfico */}
                <button type="button" onClick={resetChart} className="button-submit">Resetear Gráfico</button>
            </form>U

        </div>
    );
};
const colors = {
    background: [
        'rgba(75, 192, 192, 0.2)',  // Verde agua
        'rgba(255, 99, 132, 0.2)',   // Rosa
        'rgba(54, 162, 235, 0.2)',   // Azul
        'rgba(255, 206, 86, 0.2)',   // Amarillo
        'rgba(153, 102, 255, 0.2)',  // Morado
        'rgba(255, 159, 64, 0.2)',   // Naranja
    ],
    border: [
        'rgba(75, 192, 192, 1)',     // Verde agua
        'rgba(255, 99, 132, 1)',     // Rosa
        'rgba(54, 162, 235, 1)',     // Azul
        'rgba(255, 206, 86, 1)',     // Amarillo
        'rgba(153, 102, 255, 1)',    // Morado
        'rgba(255, 159, 64, 1)',     // Naranja
    ]
};
export default SalesSimulator;
