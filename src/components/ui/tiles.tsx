"use client"

import * as React from "react"
import { motion } from "framer-motion"

import { cn } from "@/lib/utils"

export interface TilesProps {
  className?: string
  rows?: number
  cols?: number
  tileClassName?: string
  tileSize?: "sm" | "md" | "lg"
  tileColor?: string
  hoverColor?: string
}

const tileSizes: Record<NonNullable<TilesProps["tileSize"]>, string> = {
  sm: "w-8 h-8",
  md: "w-9 h-9 md:w-12 md:h-12",
  lg: "w-12 h-12 md:w-16 md:h-16",
}

export function Tiles({
  className,
  rows = 80,
  cols = 12,
  tileClassName,
  tileSize = "md",
  tileColor = "rgba(148, 163, 184, 0.18)",
  hoverColor,
}: TilesProps) {
  const rowsArray = React.useMemo(() => Array.from({ length: rows }), [rows])
  const colsArray = React.useMemo(() => Array.from({ length: cols }), [cols])

  return (
    <div
      className={cn(
        "relative z-0 flex h-full w-full justify-center overflow-hidden",
        className,
      )}
      style={{
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        ["--tile"]: tileColor,
        ["--tile-hover"]: hoverColor || tileColor,
      } as React.CSSProperties}
    >
      {rowsArray.map((_, rowIndex) => (
        <motion.div
          key={`row-${rowIndex}`}
          className={cn(
            tileSizes[tileSize],
            "relative border-l border-neutral-200",
            tileClassName,
          )}
        >
          {colsArray.map((_, colIndex) => (
            <motion.div
              whileHover={{
                backgroundColor: "var(--tile-hover)",
                transition: { duration: 0 },
              }}
              animate={{
                transition: { duration: 2 },
              }}
              key={`col-${colIndex}`}
              className={cn(
                tileSizes[tileSize],
                "relative border-t border-r border-neutral-200",
                tileClassName,
              )}
            />
          ))}
        </motion.div>
      ))}
    </div>
  )
}
