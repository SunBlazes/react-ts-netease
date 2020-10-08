import React, { useRef } from "react";
import { Slider } from "antd";
import { parseTime } from "../../utils";

export interface ProgressProps {
  max: number;
  onChange: (value: number) => void;
  value: number;
  onChanging: (value: number) => void;
  className: string;
}

const Progress: React.FC<ProgressProps> = (props) => {
  const { max, onChange, value, onChanging, className } = props;
  const sliderRef = useRef<any>();

  function handleAfterChange(value: number) {
    if (sliderRef && sliderRef.current) {
      sliderRef.current.blur();
    }
    onChange(value);
  }

  function tipFormatter(value: number | undefined) {
    return parseTime(value ? value * 1000 : 0).toString();
  }

  return (
    <div className={className}>
      <span className="current-time">{parseTime(value * 1000)}</span>
      <Slider
        max={max}
        onAfterChange={handleAfterChange}
        value={value}
        defaultValue={0}
        onChange={onChanging}
        ref={sliderRef}
        tipFormatter={tipFormatter}
      />
      <span className="duration">{parseTime(max * 1000)}</span>
    </div>
  );
};

export default React.memo(Progress);
