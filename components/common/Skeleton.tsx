'use client'
import type { CSSProperties } from 'react'

interface Props {
  width?: number | string
  height?: number | string
  radius?: number | string
  style?: CSSProperties
}

export function Skeleton({ width, height = 12, radius = 8, style }: Props) {
  return (
    <div
      style={{
        width,
        height,
        borderRadius: radius,
        background: 'linear-gradient(90deg, var(--skeleton-bg) 25%, var(--skeleton-bg-light) 50%, var(--skeleton-bg) 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.4s infinite',
        flexShrink: 0,
        ...style,
      }}
    />
  )
}
