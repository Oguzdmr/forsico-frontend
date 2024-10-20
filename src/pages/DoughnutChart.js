import React, { useEffect, useRef } from 'react'
import { Chart, registerables } from 'chart.js'
Chart.register(...registerables)


const DoughnutChart = () => {

    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        if (chartInstance.current) {
            chartInstance.current.destroy();
        }
        const myChartRef = chartRef.current.getContext('2d');

        chartInstance.current = new Chart(myChartRef, {
            type: 'doughnut',
            data: {
                labels: ["label 1", "label 2", "label 3"],
                datasets: [
                    {
                        data: [300, 50, 100],
                        backgroundColor: [
                            'rgb(255, 99, 132)',
                            'rgb(54, 162, 235)',
                            'rgb(255, 205, 86)'
                        ],
                    }
                ]
            }
        })
        return () => {
            if(chartInstance.current){
                chartInstance.current.destroy();
            }
        }
        }, [])


    return (
        <div>
            <canvas ref={chartRef} style={{ width: "300px", height: "200px" }} />
        </div>
    )
}

export default DoughnutChart;
