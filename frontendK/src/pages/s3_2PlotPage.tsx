import React, { useState, useEffect } from "react";
import createPlotlyComponent from "react-plotly.js/factory";
import Plotly from "plotly.js-dist-min";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const Plot = createPlotlyComponent(Plotly);

const S3_2PlotPage: React.FC = () => {
    const navigate = useNavigate();
    const [params, setParams] = useState({
        n: 8,
        To: 273,
        Ts: 373,
        alpha: 1e-5,
        L: 5,
    });
    const [tau, setTau] = useState(0.5);
    const [data, setData] = useState<{ X: number[]; T_coll: number[]; T_anal: number[] } | null>(null);
    const [loading, setLoading] = useState(false);

    const backendURL = "http://127.0.0.1:8000/compute_temp"; // backend endpoint

    const fetchData = async (tauVal: number) => {
        setLoading(true);
        try {
            const res = await fetch(backendURL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    tau: tauVal,
                    ...params,
                }),
            });
            const json = await res.json();
            setData(json);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch once on load
    useEffect(() => {
        fetchData(tau);
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setParams((prev) => ({ ...prev, [name]: parseFloat(value) }));
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">3.2 Dynamic Temperature Plot (Collocation)</h2>
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-blue-400 hover:text-blue-200 mb-6"
            >
                <ArrowLeft size={18} />
                Back to Assignment
            </button>
            {/* Parameter Inputs */}
            <div className="grid grid-cols-2 gap-4 mb-4">
                {Object.entries(params).map(([key, value]) => (
                    <div key={key}>
                        <label className="block font-medium">{key}</label>
                        <input
                            type="number"
                            name={key}
                            value={value}
                            onChange={handleInputChange}
                            className="border p-2 w-full bg-gray-900 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            step="any"
                        />
                    </div>
                ))}
            </div>

            {/* Tau Slider */}
            <div className="mb-4">
                <label className="block font-medium">τ (tau): {tau.toFixed(2)}</label>
                <input
                    type="range"
                    min="0.5"
                    max="10000"
                    step="0.5"
                    value={tau}
                    onChange={(e) => {
                        const newTau = parseFloat(e.target.value);
                        setTau(newTau);
                        fetchData(newTau);
                    }}
                    className="w-full"
                />
            </div>

            {/* Run Button */}
            <button
                onClick={() => fetchData(tau)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                Run
            </button>

            {/* Plot */}
            <div className="mt-6">
                {loading ? (
                    <p>Computing...</p>
                ) : data ? (
                    <Plot
                        data={[
                            {
                                x: data.X,
                                y: data.T_coll,
                                mode: "lines",
                                name: "Collocation (Numerical)",
                                line: { color: "blue" },
                            },
                            {
                                x: data.X,
                                y: data.T_anal,
                                mode: "lines",
                                name: "Analytical (erf)",
                                line: { color: "red", dash: "dash" },
                            },
                        ]}
                        layout={{
                            title: {
                                text: `Temperature Profiles for τ = ${tau.toFixed(2)} s`,
                            },
                            xaxis: { title: { text: "X (m)" } },
                            yaxis: { title: { text: "Temperature (K)" } },
                            height: 500,
                        } as Partial<Plotly.Layout>}
                        style={{ width: "100%" }}
                    />
                ) : (
                    <p>No data yet.</p>
                )}
            </div>
        </div>
    );
};
export default S3_2PlotPage;