import { onMount } from "solid-js";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import "./IncomeChart.css";

interface IncomeData {
  incomeRange: string;
  value: number;
}

const IncomeChart = () => {
  let chartDiv: HTMLDivElement;
  let root: am5.Root;
  let series: am5xy.ColumnSeries;

  const fetchIncomeData = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8080/users/income-stats");
      if (response.ok) {
        const data = await response.json();
        return data.map((item: { income: string; count: number }) => ({
          incomeRange: item.income,
          value: item.count,
        }));
      } else {
        console.error("Failed to fetch income data");
        return [];
      }
    } catch (error) {
      console.error("Error fetching income data:", error);
      return [];
    }
  };

  onMount(async () => {
    root = am5.Root.new(chartDiv);
    root.setThemes([am5themes_Animated.new(root)]);

    let chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: true,
        panY: true,
        wheelX: "panX",
        wheelY: "zoomX",
        pinchZoomX: true,
        paddingLeft: 0,
        paddingRight: 1,
      })
    );

    let cursor = chart.set("cursor", am5xy.XYCursor.new(root, {}));
    cursor.lineY.set("visible", false);

    let xRenderer = am5xy.AxisRendererX.new(root, {
      minGridDistance: 30,
      minorGridEnabled: true,
    });

    xRenderer.labels.template.setAll({
      rotation: -90,
      centerY: am5.p50,
      centerX: am5.p100,
      paddingRight: 15,
    });

    let yRenderer = am5xy.AxisRendererY.new(root, {
      strokeOpacity: 0.1,
    });

    const applyThemeStyles = () => {
      const isDarkMode =
        document.documentElement.getAttribute("data-theme") === "dark";
      const labelColor = isDarkMode ? am5.color(0xffffff) : am5.color(0x000000);
      const gridColor = isDarkMode ? am5.color(0x444444) : am5.color(0xcccccc); // Updated grid color

      // Apply label color to axis labels
      xRenderer.labels.template.setAll({
        fill: labelColor,
      });

      yRenderer.labels.template.setAll({
        fill: labelColor,
      });

      // Apply grid line colors
      xRenderer.grid.template.setAll({
        stroke: gridColor,
        strokeOpacity: 0.5,
      });

      yRenderer.grid.template.setAll({
        stroke: gridColor,
        strokeOpacity: 0.5,
      });
    };

    applyThemeStyles();

    let xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
        maxDeviation: 0.3,
        categoryField: "incomeRange",
        renderer: xRenderer,
        tooltip: am5.Tooltip.new(root, {}),
      })
    );

    let yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        maxDeviation: 0.3,
        renderer: yRenderer,
      })
    );

    series = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        name: "Income Distribution",
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "value",
        sequencedInterpolation: true,
        categoryXField: "incomeRange",
        tooltip: am5.Tooltip.new(root, {
          labelText: "{valueY}",
        }),
      })
    );

    series.columns.template.setAll({
      cornerRadiusTL: 5,
      cornerRadiusTR: 5,
    });

    series.columns.template.adapters.add("fill", (fill, target) => {
      return am5.color(0xb477d9);
    });

    series.columns.template.adapters.add("stroke", (stroke, target) => {
      return am5.color(0xececec);
    });

    const updateChartData = async () => {
      let data = await fetchIncomeData();
      xAxis.data.setAll(data);
      series.data.setAll(data);
    };

    await updateChartData();

    series.appear(1000);
    chart.appear(1000, 100);

    // Listen for the dataUpdated event
    window.addEventListener("dataUpdated", async () => {
      await updateChartData();
    });

    // Detect changes in theme
    const observer = new MutationObserver(() => {
      applyThemeStyles();
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => {
      observer.disconnect();
      root.dispose();
    };
  });

  return (
    <div class="income-chart-container">
      <div class="income-title">
        <h1 class="income-title-h1">Pendapatan Pengguna</h1>
      </div>
      <div id="chartdiv" ref={(el) => (chartDiv = el as HTMLDivElement)}></div>
    </div>
  );
};

export default IncomeChart;
