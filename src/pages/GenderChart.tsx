import { onMount } from "solid-js";
import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import './GenderChart.css';

interface GenderData {
    category: string;
    value: number;
}

const GenderChart = () => {
    let chartDiv: HTMLDivElement;
    let root: am5.Root;
    let series: am5percent.PieSeries;
    let legend: am5.Legend;

    const fetchGenderData = async () => {
        try {
            const response = await fetch("http://127.0.0.1:8080/users/gender");
            if (response.ok) {
                const data = await response.json();
                return data.map((item: { gender: string, count: number }) => ({
                    category: item.gender,
                    value: item.count
                }));
            } else {
                console.error("Failed to fetch gender data");
                return [];
            }
        } catch (error) {
            console.error("Error fetching gender data:", error);
            return [];
        }
    };

    onMount(async () => {
        root = am5.Root.new(chartDiv);
        root.setThemes([am5themes_Animated.new(root)]);

        let chart = root.container.children.push(am5percent.PieChart.new(root, {
            layout: root.verticalLayout,
            innerRadius: am5.percent(50)
        }));

        series = chart.series.push(am5percent.PieSeries.new(root, {
            valueField: "value",
            categoryField: "category",
            alignLabels: false
        }));

        series.labels.template.setAll({
            textType: "circular",
            centerX: 0,
            centerY: 0
        });

        const updateChartData = async () => {
            let data = await fetchGenderData();
            series.data.setAll(data);
        };

        await updateChartData();

        series.slices.template.setAll({
            stroke: am5.color(0xffffff),
            strokeWidth: 2
        });

        series.slices.template.adapters.add("fill", (fill, target) => {
            const category = (target.dataItem.dataContext as GenderData).category;
            return category === "male" ? am5.color(0x7174B0) : am5.color(0xF4E2FF);
        });

        const applyThemeStyles = () => {
            const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
            const labelColor = isDarkMode ? am5.color(0xFFFFFF) : am5.color(0x000000);

            // Apply label color to series labels
            series.labels.template.setAll({
                text: "{category}: {value}",
                fontSize: 12,
                fill: labelColor
            });

            // Apply label color to legend labels
            if (legend) {
                legend.labels.template.setAll({
                    fill: labelColor
                });

                legend.valueLabels.template.setAll({
                    fill: labelColor
                });
            }
        };

        applyThemeStyles();

        legend = chart.children.push(am5.Legend.new(root, {
            centerX: am5.percent(50),
            x: am5.percent(50),
            marginTop: 15,
            marginBottom: 15,
        }));

        legend.data.setAll(series.dataItems);

        series.appear(1000, 100);

        // Listen for the dataUpdated event
        window.addEventListener('dataUpdated', async () => {
            await updateChartData();
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
        <div class="gender-chart-container">
            <div class="gender-title">
                <h1 class="gender-title-h1">Data Gender</h1>
            </div>
            <div id="chartdiv" ref={el => chartDiv = el as HTMLDivElement}></div>
        </div>
    );
};

export default GenderChart;
