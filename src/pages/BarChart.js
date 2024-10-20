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
                labels: ["Workspaces", "Tasks", "Completed"],
                datasets: [
                    {
                        label : "General Info",
                        data: [parseInt(workspaceCount), parseInt(taskCount), parseInt(completedTaskCount)],
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
            <canvas ref={chartRef} />
        </div>
    )
}

export default BarChart;
