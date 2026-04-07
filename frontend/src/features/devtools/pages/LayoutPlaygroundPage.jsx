import { Alert, Card, Space, Typography } from "antd";

const { Paragraph, Title } = Typography;

export default function LayoutPlaygroundPage() {
  return (
    <div className="min-h-screen p-6" style={{ background: "linear-gradient(160deg, #F0FDFA 0%, #EFF6FF 100%)" }}>
      <div className="mx-auto max-w-4xl">
        <Card className="rounded-2xl">
          <Space direction="vertical" size={12} className="w-full">
            <Title level={3} className="!mb-0">Layout Playground</Title>
            <Paragraph className="!mb-0 text-slate-500">
              Trang preview layout dành cho môi trường phát triển.
            </Paragraph>
            <Alert
              type="info"
              showIcon
              message="Route preview layout đang được bật cho môi trường hiện tại."
            />
          </Space>
        </Card>
      </div>
    </div>
  );
}
