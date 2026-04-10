import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

Chart.register(...registerables);

const CompareWithOthers = () => {
    const { handle1, handle2 } = useParams();
    const [user1Data, setUser1Data] = useState(null);
    const [user2Data, setUser2Data] = useState(null);
    const [user1ContestData, setUser1ContestData] = useState(null);
    const [user2ContestData, setUser2ContestData] = useState(null);
    const [user1IndexData, setUser1IndexData] = useState(null);
    const [user2IndexData, setUser2IndexData] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [res1, res2, contestRes1, contestRes2, indexRes1, indexRes2] = await Promise.all([
                    axios.get(`${import.meta.env.VITE_API_BASE_URL}/codeforces/performance/${handle1}`),
                    axios.get(`${import.meta.env.VITE_API_BASE_URL}/codeforces/performance/${handle2}`),
                    axios.get(`${import.meta.env.VITE_API_BASE_URL}/codeforces/contestPerformance/${handle1}`),
                    axios.get(`${import.meta.env.VITE_API_BASE_URL}/codeforces/contestPerformance/${handle2}`),
                    axios.get(`${import.meta.env.VITE_API_BASE_URL}/codeforces/contestIdPerformance/${handle1}`),
                    axios.get(`${import.meta.env.VITE_API_BASE_URL}/codeforces/contestIdPerformance/${handle2}`)
                ]);
                setUser1Data(res1.data);
                setUser2Data(res2.data);
                setUser1ContestData(contestRes1.data);
                setUser2ContestData(contestRes2.data);
                setUser1IndexData(indexRes1.data.IndexCount || {});
                setUser2IndexData(indexRes2.data.IndexCount || {});
            } catch (err) {
                setError("Error fetching data.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [handle1, handle2]);

    return (
        <div className="min-h-screen flex flex-col items-center p-8 relative overflow-hidden">
            <h1 className="text-4xl font-bold text-emerald-600 mb-10 tracking-wide mt-10">
                Comparing <span className="text-gray-800">{handle1}</span> vs <span className="text-gray-800">{handle2}</span>
            </h1>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            {loading ? (
                <div className="w-full max-w-7xl flex flex-col items-center space-y-10">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="glass-card p-8 w-full">
                            <Skeleton height={40} width={300} baseColor="#f0f0f0" highlightColor="#e0e0e0" className="mb-6 rounded-md" />
                            <Skeleton height={350} baseColor="#f0f0f0" highlightColor="#e0e0e0" className="rounded-xl" />
                        </div>
                    ))}
                </div>
            ) : (
                user1Data && user2Data && user1ContestData && user2ContestData && (
                    <div className="w-full max-w-7xl flex flex-col items-center">

                        <div className="glass-card p-8 w-full mb-10">
                            <h3 className="text-2xl font-bold text-blue-600 mb-6 border-b border-gray-200 pb-2">Problems Solved by Rating</h3>
                            <div className="w-full h-96">
                                <Bar
                                    data={{
                                        labels: Object.keys(user1Data["problems count"] || {}),
                                        datasets: [
                                            {
                                                label: handle1,
                                                data: Object.values(user1Data["problems count"] || {}),
                                                backgroundColor: "rgba(76, 175, 80, 0.6)",
                                            },
                                            {
                                                label: handle2,
                                                data: Object.values(user2Data["problems count"] || {}),
                                                backgroundColor: "rgba(255, 99, 132, 0.6)",
                                            },
                                        ],
                                    }}
                                    options={{ responsive: true, maintainAspectRatio: false }}
                                />
                            </div>
                        </div>

                        <div className="glass-card p-8 w-full mb-10">
                            <h3 className="text-2xl font-bold text-blue-600 mb-8 border-b border-gray-200 pb-2">Programming Language Usage</h3>
                            <div className="w-full flex flex-wrap justify-center gap-16">
                                <div className="w-80 h-80">
                                    <h4 className="text-lg font-semibold text-center">{handle1}</h4>
                                    <Doughnut
                                        data={{
                                            labels: Object.keys(user1Data.languageUsage || {}),
                                            datasets: [
                                                {
                                                    label: handle1,
                                                    data: Object.values(user1Data.languageUsage || {}),
                                                    backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
                                                },
                                            ],
                                        }}
                                    />
                                </div>
                                <div className="w-80 h-80">
                                    <h4 className="text-lg font-semibold text-center">{handle2}</h4>
                                    <Doughnut
                                        data={{
                                            labels: Object.keys(user2Data.languageUsage || {}),
                                            datasets: [
                                                {
                                                    label: handle2,
                                                    data: Object.values(user2Data.languageUsage || {}),
                                                    backgroundColor: ["#FF9AA2", "#87CEEB", "#FFD700"],
                                                },
                                            ],
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="glass-card p-8 w-full mb-10">
                            <h3 className="text-2xl font-bold text-blue-600 mb-8 border-b border-gray-200 pb-2">Contest Performance Comparison</h3>

                            <div className="flex flex-col items-center w-full">
                                <div className="w-full lg:w-3/4 h-80 mb-12">
                                    <h4 className="text-lg font-semibold text-center text-gray-700 mb-4">Total Contests Participated</h4>
                                    <Bar
                                        data={{
                                            labels: ["Total Contests"],
                                            datasets: [
                                                {
                                                    label: handle1,
                                                    data: [user1ContestData.totalContests],
                                                    backgroundColor: "rgba(54, 162, 235, 0.6)",
                                                },
                                                {
                                                    label: handle2,
                                                    data: [user2ContestData.totalContests],
                                                    backgroundColor: "rgba(255, 159, 64, 0.6)",
                                                },
                                            ],
                                        }}
                                    />
                                </div>

                                <div className="w-full lg:w-3/4 h-80 mb-12">
                                    <h4 className="text-lg font-semibold text-center text-gray-700 mb-4">Performance in the Last 10 Contests</h4>
                                    <Line
                                        data={{
                                            labels: Array.from({ length: 10 }, (_, i) => `Contest ${i + 1}`),
                                            datasets: [
                                                {
                                                    label: handle1,
                                                    data: user1ContestData.ratings.slice(-10) || [],
                                                    borderColor: "rgba(54, 162, 235, 1)",
                                                    backgroundColor: "rgba(54, 162, 235, 0.2)",
                                                },
                                                {
                                                    label: handle2,
                                                    data: user2ContestData.ratings.slice(-10) || [],
                                                    borderColor: "rgba(255, 159, 64, 1)",
                                                    backgroundColor: "rgba(255, 159, 64, 0.2)",
                                                },
                                            ],
                                        }}
                                    />
                                </div>

                                <div className="w-full lg:w-3/4 grid grid-cols-2 gap-8 mb-4">
                                    {["worstRank", "bestRank", "maxRatingDrop", "maxRatingIncrease"].map((metric, index) => (
                                        <div key={index} className="w-full h-64 bg-white shadow-sm p-4 rounded-xl border border-gray-200">
                                            <h4 className="text-lg font-semibold text-center text-gray-800 mb-4">
                                                {metric.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                                            </h4>
                                            <Bar
                                                data={{
                                                    labels: [metric],
                                                    datasets: [
                                                        {
                                                            label: handle1,
                                                            data: [user1ContestData[metric]],
                                                            backgroundColor: "rgba(54, 162, 235, 0.6)",
                                                        },
                                                        {
                                                            label: handle2,
                                                            data: [user2ContestData[metric]],
                                                            backgroundColor: "rgba(255, 159, 64, 0.6)",
                                                        },
                                                    ],
                                                }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="glass-card p-8 w-full mb-10">
                            <h3 className="text-2xl font-bold text-blue-600 mb-6 border-b border-gray-200 pb-2">Problem Index Count Comparison</h3>
                            <div className="w-full h-96">
                                <Bar
                                    data={{
                                        labels: Object.keys(user1IndexData || {}),
                                        datasets: [
                                            {
                                                label: handle1,
                                                data: Object.values(user1IndexData || {}),
                                                backgroundColor: "rgba(75, 192, 192, 0.6)",
                                            },
                                            {
                                                label: handle2,
                                                data: Object.values(user2IndexData || {}),
                                                backgroundColor: "rgba(255, 159, 64, 0.6)",
                                            },
                                        ],
                                    }}
                                    options={{ responsive: true, maintainAspectRatio: false }}
                                />
                            </div>
                        </div>

                        <div className="glass-card p-8 w-full mb-10">
                            <h3 className="text-2xl font-bold text-blue-600 mb-6 border-b border-gray-200 pb-2">Rank Comparison in Last 10 Contests</h3>
                            <div className="w-full h-96">
                                <Bar
                                    data={{
                                        labels: Array.from({ length: 10 }, (_, i) => `Contest ${i + 1}`),
                                        datasets: [
                                            {
                                                label: handle1,
                                                data: user1ContestData.rank || [],
                                                backgroundColor: "rgba(54, 162, 235, 0.6)",
                                            },
                                            {
                                                label: handle2,
                                                data: user2ContestData.rank || [],
                                                backgroundColor: "rgba(255, 159, 64, 0.6)",
                                            },
                                            {
                                                label: "Rank Difference",
                                                data: user1ContestData.rank.map((rank1, index) =>
                                                    Math.abs(rank1 - (user2ContestData.rank[index] || 0))
                                                ),
                                                backgroundColor: "rgba(255, 206, 86, 0.6)",
                                            },
                                        ],
                                    }}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                )
            )}
        </div>
    );
};

export default CompareWithOthers;
