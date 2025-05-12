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
                const { data } = await axios.get(`http://localhost:8080/codeforces/performance/${handle}`);
                setPerformanceData(data);
            } catch (err) {
                setError("Error fetching performance data.");
            }
        };

        const fetchContestPerformance = async () => {
            try {
                const { data } = await axios.get(`http://localhost:8080/codeforces/contestPerformance/${handle}`);
                setContestData(data);
            } catch (err) {
                setError("Error fetching contest performance.");
            }
        };

        const fetchIndexPerformance = async () => {
            try {
                const { data } = await axios.get(`http://localhost:8080/codeforces/contestIdPerformance/${handle}`);
                setIndexData(data.IndexCount);
            } catch (err) {
                setError("Error fetching index performance.");
            }
        };

        Promise.all([fetchPerformance(), fetchContestPerformance(), fetchIndexPerformance()]).finally(() => setLoading(false));
    }, [handle]);

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
                <h1 className="text-3xl font-bold text-white mb-5">Performance Analysis</h1>
                <div className="bg-black p-6 rounded-lg w-3/4">
                    <h2 className="text-2xl text-white mb-4">
                        <Skeleton width={200} height={30} baseColor="#ffffff" highlightColor="#cccccc" />
                    </h2>
                    <Skeleton count={5} height={20} baseColor="#ffffff" highlightColor="#cccccc" className="mb-2" />
                    <div className="mt-6">
                        <Skeleton height={300} width={"100%"} baseColor="#ffffff" highlightColor="#cccccc" />
                    </div>
                    <div className="mt-6">
                        <Skeleton circle={true} height={200} width={200} baseColor="#ffffff" highlightColor="#cccccc" />
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
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
            <h1 className="text-3xl font-bold text-white mb-5">Performance Analysis</h1>

            <div className="bg-black p-6 rounded-lg w-full">
                <h2 className="text-2xl text-white font-semibold mb-4">Handle: {handle}</h2>

                {performanceData.totalSubmissions === 0 ? (
                    <p className="text-yellow-400 text-lg font-bold">This user has not made any submissions yet.</p>
                ) : (
                    <>
                        <p className="text-gray-400"><strong>Most Used Language:</strong> {performanceData.mostUsedLanguage}</p>
                        <p className="text-gray-400"><strong>Average Problem Rating:</strong> {performanceData["your average problem rating"]}</p>
                        <p className="text-gray-400"><strong>Most Common Problem Rating:</strong> {performanceData.mostCommonProblemRating}</p>
                        <p className="text-gray-400"><strong>{performanceData.yourAccuracy}</strong></p>
                        <p className="text-gray-400"><strong>{performanceData.yourUseTimeNMemory}</strong></p>
                        <p className="text-yellow-500"><strong>Total Submissions:</strong> {performanceData.totalSubmissions}</p>

                        <h3 className="text-xl text-white font-semibold mt-6">Problems Solved by Rating:</h3>
                        <div className="w-full flex justify-center items-center">
                            <Bar data={barData} options={{ responsive: true, maintainAspectRatio: false }} />
                        </div>

                        <h3 className="text-xl text-white font-semibold mt-6">Programming Language Usage:</h3>
                        <div className="w-full flex justify-center items-center">
                            <Doughnut data={doughnutData} options={{ responsive: true, maintainAspectRatio: false }} />
                        </div>
                    </>
                )}
                <div className="bg-black p-6 rounded-lg w-3/4">
                    <h2 className="text-2xl font-semibold mb-4">Performance of last 10 Contests</h2>

                    <div className="grid grid-cols-2 gap-6 text-center">
                        <div className="bg-black border border-gray-700 p-4 rounded-lg shadow-md">
                            <h3 className="text-lg font-semibold text-yellow-400">Total Contests</h3>
                            <p className="text-2xl font-bold">{contestData.totalContests}</p>
                        </div>

                        <div className="bg-black border border-gray-700 p-4 rounded-lg shadow-md">
                            <h3 className="text-lg font-semibold text-red-400">Worst Rank</h3>
                            <p className="text-2xl font-bold">{contestData.worstRank}</p>
                        </div>

                        <div className="bg-black border border-gray-700 p-4 rounded-lg shadow-md">
                            <h3 className="text-lg font-semibold text-green-400">Best Rank</h3>
                            <p className="text-2xl font-bold">{contestData.bestRank}</p>
                        </div>

                        <div className="bg-black border border-gray-700 p-4 rounded-lg shadow-md">
                            <h3 className="text-lg font-semibold text-blue-400">Max Rating Increase</h3>
                            <p className="text-2xl font-bold">{contestData.maxRatingIncrease}</p>
                        </div>

                        <div className="bg-black border border-gray-700 p-4 rounded-lg shadow-md col-span-2">
                            <h3 className="text-lg font-semibold text-pink-400">Max Rating Drop</h3>
                            <p className="text-2xl font-bold">{contestData.maxRatingDrop}</p>
                        </div>
                    </div>

                    <h3 className="text-xl text-white font-semibold mt-6">Problems Solved by Index:</h3>
                    <div className="w-full flex justify-center items-center">
                        <Bar data={indexBarData} options={{ responsive: true, maintainAspectRatio: false }} />
                    </div>

                    <div className="mt-8 text-center">
                        <p className="text-lg text-gray-300 mb-2">Compare your progress with a fellow coder and level up!</p>
                        <button
                            className="bg-black border border-white hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full transition duration-300"
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
