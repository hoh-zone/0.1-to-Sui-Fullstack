"use client";
import {
	createChart,
	ColorType,
	IChartApi,
	ChartOptions,
	DeepPartial,
	ISeriesApi,
	PriceLineSource,
} from "lightweight-charts";
import React, { useEffect, useRef, useState } from "react";
import { getNetworkVariables, suiClient } from "@/contracts";
import { useInterval } from "@/hooks/useInterval";

interface Props {
	coinId: string;
}

const ChartComponent = ({ coinId }: Props) => {
	const chartContainerRef = useRef<HTMLDivElement>(null);
	const chartRef = useRef<IChartApi | null>(null);
	const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
	const tooltipRef = useRef<HTMLDivElement>(null);

	const fetchAndUpdateData = async () => {
		try {
			const events = await suiClient.queryEvents({
				query: {
					MoveEventType: `${getNetworkVariables("testnet").package}::trade_coin::SwapEvent`,
				},
				limit: 50,
			});

			const response = await fetch(
				"https://api.binance.com/api/v3/ticker/price?symbol=SUIUSDT",
			);
			const { price: sui_price } = await response.json();
			console.log(
				events.data.filter(
					(item) => (item.parsedJson as any).pool_id === coinId,
				),
			);

			if (seriesRef.current && events.data.length > 0) {
				const tradeMap = new Map();

				events.data
					.filter((item) => (item.parsedJson as any).pool_id === coinId)
					.reverse()
					.forEach((event) => {
						const { timestampMs } = event;
						const { sui_reserve, token_reserve, is_buy } =
							event.parsedJson as any;

						const price = (is_buy
							? Number(sui_reserve) / Number(token_reserve)
							: Number(token_reserve) / Number(sui_reserve)) * sui_price;

						const timeKey =
							Math.floor(Number(timestampMs) / (3600 * 1000)) * 3600;

						if (!tradeMap.has(timeKey)) {
							tradeMap.set(timeKey, {
								time: timeKey,
								open: price,
								high: price,
								low: price,
								close: price,
							});
						} else {
							const candle = tradeMap.get(timeKey);
							candle.high = Math.max(candle.high, price);
							candle.low = Math.min(candle.low, price);
							candle.close = price;
						}
					});

				seriesRef.current.setData(Array.from(tradeMap.values()));
				chartRef.current?.timeScale().fitContent();
			}
		} catch (error) {
			console.error("Error fetching chart data:", error);
		}
	};

	useEffect(() => {
		if (!chartContainerRef.current) return;

		const chartOptions: DeepPartial<ChartOptions> = {
			layout: {
				textColor: "#d1d4dc",
				background: { type: ColorType.Solid, color: "#131722" },
			},
			grid: {
				vertLines: { color: "rgba(31, 41, 55, 0.5)" },
				horzLines: { color: "rgba(31, 41, 55, 0.5)" },
			},
			crosshair: {
				mode: 1,
				vertLine: {
					visible: true,
					labelVisible: true,
				},
				horzLine: {
					visible: true,
					labelVisible: true,
				},
			},
			rightPriceScale: {
				borderColor: "#1f2937",
				textColor: "#d1d4dc",
				visible: true,
				borderVisible: true,
				ticksVisible: true,
				entireTextOnly: true,
				scaleMargins: {
					top: 0.2, // 调整上边距
					bottom: 0.1, // 调整下边距
				},
				autoScale: true,
				alignLabels: true,
				minimumWidth: 50, // 设置最小宽度
			},
			timeScale: {
				borderColor: "#1f2937",
				timeVisible: true,
				secondsVisible: false,
				barSpacing: 20,
				minBarSpacing: 15,
				fixLeftEdge: true,
				fixRightEdge: true,
				rightOffset: 12,
				borderVisible: true,
				visible: true,
				ticksVisible: true,
				tickMarkFormatter: (time: number) => {
					const date = new Date(time * 1000);
					const hours = date.getHours().toString().padStart(2, "0");
					const minutes = date.getMinutes().toString().padStart(2, "0");
					return `${hours}:${minutes}`;
				},
			},
			width: chartContainerRef.current.clientWidth,
			height: 450,
		};

		const chart = createChart(chartContainerRef.current, chartOptions);
		chartRef.current = chart;

		const series = chart.addCandlestickSeries({
			upColor: "#26a69a",
			downColor: "#ef5350",
			wickUpColor: "#26a69a",
			wickDownColor: "#ef5350",
			priceFormat: {
				type: "price",
				precision: 14,
				minMove: 0.0000000000001,
			},
			priceLineVisible: true,
			priceLineSource: PriceLineSource.LastVisible,
			priceLineWidth: 1,
			priceLineColor: "#9B7DFF",
			lastValueVisible: true,
		});
		seriesRef.current = series;

		chart.subscribeCrosshairMove((param) => {
			if (!tooltipRef.current) return;

			if (!param.point || !param.seriesData.get(series)) {
				tooltipRef.current.style.display = "none";
				return;
			}

			const data = param.seriesData.get(series);
			if (!data) {
				tooltipRef.current.style.display = "none";
				return;
			}

			const { time, open, high, low, close } = data as any;
			const date = new Date(time * 1000).toLocaleString();

			tooltipRef.current.innerHTML = `
        <div class="bg-black/90 p-2 rounded text-xs font-mono space-y-1 text-center">
          <div>Time: ${date}</div>
          <div>Open: ${open.toFixed(14)}</div>
          <div>High: ${high.toFixed(14)}</div>
          <div>Low: ${low.toFixed(14)}</div>
          <div>Close: ${close.toFixed(14)}</div>
        </div>
      `;

			tooltipRef.current.style.display = "block";
			tooltipRef.current.style.left = `${param.point.x}px`;
			tooltipRef.current.style.top = `${param.point.y - 120}px`;
		});

		fetchAndUpdateData();

		const handleResize = () => {
			chart.applyOptions({
				width: chartContainerRef.current?.clientWidth || 0,
			});
		};

		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("resize", handleResize);
			chart.remove();
		};
	}, [coinId]);

	useInterval(fetchAndUpdateData, 1200);

	return (
		<div className="w-full space-y-4">
			<div className="relative">
				<div
					ref={tooltipRef}
					className="absolute z-10 pointer-events-none hidden text-white"
				/>
				<div
					className="rounded-md min-h-[450px] bg-[#131722] overflow-hidden"
					ref={chartContainerRef}
				/>
			</div>
		</div>
	);
};

export default ChartComponent;
