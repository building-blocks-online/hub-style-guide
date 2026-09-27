import type { CSSProperties, ReactNode } from 'react';
import './empty-chart.css';

export interface EmptyChartProps {
  /** What will be drawn here, named as a thing: "No visibility data yet". */
  title: string;
  /** When it will appear, or what makes it appear. One sentence. */
  body: string;
  /** Exactly one way to make it appear. */
  action?: ReactNode;
  /** The chart's real height, so the page does not jump when data arrives. */
  height?: number;
}

/**
 * A chart with no data keeps its frame: the floor and faint gridlines at the
 * chart's real height, with one line and one action on paper in the middle.
 */
export function EmptyChart({ title, body, action, height = 240 }: EmptyChartProps) {
  return (
    <div className="hub-empty-chart" style={{ '--hub-chart-height': `${height}px` } as CSSProperties}>
      <div className="hub-empty-chart__grid" aria-hidden="true"><span /><span /><span /><span /></div>
      <div className="hub-empty-chart__say">
        <p className="hub-empty-chart__title">{title}</p>
        <p className="hub-empty-chart__text">{body}</p>
        {action}
      </div>
    </div>
  );
}
