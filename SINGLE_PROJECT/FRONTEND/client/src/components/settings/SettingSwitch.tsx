import { Switch } from "antd";

interface Props {
  title: string;
  subtitle: string;
  defaultChecked: boolean;
  onChange?: (checked: boolean) => void;
}

const SettingSwitch = ({ title, subtitle, defaultChecked, onChange }: Props) => {
  return (
    <div className="setting-row">
      <div>
        <div className="setting-title" style={{ color: "white" }}>
          {title}
        </div>
        <div className="setting-subtitle" style={{ color: "white" }}>
          {subtitle}
        </div>
      </div>
      <Switch defaultChecked={defaultChecked} onChange={onChange} />
    </div>
  );
};

export default SettingSwitch;