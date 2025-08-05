import MultiRangeSlider, { type ChangeResult } from "multi-range-slider-react";
import "../assets/multi-range.css";

export interface MultiRangeProps {
  min: number,
  max: number,
  minValue: number,
  maxValue: number,
  onChange: (e: ChangeResult) => void
};

export default function MultiRange(props: MultiRangeProps) {
  return <MultiRangeSlider
    min={props.min}
    max={props.max}
    minValue={props.minValue}
    maxValue={props.maxValue}
    step={10}
    stepOnly
    onChange={props.onChange}
  />
}