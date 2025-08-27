import React from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, PointElement, CategoryScale, LinearScale } from "chart.js";
ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale);

export default function PetOverview({ pesoAtual, historicoPesos }) {
    // Ordena o histórico de pesos por dataRegistro
    const historicoOrdenado = [...historicoPesos].sort(
        (a, b) => new Date(a.dataRegistro) - new Date(b.dataRegistro)
    );

    // Extrai pesos e datas do histórico
    const pesos = historicoOrdenado.map(peso => peso.peso);
    const labels = historicoOrdenado.map(peso =>
        new Date(peso.dataRegistro).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        })
    );

    // Adiciona o peso atual, se diferente do último registro
    if (pesoAtual !== null && pesoAtual !== undefined && (pesos.length === 0 || pesoAtual !== pesos[pesos.length - 1])) {
        pesos.push(pesoAtual);
        labels.push(`Peso Atual (${new Date().toLocaleDateString("pt-BR")})`);
    }

    // Dados do gráfico
    const data = {
        labels,
        datasets: [
            {
                label: "Peso (kg)",
                data: pesos,
                backgroundColor: "rgba(75,192,192,0.2)",
                borderColor: "rgba(75,192,192,1)",
                borderWidth: 4,
                tension: 0.4,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: true,
            },
        },
        scales: {
            y: {
                beginAtZero: false,
                min: Math.min(...pesos) - 2 > 0 ? Math.min(...pesos) - 2 : 0, // 2kg abaixo do menor peso
                
            },
        },
    };

    return (
        <div className="bg-white p-4 rounded-md shadow-md mb-5">
            <div>
                <h3 className="text-xl font-semibold mb-4">Histórico de Pesos</h3>
                <Line data={data} options={options} />
            </div>
        </div>
    );
}