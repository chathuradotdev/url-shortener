"use client";

import { useMemo } from "react";
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";
import { scaleLinear } from "d3-scale";
import { Tooltip } from "react-tooltip";
import countries from "i18n-iso-countries";
// Import English locale manually to register it
import enLocale from "i18n-iso-countries/langs/en.json";

// Register locale
countries.registerLocale(enLocale);

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface Props {
    data: { name: string; value: number }[];
}

export default function VisitorsMap({ data }: Props) {
    const maxValue = Math.max(...data.map((d) => d.value), 0);

    const colorScale = scaleLinear<string>()
        .domain([0, maxValue || 1])
        .range(["#E2E8F0", "#3B82F6"]); // gray-200 to blue-500

    return (
        <div className="w-full bg-white rounded-2xl border border-gray-200 p-6 shadow-sm overflow-hidden flex flex-col items-center relative z-0">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 self-start flex items-center gap-2">
                <span className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </span>
                Global Activity
            </h3>

            <div className="w-full max-w-4xl h-[400px]">
                <ComposableMap projectionConfig={{ rotate: [-10, 0, 0], scale: 147 }}>
                    <ZoomableGroup>
                        <Geographies geography={geoUrl}>
                            {({ geographies }) =>
                                geographies.map((geo) => {
                                    // Convert Numeric ID to Alpha 2 (e.g. 840 -> US)
                                    // geo.id is usually a string "840" or number 840
                                    const alpha2 = countries.numericToAlpha2(geo.id) || geo.properties.iso_a2;

                                    // Try to match data by Alpha 2 or Name
                                    const d = data.find((s) => s.name === alpha2 || s.name === geo.properties.name);

                                    return (
                                        <Geography
                                            key={geo.rsmKey}
                                            geography={geo}
                                            fill={d ? colorScale(d.value) : "#F1F5F9"}
                                            stroke="#CBD5E1"
                                            strokeWidth={0.5}
                                            style={{
                                                default: { outline: "none" },
                                                hover: { fill: "#2563EB", outline: "none", transition: "all 250ms" },
                                                pressed: { outline: "none" },
                                            }}
                                            data-tooltip-id="my-tooltip"
                                            data-tooltip-content={`${geo.properties.name}: ${d ? d.value : 0} visits`}
                                        />
                                    );
                                })
                            }
                        </Geographies>
                    </ZoomableGroup>
                </ComposableMap>
            </div>
            <Tooltip id="my-tooltip" />
        </div>
    );
}
