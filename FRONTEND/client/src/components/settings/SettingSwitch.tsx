import { Switch } from "antd";

interface Props {
  title: string;
  subtitle: string;
  defaultChecked?: boolean;
}

const SettingSwitch = ({ title, subtitle, defaultChecked }: Props) => {
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

      <Switch defaultChecked={defaultChecked} />
    </div>
  );
};

export default SettingSwitch;
