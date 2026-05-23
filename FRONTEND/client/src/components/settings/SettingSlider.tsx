import { Slider } from "antd";

interface Props {
  title: string;
  valueLabel: string;
  defaultValue: number;
  color?: string;
}

const SettingSlider = ({ title, valueLabel, defaultValue, color }: Props) => {
  return (
    <div style={{ marginTop: 32 }}>
      <div className="slider-header">
        <span style={{ color: "white" }}>{title}</span>

        <span style={{ color: "white" }}>{valueLabel}</span>
      </div>

      <Slider
        defaultValue={defaultValue}
        trackStyle={{
          background: color || "#00eaff",
        }}
      />
    </div>
  );
};

export default SettingSlider;
