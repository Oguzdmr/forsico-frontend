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
                labels: ["Completed Task", "Uncompleted Tasks",],
                datasets: [
                    {
                        data: [13,26-13],
                        backgroundColor: [
                            'rgba(237, 30, 90, 1)',
                            'rgba(28, 60, 132, 1)',
                            'rgba(54, 197, 240, 1)'
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
