import { useTheme } from "contexts";
import { DataRepresentation } from "data";
import React from "react";

export interface ViewportDimensions {
  width: number;
  height: number;
}

export interface VisualizationProps {
  ringDimensions: DataRepresentation;
  dimensions: ViewportDimensions;
}

const RING = {
  OPTIMAL_RATIO: 0.86,
  STROKE_WIDTH: 0.8,
  MASK_ID: "ringMask",
} as const;

export const RingVisualization: React.FC<VisualizationProps> = ({
  ringDimensions,
  dimensions,
}) => {
  let isDark = false;
  try {
    const themeContext = useTheme();
    isDark = themeContext.isDark;
  } catch {
    // ponytail: fallback to DOM attribute when rendered outside ThemeProvider
    isDark =
      typeof document !== "undefined" &&
      document.documentElement.getAttribute("data-bs-theme") === "dark";
  }

  const centerX = dimensions.width / 2;
  const centerY = dimensions.height / 2;

  // Calculate ring sizes
  const scaleFactor =
    (RING.OPTIMAL_RATIO * Math.min(dimensions.width, dimensions.height)) /
    ringDimensions.od;
  const innerDiameter = ringDimensions.id * scaleFactor;
  const outerDiameter = ringDimensions.od * scaleFactor;

  // Helper function to calculate toroidal gradient offsets
  const calculateGradientOffset = (percentage: number) =>
    ((innerDiameter + (outerDiameter - innerDiameter) * (percentage / 100)) /
      outerDiameter) *
    100;

  // Calculate dimension lines coordinates
  const getLineCoordinates = () => {
    const margin = 20;

    return {
      od: {
        arrow: {
          x1: centerX - outerDiameter / 2 - margin,
          y1: centerY - outerDiameter / 2,
          x2: centerX - outerDiameter / 2 - margin,
          y2: centerY + outerDiameter / 2,
        },
        upperDash: {
          x1: centerX - outerDiameter / 2 - margin,
          y1: centerY - outerDiameter / 2,
          x2: centerX,
          y2: centerY - outerDiameter / 2,
        },
        lowerDash: {
          x1: centerX - outerDiameter / 2 - margin,
          y1: centerY + outerDiameter / 2,
          x2: centerX + outerDiameter / 2 + margin,
          y2: centerY + outerDiameter / 2,
        },
      },
      id: {
        arrow: {
          x1: centerX + outerDiameter / 2 + margin,
          y1: centerY - innerDiameter / 2,
          x2: centerX + outerDiameter / 2 + margin,
          y2: centerY + innerDiameter / 2,
        },
        upperDash: {
          x1: centerX,
          y1: centerY - innerDiameter / 2,
          x2: centerX + outerDiameter / 2 + margin,
          y2: centerY - innerDiameter / 2,
        },
        lowerDash: {
          x1: centerX,
          y1: centerY + innerDiameter / 2,
          x2: centerX + outerDiameter / 2 + margin,
          y2: centerY + innerDiameter / 2,
        },
      },
      cs: {
        arrow: {
          x1: centerX + outerDiameter / 2 + margin,
          y1: centerY + innerDiameter / 2,
          x2: centerX + outerDiameter / 2 + margin,
          y2: centerY + outerDiameter / 2,
        },
      },
    };
  };

  const lines = getLineCoordinates();
  const labelMargins = 10;

  // Colors adapted for light vs dark theme
  const colors = {
    background: isDark
      ? "linear-gradient(rgb(30, 41, 59), rgb(15, 23, 42))"
      : "linear-gradient(rgb(248, 250, 252), rgb(203, 213, 225))",
    dotColor: isDark
      ? "rgba(148, 163, 184, 0.25)"
      : "rgba(100, 116, 139, 0.25)",
    glowCenter: isDark ? "#38bdf8" : "#93c5fd",
    glowOpacity: isDark ? 0.12 : 0.2,
    dimensionLine: isDark ? "#54b2e9" : "#3388B9",
    dimensionLabel: isDark ? "#79c7f7" : "#1e5b80",
    ringStroke: isDark ? "#0f172a" : "#000000",
  };

  return (
    <svg
      width={dimensions.width}
      height={dimensions.height}
      className="shadow-sm rounded-1 border border-secondary-subtle"
      style={{
        background: colors.background,
      }}
    >
      <defs>
        {/* Subtle dot-grid backdrop */}
        <pattern
          id="dotGrid"
          width="16"
          height="16"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="8" cy="8" r="1" fill={colors.dotColor} />
        </pattern>

        {/* Soft radial ambient glow behind O-ring */}
        <radialGradient id="ambientGlow" cx="50%" cy="50%" r="50%">
          <stop
            offset="0%"
            stopColor={colors.glowCenter}
            stopOpacity={colors.glowOpacity}
          />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>

        {/* Realistic 3D Toroidal Rubber Gradient */}
        <radialGradient id="ringGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#111315" />
          <stop
            offset={`${calculateGradientOffset(20)}%`}
            stopColor="#1c2024"
          />
          <stop
            offset={`${calculateGradientOffset(45)}%`}
            stopColor="#555e68"
          />
          <stop
            offset={`${calculateGradientOffset(60)}%`}
            stopColor="#6c7784"
          />
          <stop
            offset={`${calculateGradientOffset(80)}%`}
            stopColor="#202428"
          />
          <stop offset="100%" stopColor="#0b0d0e" />
        </radialGradient>

        {/* Drop shadow filter for 3D depth */}
        <filter
          id="ringDropShadow"
          x="-15%"
          y="-15%"
          width="130%"
          height="130%"
        >
          <feDropShadow
            dx="0"
            dy="3"
            stdDeviation="5"
            floodColor="#000000"
            floodOpacity={isDark ? "0.65" : "0.35"}
          />
        </filter>

        <marker
          id="arrow"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="5"
          markerHeight="5"
          orient="auto-start-reverse"
          fill={colors.dimensionLine}
        >
          <path d="M 0 0 L 10 5 L 0 10 z" />
        </marker>
      </defs>

      {/* Dot-grid background layer */}
      <rect width="100%" height="100%" fill="url(#dotGrid)" />

      {/* Ambient glow centered on ring */}
      <rect width="100%" height="100%" fill="url(#ambientGlow)" />

      {/* Ring cutout mask */}
      <mask id={RING.MASK_ID} maskContentUnits="userSpaceOnUse">
        <circle cx={centerX} cy={centerY} r={outerDiameter / 2} fill="white" />
        <circle cx={centerX} cy={centerY} r={innerDiameter / 2} fill="black" />
      </mask>

      {/* Main 3D ring with shadow and gradient */}
      <circle
        cx={centerX}
        cy={centerY}
        r={outerDiameter / 2}
        fill="url(#ringGradient)"
        stroke={colors.ringStroke}
        strokeWidth={RING.STROKE_WIDTH}
        mask={`url(#${RING.MASK_ID})`}
        filter="url(#ringDropShadow)"
      />

      {/* Dimension lines */}
      <g id="dimensionLines">
        {/* OD lines */}
        <line
          {...lines.od.arrow}
          stroke={colors.dimensionLine}
          strokeWidth={1.1}
          markerEnd="url(#arrow)"
          markerStart="url(#arrow)"
        />
        <line
          {...lines.od.upperDash}
          stroke={colors.dimensionLine}
          strokeWidth={1.1}
          strokeDasharray={2}
        />
        <line
          {...lines.od.lowerDash}
          stroke={colors.dimensionLine}
          strokeWidth={1.1}
          strokeDasharray={2}
        />

        {/* ID lines */}
        <line
          {...lines.id.arrow}
          stroke={colors.dimensionLine}
          strokeWidth={1.1}
          markerEnd="url(#arrow)"
          markerStart="url(#arrow)"
        />
        <line
          {...lines.id.upperDash}
          stroke={colors.dimensionLine}
          strokeWidth={1.1}
          strokeDasharray={2}
        />
        <line
          {...lines.id.lowerDash}
          stroke={colors.dimensionLine}
          strokeWidth={1.1}
          strokeDasharray={2}
        />

        {/* CS line */}
        <line
          {...lines.cs.arrow}
          stroke={colors.dimensionLine}
          strokeWidth={1.1}
          markerEnd="url(#arrow)"
          markerStart="url(#arrow)"
        />
      </g>

      {/* Dimension labels */}
      <g id="dimensionLabels">
        <text
          x={lines.od.arrow.x1 - labelMargins}
          y={centerY}
          textAnchor="end"
          dominantBaseline="middle"
          fill={colors.dimensionLabel}
          fontSize={11}
          fontFamily="monospace,Ubuntu, Helvetica, Arial, sans-serif"
        >
          <tspan x={lines.od.arrow.x1 - labelMargins} dy="-3">
            OD
          </tspan>
          <tspan x={lines.od.arrow.x1 - labelMargins} dy="10">
            {ringDimensions.od + ringDimensions.unit}
          </tspan>
        </text>
        <text
          x={lines.id.arrow.x1 + labelMargins}
          y={centerY}
          textAnchor="start"
          dominantBaseline="middle"
          fill={colors.dimensionLabel}
          fontSize={11}
          fontFamily="monospace,Ubuntu, Helvetica, Arial, sans-serif"
        >
          <tspan x={lines.id.arrow.x1 + labelMargins} dy="-3">
            ID
          </tspan>
          <tspan x={lines.id.arrow.x1 + labelMargins} dy="10">
            {ringDimensions.id + ringDimensions.unit}
          </tspan>
        </text>
        <text
          x={lines.cs.arrow.x1 + labelMargins}
          y={(lines.cs.arrow.y2 - lines.cs.arrow.y1) / 2 + lines.cs.arrow.y1}
          textAnchor="start"
          dominantBaseline="middle"
          fill={colors.dimensionLabel}
          fontSize={11}
          fontFamily="monospace,Ubuntu, Helvetica, Arial, sans-serif"
        >
          <tspan x={lines.cs.arrow.x1 + labelMargins} dy="-10">
            CS
          </tspan>
          <tspan x={lines.cs.arrow.x1 + labelMargins} dy="10">
            {ringDimensions.cs + ringDimensions.unit}
          </tspan>
        </text>
      </g>
    </svg>
  );
};

export default RingVisualization;

