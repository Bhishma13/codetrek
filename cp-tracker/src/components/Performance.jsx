import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Bar, Doughnut } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

Chart.register(...registerables);

const Performance = () => {
    const navigate = useNavigate();
    const { handle } = useParams();
    const [performanceData, setPerformanceData] = useState(null);
    const [contestData, setContestData] = useState(null);
    const [indexData, setIndexData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!handle) {
            setError("No handle provided!");
            setLoading(false);
            return;
        }
        const fetchPerformance = async () => {
            try {
                const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/codeforces/performance/${handle}`);
                setPerformanceData(data);
            } catch (err) {
                setError("Error fetching performance data.");
            }
        };

        const fetchContestPerformance = async () => {
            try {
                const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/codeforces/contestPerformance/${handle}`);
                setContestData(data);
            } catch (err) {
                setError("Error fetching contest performance.");
            }
        };

        const fetchIndexPerformance = async () => {
            try {
                const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/codeforces/contestIdPerformance/${handle}`);
                setIndexData(data.IndexCount);
            } catch (err) {
                setError("Error fetching index performance.");
            }
        };

        Promise.all([fetchPerformance(), fetchContestPerformance(), fetchIndexPerformance()]).finally(() => setLoading(false));
    }, [handle]);

    if (loading) {
        return (
            <div className="min-h-screen text-gray-900 flex flex-col items-center justify-center p-6 relative overflow-hidden">
                <h1 className="text-4xl font-bold text-blue-600 mb-8 tracking-wide z-10">Performance Analysis</h1>
                <div className="glass-card p-8 w-3/4 z-10">
                    <h2 className="text-2xl text-gray-900 mb-4">
                        <Skeleton width={200} height={30} baseColor="#f0f0f0" highlightColor="#e0e0e0" />
                    </h2>
                    <Skeleton count={5} height={20} baseColor="#f0f0f0" highlightColor="#e0e0e0" className="mb-2" />
                    <div className="mt-6">
                        <Skeleton height={300} width={"100%"} baseColor="#f0f0f0" highlightColor="#e0e0e0" />
                    </div>
                    <div className="mt-6">
                        <Skeleton circle={true} height={200} width={200} baseColor="#f0f0f0" highlightColor="#e0e0e0" />
                    </div>
                </div>
            </div>
        );
    }

    if (error) return <p className="text-center text-red-500 mt-4">{error}</p>;

    const problemRatings = performanceData["problems count"] || {};
    const barData = {
        labels: Object.keys(problemRatings).sort((a, b) => a - b),
        datasets: [
            {
                label: "Problems Solved",
                data: Object.keys(problemRatings).sort((a, b) => a - b).map(key => problemRatings[key]),
                backgroundColor: "rgba(76, 175, 80, 0.6)",
                borderColor: "#388E3C",
                borderWidth: 1,
            },
        ],
    };

    const languageData = performanceData.languageUsage || {};
    const doughnutData = {
        labels: Object.keys(languageData),
        datasets: [
            {
                data: Object.values(languageData),
                backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
            },
        ],
    };

    const indexBarData = {
        labels: indexData ? Object.keys(indexData) : [],
        datasets: [
            {
                label: "Problems Solved by Index",
                data: indexData ? Object.values(indexData) : [],
                backgroundColor: "rgba(255, 99, 132, 0.6)",
                borderColor: "#FF6384",
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="min-h-screen text-gray-900 flex flex-col items-center justify-center p-8 relative overflow-hidden">
            <h1 className="text-4xl font-bold text-blue-600 mb-8 tracking-wide z-10">Performance Analysis</h1>

            <div className="glass-card p-10 w-full max-w-6xl z-10">
                <h2 className="text-2xl text-gray-900 font-semibold mb-4">Handle: {handle}</h2>

                {performanceData.totalSubmissions === 0 ? (
                    <p className="text-yellow-600 text-lg font-bold">This user has not made any submissions yet.</p>
                ) : (
                    <>
                        <p className="text-gray-600"><strong>Most Used Language:</strong> {performanceData.mostUsedLanguage}</p>
                        <p className="text-gray-600"><strong>Average Problem Rating:</strong> {performanceData["your average problem rating"]}</p>
                        <p className="text-gray-600"><strong>Most Common Problem Rating:</strong> {performanceData.mostCommonProblemRating}</p>
                        <p className="text-gray-600"><strong>{performanceData.yourAccuracy}</strong></p>
                        <p className="text-gray-600"><strong>{performanceData.yourUseTimeNMemory}</strong></p>
                        <p className="text-yellow-600"><strong>Total Submissions:</strong> {performanceData.totalSubmissions}</p>

                        <h3 className="text-xl text-gray-800 font-semibold mt-6">Problems Solved by Rating:</h3>
                        <div className="w-full flex justify-center items-center">
                            <Bar data={barData} options={{ responsive: true, maintainAspectRatio: false }} />
                        </div>

                        <h3 className="text-xl text-gray-800 font-semibold mt-6">Programming Language Usage:</h3>
                        <div className="w-full flex justify-center items-center">
                            <Doughnut data={doughnutData} options={{ responsive: true, maintainAspectRatio: false }} />
                        </div>
                    </>
                )}

                <div className="glass-card p-8 mt-10 w-full">
                    <h2 className="text-2xl font-bold text-blue-600 mb-6 border-b border-gray-200 pb-2">Performance of Last 10 Contests</h2>

                    <div className="grid grid-cols-2 gap-8 text-center mt-6">
                        <div className="glass-card bg-white p-6 shadow-md transform hover:-translate-y-1 transition duration-300">
                            <h3 className="text-lg font-semibold text-yellow-600 mb-2">Total Contests</h3>
                            <p className="text-3xl font-bold text-gray-900">{contestData.totalContests}</p>
                        </div>

                        <div className="glass-card bg-white p-6 shadow-md transform hover:-translate-y-1 transition duration-300">
                            <h3 className="text-lg font-semibold text-red-600 mb-2">Worst Rank</h3>
                            <p className="text-3xl font-bold text-gray-900">{contestData.worstRank}</p>
                        </div>

                        <div className="glass-card bg-white p-6 shadow-md transform hover:-translate-y-1 transition duration-300">
                            <h3 className="text-lg font-semibold text-green-600 mb-2">Best Rank</h3>
                            <p className="text-3xl font-bold text-gray-900">{contestData.bestRank}</p>
                        </div>

                        <div className="glass-card bg-white p-6 shadow-md transform hover:-translate-y-1 transition duration-300">
                            <h3 className="text-lg font-semibold text-blue-600 mb-2">Max Rating Increase</h3>
                            <p className="text-3xl font-bold text-gray-900">{contestData.maxRatingIncrease}</p>
                        </div>

                        <div className="glass-card bg-white p-6 shadow-md col-span-2 transform hover:-translate-y-1 transition duration-300">
                            <h3 className="text-lg font-semibold text-pink-600 mb-2">Max Rating Drop</h3>
                            <p className="text-3xl font-bold text-gray-900">{contestData.maxRatingDrop}</p>
                        </div>
                    </div>

                    <h3 className="text-xl text-gray-800 font-semibold mt-6">Problems Solved by Index:</h3>
                    <div className="w-full flex justify-center items-center">
                        <Bar data={indexBarData} options={{ responsive: true, maintainAspectRatio: false }} />
                    </div>

                    <div className="mt-12 text-center p-8 glass-card">
                        <p className="text-xl text-gray-600 mb-6">Want to prove your mettle? Compare your progress with a fellow coder and level up!</p>
                        <button
                            className="px-8 py-4 bg-blue-600 text-white font-bold text-lg rounded-xl shadow-lg hover:bg-blue-700 hover:-translate-y-1 transition duration-300 transform"
                            onClick={() => navigate(`/compare/${handle}`)}
                        >
                            Compare Performance
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Performance;
