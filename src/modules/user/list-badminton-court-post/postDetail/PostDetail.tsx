import React from 'react';
import {
  IBadmintonCourt,
  ILatLng,
} from '../../../../types/badmintonCourt.types';
import { badmintonCourtService } from '../../../../services';
import { toast } from 'react-toastify';
import Visibility from '../../../../components/base/visibility';
import { useParams } from 'react-router-dom';
import { Divider, Empty, Spin, Tooltip } from 'antd';
import { CompassOutlined } from '@ant-design/icons';
import {
  onGetDistrictName,
  onGetWardName,
} from '../../../../utils/functions/on-location-name';
import HanoiMap from '../../../../components/base/HanoiMap';
import SchedulePostTable from './SchedulePostTable';

export default function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = React.useState(false);
  const [courtDetail, setCourtDetail] = React.useState<IBadmintonCourt>();

  const handleGetCourtDetail = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const rs = await badmintonCourtService.getBadmintonCourtDetail(id);
      setCourtDetail(rs.data);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (id) handleGetCourtDetail();
  }, [id]);

  return (
    <div className="flex flex-col justify-start items-center w-full overflow-y-auto">
      <Visibility
        visibility={Boolean(courtDetail)}
        suspenseComponent={loading ? <Spin /> : <Empty />}
      >
        <img
          crossOrigin="anonymous"
          className="max-h-[240px] rounded-2xl object-contain"
          src={courtDetail?.imageCourt}
          alt="Ảnh sân cầu"
        />
        <h1 className="text-start font-bold text-2xl w-full uppercase mt-5">
          Thông tin chi tiết sân cầu {courtDetail?.name}
        </h1>
        <Divider variant="solid" className="border-[1px] border-gray-300" />
        <div className="w-full flex flex-col justify-start items-start space-y-4">
          <div className="flex flex-row justify-start items-end space-x-2">
            <label className="text-lg">Tên sân cầu:</label>
            <h1 className="text-3xl font-bold">{courtDetail?.name}</h1>
          </div>
          <div className="flex flex-row justify-start items-end space-x-2">
            <label className="text-lg">Chủ sân cầu:</label>
            <h1 className="text-lg font-bold">
              {courtDetail?.user?.fullName ?? courtDetail?.user?.email}
            </h1>
          </div>
          <div className="flex flex-row justify-start items-end space-x-2">
            <label className="text-lg">Tổng số sân cầu:</label>
            <h1 className="text-lg font-bold">
              {courtDetail?.totalCourtNumber}
            </h1>
          </div>
          <div className="flex flex-row justify-start items-end space-x-2">
            <label className="text-lg">Số điện thoại chủ sân cầu:</label>
            <Tooltip title="Nhấn để gọi">
              <a
                href={`tel:${courtDetail?.user?.phoneNumber}`}
                className="text-lg font-semibold text-blue-500 underline"
              >
                {courtDetail?.user?.phoneNumber}
              </a>
            </Tooltip>
          </div>
          <div className="flex flex-row justify-start items-center space-x-2">
            <label className="text-lg">Địa chỉ sân cầu:</label>
            <CompassOutlined style={{ color: 'red' }} />
            <span>{`${onGetDistrictName(
              courtDetail?.district,
            )} - ${onGetWardName(courtDetail?.district, courtDetail?.ward)} - ${
              courtDetail?.address
            }`}</span>
          </div>
          <div className="flex flex-row justify-start items-end space-x-2">
            <label className="text-lg">Mô tả sân cầu:</label>
            <span>{courtDetail?.description}</span>
          </div>
        </div>
        <h1 className="text-start font-bold text-2xl w-full uppercase mt-5">
          Lịch cho thuê sân cầu {courtDetail?.name}
        </h1>
        <Divider variant="solid" className="border-[1px] border-gray-300" />
        <Visibility
          visibility={Boolean(id && courtDetail?.userId)}
          suspenseComponent={<Empty />}
        >
          <SchedulePostTable id={id!} userId={courtDetail?.userId ?? ''} />
        </Visibility>
        <h1 className="text-start font-bold text-2xl w-full uppercase mt-5">
          Vị trí sân cầu {courtDetail?.name} trên bản đồ
        </h1>
        <Divider variant="solid" className="border-[1px] border-gray-300" />
        <Visibility visibility={Boolean(courtDetail?.lat && courtDetail.lang)}>
          <HanoiMap
            location={{
              lat: Number(courtDetail?.lat) ?? 0,
              lng: Number(courtDetail?.lang) ?? 0,
            }}
          />
        </Visibility>
      </Visibility>
    </div>
  );
}
