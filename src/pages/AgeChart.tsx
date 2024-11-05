import { onMount } from "solid-js";
import axios from "axios"; 
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import './AgeChart.css';

const AgeChart = () => {
    let chartDiv: HTMLDivElement;
    let data: { category: string, value: number }[] = [];

    const fetchAgeData = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:8080/users/age");
            data = response.data.map((item: { age_group: string, count: number }) => ({
                category: item.age_group,
                value: item.count
            }));
        } catch (error) {
            console.error("Error fetching age data:", error);
        }
    };

    onMount(async () => {
        await fetchAgeData();

        let root = am5.Root.new(chartDiv);
        root.setThemes([am5themes_Animated.new(root)]);

        let chart = root.container.children.push(am5xy.XYChart.new(root, {
            panX: true,
            panY: true,
            wheelX: "panX",
            wheelY: "zoomX",
            pinchZoomX: true,
            paddingLeft: 0
        }));

        let cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
            behavior: "none"
        }));
        cursor.lineY.set("visible", false);

        let xRenderer = am5xy.AxisRendererX.new(root, {
            minGridDistance: 30,
            minorGridEnabled: true
        });

        let yRenderer = am5xy.AxisRendererY.new(root, {
            strokeOpacity: 0.1
        });

        // Function to apply theme-specific styles
        const applyThemeStyles = () => {
            const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';

            const labelColor = isDarkMode ? am5.color(0xFFFFFF) : am5.color(0x000000);
            const gridColor = isDarkMode ? am5.color(0x444444) : am5.color(0xCCCCCC);

            xRenderer.labels.template.setAll({
                rotation: -90,
                centerY: am5.p50,
                centerX: am5.p100,
                paddingRight: 15,
                fill: labelColor,
            });

            yRenderer.labels.template.setAll({
                fill: labelColor,
            });

            // Set the grid lines color
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

        let xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
            categoryField: "category",
            renderer: xRenderer,
            tooltip: am5.Tooltip.new(root, {})
        }));

        let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
            renderer: yRenderer
        }));

        let series = chart.series.push(am5xy.SmoothedXLineSeries.new(root, {
            name: "Distribusi Umur",
            xAxis: xAxis,
            yAxis: yAxis,
            valueYField: "value",
            categoryXField: "category",
            tooltip: am5.Tooltip.new(root, {
                labelText: "{valueY}"
            })
        }));

        series.strokes.template.setAll({
            stroke: am5.color(0xADF777), 
            strokeWidth: 2
        });

        series.fills.template.setAll({
            visible: true,
            fill: am5.color(0xADF777),
            fillOpacity: 0.2
        });

        series.bullets.push(() => {
            return am5.Bullet.new(root, {
                locationY: 0,
                sprite: am5.Circle.new(root, {
                    radius: 4,
                    stroke: root.interfaceColors.get("background"),
                    strokeWidth: 2,
                    fill: series.get("fill")
                })
            });
        });

        xAxis.data.setAll(data);
        series.data.setAll(data);

        series.appear(1000);
        chart.appear(1000, 100);

        window.addEventListener('dataUpdated', async () => {
            await fetchAgeData();
            xAxis.data.setAll(data);
            series.data.setAll(data);
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
        <div class="age-chart-container">
            <div class="age-title">
                <h1 class="age-title-h1">Data Umur Pengguna</h1>
            </div>
            <div id="chartdiv" ref={el => chartDiv = el as HTMLDivElement}></div>
        </div>
    );
};

export default AgeChart;
