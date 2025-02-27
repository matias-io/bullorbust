"use client";

import { useEffect, useRef } from "react";
import { createChart } from "lightweight-charts";

const Chart = () => {
    const chartContainerRef = useRef(null);

    useEffect(() => {
        if (!chartContainerRef.current) return;

        const chartOptions = {
            layout: {
                textColor: "black",
                background: { type: "solid", color: "white" },
attributionLogo: false
            },
            timeScale: {
                timeVisible: true,
                secondsVisible: true,
                tickMarkFormatter: (time) => new Date(time * 1000).toLocaleTimeString(),
            },
            height: 100,
        };

        const chart = createChart(chartContainerRef.current, chartOptions);
        const series = chart.addAreaSeries({
            lineColor: "#FF9800",
            topColor: "rgba(255, 152, 0, 0.3)",
            bottomColor: "rgba(255, 152, 0, 0.0)"
        });

        series.setData([]);
        chart.timeScale().fitContent();
        chart.timeScale().scrollToPosition(5);

        const fetchLiveData = async () => {
            try {
                const response = await fetch("https://bullorbust.matiass.ca/bean/api/stock?ticker=FISHRS", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                const price = await response.json();

                if (typeof price === 'number') {
                    series.update({
                        time: Math.floor(Date.now() / 1000),
                        value: price,
                    });
                }
            } catch (error) {
                console.error("Error fetching live data:", error);
            }
        };

        const intervalID = setInterval(() => {
            fetchLiveData();
        }, 100);

        window.addEventListener("resize", () => {
            chart.applyOptions({ height: 100 });
        });

        return () => {
            clearInterval(intervalID);
            chart.remove();
        };
    }, []);

    return <div ref={chartContainerRef} className="w-full h-28" />;
};

export default Chart;
