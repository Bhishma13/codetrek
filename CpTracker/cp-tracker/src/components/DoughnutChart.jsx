import React from "react";
import { Doughnut } from "react-chartjs-2";

const DoughnutChart = ({ data }) => {
    return <Doughnut data={data} options={{ responsive: true, maintainAspectRatio: false }} />;
};

export default DoughnutChart;
