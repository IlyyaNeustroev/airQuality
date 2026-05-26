// src/components/control/GlobalControls.tsx
import { Card, Space, Button } from "antd";
import { updateControlState } from "../../api";

interface Props {
  updateZones: (newZones: any) => void;
}

const GlobalControls = ({ updateZones }: Props) => {
  const handleAllOn = async () => {
    const data = await updateControlState({ action: "all_on" });
    updateZones(data.zones);
  };

  const handleAllOff = async () => {
    const data = await updateControlState({ action: "all_off" });
    updateZones(data.zones);
  };

  const handleAllAuto = async () => {
    const data = await updateControlState({ action: "all_auto" });
    updateZones(data.zones);
  };

  return (
    <Card size="small" className="custom-card">
      <Space>
        <Button type="default" onClick={handleAllAuto}>Авто все</Button>
        <Button type="primary" onClick={handleAllOn}>Вкл все</Button>
        <Button danger onClick={handleAllOff}>Выкл все</Button>
      </Space>
    </Card>
  );
};

export default GlobalControls;