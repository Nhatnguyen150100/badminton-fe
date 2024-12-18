import { Breadcrumb, Empty, Spin, Tabs, TabsProps } from 'antd';
import * as React from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { DEFINE_ROUTERS_ADMIN } from '../../constants/routers-mapper';
import CourtInfo from './CourtInfo';
import { badmintonCourtService } from '../../services';
import { IBadmintonCourt } from '../../types/badmintonCourt.types';
import { toast } from 'react-toastify';
import Visibility from '../../components/base/visibility';

export default function CourtDetail() {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = React.useState(false);
  const [courtDetail, setCourtDetail] = React.useState<IBadmintonCourt>();

  if (!id) {
    return <Navigate to={DEFINE_ROUTERS_ADMIN.home} />;
  }

  const handleGetCourtDetail = async () => {
    try {
      setLoading(true);
      const rs = await badmintonCourtService.getBadmintonCourtDetail(id);
      setCourtDetail(rs.data);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (id) handleGetCourtDetail();
  }, [id]);

  return (
    <div className="w-full space-y-2">
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to={DEFINE_ROUTERS_ADMIN.home}>Danh sách bài</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Chi tiết sân cầu lông</Breadcrumb.Item>
      </Breadcrumb>
      <Visibility
        visibility={Boolean(courtDetail?.id)}
        suspenseComponent={loading ? <Spin /> : <Empty />}
      >
        <CourtInfo badmintonCourt={courtDetail!} />
      </Visibility>
    </div>
  );
}
