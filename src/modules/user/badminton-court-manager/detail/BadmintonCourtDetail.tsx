import { Breadcrumb, Tabs, TabsProps } from 'antd';
import * as React from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { DEFINE_ROUTERS_USER } from '../../../../constants/routers-mapper';
import InfoTab from './tabs/InfoTab';
import CourtNumberTab from './tabs/courtNumber/CourtNumberTab';
import TimeBookingTab from './tabs/timeBooking/TimeBookingTab';
import ScheduleTab from './tabs/schedule/ScheduleTab';
import UserBookingTab from './tabs/userBooking/UserBookingTab';

export default function BadmintonCourtDetail() {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return <Navigate to={DEFINE_ROUTERS_USER.badmintonCourtManager} />;
  }

  const items: TabsProps['items'] = React.useMemo(() => {
    return [
      {
        key: '1',
        label: 'Quản lý thông tin sân cầu lông',
        children: <InfoTab id={id} />,
      },
      {
        key: '2',
        label: 'Quản lý toàn bộ sân',
        children: <CourtNumberTab id={id} />,
      },
      {
        key: '3',
        label: 'Quản lý thời gian cho thuê',
        children: <TimeBookingTab id={id} />,
      },
      {
        key: '4',
        label: 'Quản lý lịch cho thuê',
        children: <ScheduleTab id={id} />,
      },
      {
        key: '5',
        label: 'Danh sách lịch được đặt',
        children: <UserBookingTab id={id} />,
      },
    ];
  }, [id]);

  return (
    <div className="w-full space-y-2">
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to={DEFINE_ROUTERS_USER.badmintonCourtManager}>
            Danh sách sân
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Quản lý sân cầu lông</Breadcrumb.Item>
      </Breadcrumb>
      <Tabs defaultActiveKey="1" items={items} />
    </div>
  );
}
