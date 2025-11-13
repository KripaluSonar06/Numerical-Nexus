import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Plot from "react-plotly.js";


const S3_2PlotPage: React.FC = () => {
    const navigate = useNavigate();
    const [params, setParams] = useState({
        n: 1,
        To: 273,
        Ts: 373,
        alpha: 5e-4,
        L: 5,
    });
    const [tau, setTau] = useState(0.0);
    const [data, setData] = useState<{ X: number[]; T_coll: number[]; T_anal: number[] } | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const backendURL = "http://127.0.0.1:8000/compute_temp";

    const fetchData = async (tauVal: number) => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(backendURL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    tau: tauVal,
                    ...params,
                }),
            });
            
            if (!res.ok) {
                throw new Error(`HTTP ${res.status}`);
            }
            
            const json = await res.json();
            console.log("Backend response:", json);
            
            // Validate data structure
            if (json.X && json.T_coll && json.T_anal) {
                setData(json);
            } else {
                setError("Invalid data format from backend");
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            setError(`Error: ${error instanceof Error ? error.message : "Unknown error"}`);
        } finally {
            setLoading(false);
        }
    };

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

            {/* Plot Section */}
            <div className="mb-6 border border-gray-700 rounded p-4">
                {loading && <p className="text-yellow-400">Computing...</p>}
                {error && <p className="text-red-500">{error}</p>}
                {data && !loading ? (
                    // <Plot></Plot>
                    <Plot
                        data={[
                            {
                                x: data.X,
                                y: data.T_anal,
                                mode: "lines",
                                name: "Analytical (erf)",
                                line: { color: "red", width: 5 },
                            },
                            {
                                x: data.X,
                                y: data.T_coll,
                                mode: "lines",
                                name: "Collocation (Numerical)",
                                line: { color: "blue", dash: "dot", width: 3 },
                            },
                        ]}
                        layout={{
                            title: {
                                text: `Temperature Profiles for τ = ${tau.toFixed(2)} s`,
                            },
                            xaxis: { title: { text: "X (m)" } },
                            yaxis: { title: { text: "Temperature (K)" } },
                            plot_bgcolor: "#f0f0f0",
                            paper_bgcolor: "#ffffff",
                            height: 500,
                        } as any}
                        config={{ responsive: true }}
                    />
                ) : (
                    !loading && <p className="text-gray-400">No data yet. Click Run or adjust τ.</p>
                )}
            </div>

            {/* Tau Slider */}
            <div className="mb-4">
                <label className="block font-medium">τ (tau): {tau.toFixed(2)}</label>
                <input
                    type="range"
                    min="0.0"
                    max="10000.0"
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

            {/* Parameter Inputs */}
            <div className="grid grid-cols-2 gap-4 mb-4">
                {Object.entries(params).map(([key, value]) => (
                    <div key={key}>
                        <label className="block font-medium text-sm">{key}</label>
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

            {/* Run Button */}
            <button
                onClick={() => fetchData(tau)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
                Run
            </button>
        </div>
    );
};

export default S3_2PlotPage;