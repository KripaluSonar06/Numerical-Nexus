import React, { useEffect, useRef, useState } from "react";
import Plotly from "plotly.js-dist-min";
import type { Layout } from "plotly.js";

const API_URL = "http://127.0.0.1:8000/compute_temp";

const TauSlider: React.FC = () => {
    const [tau, setTau] = useState(0.5);
    const plotRef = useRef<HTMLDivElement>(null);

    async function fetchTemperatureData(tau: number) {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ tau }),
        });
        return response.json();
    }

    async function updatePlot(tau: number) {
        const data = await fetchTemperatureData(tau);
        if (!plotRef.current) return;

        const traceCollocation: Partial<Plotly.ScatterData> = {
            type: "scatter",
            mode: "lines",
            x: data.X,
            y: data.T_coll,
            name: "Collocation (Numerical)",
            line: { color: "blue", dash: "dot", width: 2, shape: "linear"  },
        };

        const traceAnalytical: Partial<Plotly.ScatterData> = {
            type: "scatter",
            mode: "lines",
            x: data.X,
            y: data.T_anal,
            name: "Analytical (erf)",
            line: { color: "red", dash: "solid", width: 2, shape: "linear"  },
        };

        const layout: Partial<Layout> = {
            title: { text: `Temperature vs Position for τ = ${tau.toFixed(2)} s` },
            xaxis: { title: { text: "Position X (m)" } },
            yaxis: { title: { text: "Temperature T (K)" } },
            paper_bgcolor: "#0d1117",
            plot_bgcolor: "#0d1117",
            font: { color: "#c9d1d9" },
            legend: { x: 0.7, y: 1.1, orientation: "h" },
        };

        Plotly.react(plotRef.current, [traceAnalytical, traceCollocation], layout);
    }


    useEffect(() => {
        updatePlot(tau);
    }, [tau]);

    return (
        <div className="flex flex-col items-center bg-[#0d1117] min-h-screen text-[#c9d1d9] p-6">
            <h2 className="text-2xl font-semibold mb-2">
                Temperature vs Position (τ adjustable)
            </h2>
            <p className="mb-2">
                τ = <span className="font-mono">{tau.toFixed(2)}</span> s
            </p>
            <input
                type="range"
                min="0.5"
                max="10000"
                step="10"
                value={tau}
                onChange={(e) => setTau(parseFloat(e.target.value))}
                className="w-1/2 accent-blue-400 mb-6"
            />
            <div ref={plotRef} className="w-4/5 h-[70vh]" />
        </div>
    );
};

export default TauSlider;
