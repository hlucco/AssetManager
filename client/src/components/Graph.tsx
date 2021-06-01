import React, { Ref, RefObject, useEffect } from "react";
import { Chart } from "chart.js";
import colorList from "../resources/colorList.json";

interface PropsGraph {
  chartId: string;
  type: string;
  labels?: string[];
  centerText?: string;
  data: number[];
  height?: number;
  width?: number;
  fill?: boolean;
  colors: string[];
}

function Graph(props: PropsGraph) {
  const centerTextPlugin = {
    beforeDraw: function (chart: any) {
      let width = chart.width,
        height = chart.height,
        ctx = chart.ctx;

      ctx!.restore();
      let fontSize = (height! / 200).toFixed(2);
      ctx!.font = fontSize + "em 'Bahnschrift', sans-serif";
      ctx!.fillStyle = "#B5B5B5";
      ctx!.textBaseline = "middle";

      let text = `${props.centerText}`,
        textX = Math.round((width! - ctx!.measureText(text).width) / 2),
        textY = height! / 2;

      ctx!.clearRect(textX - 100, textY - 100, 400, 400);
      ctx!.fillText(text, textX, textY);
      ctx!.save();
    },
  };

  let chartRef: RefObject<HTMLCanvasElement> = React.createRef();

  useEffect(() => {
    chartRef.current!.getContext("2d");

    new Chart(chartRef.current!, {
      type: props.type,
      data: {
        labels: props.labels,
        datasets: [
          {
            data: props.data,
            backgroundColor: props.colors,
            borderColor: props.colors,
            fill: props.fill,
          },
        ],
      },
      plugins: props.centerText ? [centerTextPlugin] : [],
      options: {
        legend: {
          display: false,
        },
        aspectRatio: 1,
        cutoutPercentage: 75,
        animation: {
          animateRotate: false,
        },

        scales:
          props.type === "line"
            ? {
                yAxes: [
                  {
                    ticks: {
                      fontColor: "#b5b5b5",
                      // stepSize: 1,
                      // beginAtZero: true,
                    },
                  },
                ],
                xAxes: [
                  {
                    ticks: {
                      fontColor: "#b5b5b5",
                    },
                  },
                ],
              }
            : {},
      },
    });
  });

  return (
    <div className="chart-container">
      <canvas
        id={props.chartId}
        ref={chartRef}
        height={props.height}
        width={props.width}
      />
    </div>
  );
}

export default Graph;
