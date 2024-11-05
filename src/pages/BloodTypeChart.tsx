import { onMount } from "solid-js";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import "./BloodTypeChart.css";

const BloodTypeChart = () => {
  let chartDiv: HTMLDivElement;

  const fetchBloodTypeData = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8080/users/blood_type_stats");
      if (response.ok) {
        const data = await response.json();
        return data.map((item: { blood_type: string, jumlah: number }) => ({
          country: item.blood_type,
          value: item.jumlah
        }));
      } else {
        console.error("Failed to fetch blood type data");
        return [];
      }
    } catch (error) {
      console.error("Error fetching blood type data:", error);
      return [];
    }
  };

  onMount(async () => {
    let data = await fetchBloodTypeData();

    let root = am5.Root.new(chartDiv);
    root.setThemes([am5themes_Animated.new(root)]);

    let chart = root.container.children.push(am5xy.XYChart.new(root, {
      panX: true,
      panY: true,
      wheelX: "panX",
      wheelY: "zoomX",
      paddingLeft: 5,
      paddingRight: 5
    }));

    let cursor = chart.set("cursor", am5xy.XYCursor.new(root, {}));
    cursor.lineY.set("visible", false);

    let xRenderer = am5xy.AxisRendererX.new(root, {
      minGridDistance: 60,
      minorGridEnabled: true
    });

    let xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
      maxDeviation: 0.3,
      categoryField: "country",
      renderer: xRenderer,
      tooltip: am5.Tooltip.new(root, {})
    }));

    xRenderer.grid.template.setAll({
      location: 1
    });

    let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
      maxDeviation: 0.3,
      renderer: am5xy.AxisRendererY.new(root, {
        strokeOpacity: 0.1
      })
    }));

    let series = chart.series.push(am5xy.ColumnSeries.new(root, {
      name: "Blood Type Distribution",
      xAxis: xAxis,
      yAxis: yAxis,
      valueYField: "value",
      sequencedInterpolation: true,
      categoryXField: "country"
    }));

    series.columns.template.setAll({
      width: am5.percent(120),
      fillOpacity: 0.9,
      strokeOpacity: 0
    });

    const colors = ["#B477D9", "#D977BD", "#F4E2FF", "#D4DEFF"];

    series.columns.template.adapters.add("fill", (fill, target) => {
      const index = series.columns.indexOf(target);
      return am5.color(colors[index % colors.length]);
    });

    series.columns.template.adapters.add("stroke", (stroke, target) => {
      const index = series.columns.indexOf(target);
      return am5.color(colors[index % colors.length]);
    });

    series.columns.template.set("draw", function (display, target) {
      let w = target.getPrivate("width", 0);
      let h = target.getPrivate("height", 0);
      display.moveTo(0, h);
      display.bezierCurveTo(w / 4, h, w / 4, 0, w / 2, 0);
      display.bezierCurveTo(w - w / 4, 0, w - w / 4, h, w, h);
    });

    const applyThemeStyles = () => {
      const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';

      const labelColor = isDarkMode ? am5.color(0xFFFFFF) : am5.color(0x000000);
      const gridColor = isDarkMode ? am5.color(0x444444) : am5.color(0xCCCCCC);

      xRenderer.labels.template.setAll({
        fill: labelColor
      });

      yAxis.get("renderer").labels.template.setAll({
        fill: labelColor
      });

      // Update grid lines to be visible in dark mode
      xRenderer.grid.template.setAll({
        stroke: gridColor,
        strokeOpacity: 0.5
      });

      yAxis.get("renderer").grid.template.setAll({
        stroke: gridColor,
        strokeOpacity: 0.5
      });
    };

    applyThemeStyles();

    xAxis.data.setAll(data);
    series.data.setAll(data);

    series.appear(1000);
    chart.appear(1000, 100);

    window.addEventListener('dataUpdated', async () => {
      let updatedData = await fetchBloodTypeData();
      xAxis.data.setAll(updatedData);
      series.data.setAll(updatedData);
    });

    // Detect changes in theme
    const observer = new MutationObserver(() => {
      applyThemeStyles();
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });

    return () => {
      observer.disconnect();
      root.dispose();
    };
  });

  return (
    <div class="blood-chart-container">
      <div class="goldar-title">
        <h1 class="goldar-title-h1">Data Golongan Darah</h1>
      </div>
      <div id="chartdiv" ref={el => chartDiv = el as HTMLDivElement}></div>
    </div>
  );
};

export default BloodTypeChart;
