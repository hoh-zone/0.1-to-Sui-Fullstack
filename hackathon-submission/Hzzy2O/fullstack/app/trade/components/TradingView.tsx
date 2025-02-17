"use client";
import {
	createChart,
	ColorType,
	IChartApi,
	CandlestickSeriesApi,
	ChartOptions,
	DeepPartial,
} from "lightweight-charts";
import React, { useEffect, useRef } from "react";

interface CandleData {
	time: number;
	open: number;
	high: number;
	low: number;
	close: number;
}

const generateData = (
	numberOfCandles = 500,
	updatesPerCandle = 5,
	startAt = 100,
) => {
	const randomFactor = 25 + Math.random() * 25;
	const samplePoint = (i: number) =>
		i *
			(0.5 +
				Math.sin(i / 1) * 0.2 +
				Math.sin(i / 2) * 0.4 +
				Math.sin(i / randomFactor) * 0.8 +
				Math.sin(i / 50) * 0.5) +
		200 +
		i * 2;

	const createCandle = (val: number, time: number): CandleData => ({
		time,
		open: val,
		high: val,
		low: val,
		close: val,
	});

	const updateCandle = (candle: CandleData, val: number): CandleData => ({
		time: candle.time,
		close: val,
		open: candle.open,
		low: Math.min(candle.low, val),
		high: Math.max(candle.high, val),
	});

	const date = new Date(Date.UTC(2018, 0, 1, 12, 0, 0, 0));
	const numberOfPoints = numberOfCandles * updatesPerCandle;
	const initialData: CandleData[] = [];
	const realtimeUpdates: CandleData[] = [];
	let lastCandle: CandleData;
	let previousValue = samplePoint(-1);

	for (let i = 0; i < numberOfPoints; ++i) {
		if (i % updatesPerCandle === 0) {
			date.setUTCDate(date.getUTCDate() + 1);
		}
		const time = date.getTime() / 1000;
		let value = samplePoint(i);
		const diff = (value - previousValue) * Math.random();
		value = previousValue + diff;
		previousValue = value;

		if (i % updatesPerCandle === 0) {
			const candle = createCandle(value, time);
			lastCandle = candle;
			if (i >= startAt) {
				realtimeUpdates.push(candle);
			}
		} else {
			const newCandle = updateCandle(lastCandle, value);
			lastCandle = newCandle;
			if (i >= startAt) {
				realtimeUpdates.push(newCandle);
			} else if ((i + 1) % updatesPerCandle === 0) {
				initialData.push(newCandle);
			}
		}
	}

	return {
		initialData,
		realtimeUpdates,
	};
};

const ChartComponent = () => {
	const chartContainerRef = useRef<HTMLDivElement>(null);
	const chartRef = useRef<IChartApi | null>(null);
	const seriesRef = useRef<CandlestickSeriesApi | null>(null);
	const intervalRef = useRef<NodeJS.Timeout | null>(null);
	const resizeObserverRef = useRef<ResizeObserver | null>(null);

	useEffect(() => {
		if (!chartContainerRef.current) return;

		const chartOptions: DeepPartial<ChartOptions> = {
			layout: {
				textColor: "#d1d4dc",
				background: { type: ColorType.Solid, color: "#131722" },
			},
			grid: {
				vertLines: { color: "#1f2937" },
				horzLines: { color: "#1f2937" },
			},
			crosshair: {
				mode: 1,
				vertLine: {
					width: 4,
					color: "#9B7DFF",
					style: 0,
					labelBackgroundColor: "#9B7DFF",
				},
				horzLine: {
					color: "#9B7DFF",
					labelBackgroundColor: "#9B7DFF",
				},
			},
			timeScale: {
				borderColor: "#1f2937",
				timeVisible: true,
				secondsVisible: false,
			},
			rightPriceScale: {
				borderColor: "#1f2937",
			},
			width: chartContainerRef.current.clientWidth, // 添加初始宽度
			height: 450,
		};

		const chart = createChart(chartContainerRef.current, chartOptions);
		chartRef.current = chart;

		// const resizeObserver = new ResizeObserver(entries => {
		//   if (chartRef.current && entries[0]) {
		//     chartRef.current.applyOptions({
		//       width: entries[0].contentRect.width,
		//     });
		//   }
		// });
		//
		// resizeObserver.observe(chartContainerRef.current);
		// resizeObserverRef.current = resizeObserver;

		const handleResize = () => {
			chart.applyOptions({
				width: chartContainerRef.current?.clientWidth || 0,
			});
		};

		const series = chart.addCandlestickSeries({
			upColor: "#26a69a",
			downColor: "#ef5350",
			borderVisible: false,
			wickUpColor: "#26a69a",
			wickDownColor: "#ef5350",
			// 可选：为蜡烛图添加半透明效果
			borderUpColor: "#26a69a80",
			borderDownColor: "#ef535080",
		});
		seriesRef.current = series;

		const data = generateData(2500, 20, 1000);
		series.setData(data.initialData);
		chart.timeScale().fitContent();
		chart.timeScale().scrollToPosition(5, true);

		// Simulate real-time updates
		function* getNextRealtimeUpdate(realtimeData: CandleData[]) {
			for (const dataPoint of realtimeData) {
				yield dataPoint;
			}
			return null;
		}

		const streamingDataProvider = getNextRealtimeUpdate(data.realtimeUpdates);
		intervalRef.current = setInterval(() => {
			const update = streamingDataProvider.next();
			if (update.done) {
				if (intervalRef.current) {
					clearInterval(intervalRef.current);
				}
				return;
			}
			series.update(update.value);
		}, 100);

		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("resize", handleResize);
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}
			chart.remove();
		};
	}, []);

	return (
		<div className="bg-indigo-800 rounded-md mx-8 min-h-[450px] p-10 w-[60%]">
			<div
				className="rounded-md overflow-hidden shadow-[0_0_4px_4px_purple]"
				ref={chartContainerRef}
			/>
		</div>
	);
};

export default ChartComponent;
