import React from 'react'
import { Link, Navigate, useParams } from 'react-router-dom';
import { DEFINE_ROUTERS_USER } from '../../../../constants/routers-mapper';
import { Breadcrumb, Tabs, TabsProps } from 'antd';
import InfoTab from './tabs/InfoTab';
import BookingTab from './tabs/BookingTab';


export default function BadmintonGatherDetail() {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return <Navigate to={DEFINE_ROUTERS_USER.badmintonGatherManager} />;
  }

  
  const items: TabsProps['items'] = React.useMemo(() => {
    return [
      {
        key: '1',
        label: 'Quản lý thông tin bài đăng',
        children: <InfoTab id={id} />,
      },
      {
        key: '2',
        label: 'Danh sách lịch được đặt',
        children: <BookingTab id={id} />,
      },
    ];
  }, [id]);

  return (
    <div className="w-full space-y-2">
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to={DEFINE_ROUTERS_USER.badmintonGatherManager}>
            Danh sách bài đăng
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Quản lý bài đăng và lịch đặt</Breadcrumb.Item>
      </Breadcrumb>
      <Tabs defaultActiveKey="1" items={items} />
    </div>
  )
}