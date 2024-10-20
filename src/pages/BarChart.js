import React, { useEffect, useRef } from 'react'
import { Chart, registerables } from 'chart.js'
Chart.register(...registerables)


const BarChart = ({workspaceCount, taskCount, completedTaskCount}) => {

    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        if (chartInstance.current) {
            chartInstance.current.destroy();
        }
        const myChartRef = chartRef.current.getContext('2d');

        chartInstance.current = new Chart(myChartRef, {
        
            type: 'bar',
            data: {
                labels: ["label 1", "label 2", "label 3"],
                datasets: [
                    {
                        label : "Murat",
                        data: [parseInt(workspaceCount), parseInt(taskCount), parseInt(completedTaskCount)],
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

export default BarChart;
