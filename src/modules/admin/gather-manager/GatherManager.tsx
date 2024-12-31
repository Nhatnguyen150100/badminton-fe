import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';
import {
  Button,
  Empty,
  message,
  Modal,
  notification,
  Spin,
  Table,
  TableProps,
  Tooltip,
} from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { IBadmintonGather } from '../../../types/badmintonGather.types';
import { IRootState } from '../../../lib/store';
import { DEFINE_ROUTERS_ADMIN } from '../../../constants/routers-mapper';
import { IBaseQuery } from '../../../types/query.types';
import { badmintonGatherService } from '../../../services';
import {
  onGetDistrictName,
  onGetWardName,
} from '../../../utils/functions/on-location-name';
import Visibility from '../../../components/base/visibility';
import { formatDate } from '../../../utils/functions/format-date';

type Props = {};

export default function GatherManager({}: Props) {
  const user = useSelector((state: IRootState) => state.user);
  const [listGather, setListGather] = React.useState<IBadmintonGather[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [query, setQuery] = React.useState<IBaseQuery>({
    limit: 5,
    page: 1,
    sortBy: 'createdAt',
  });
  const navigate = useNavigate();

  if (!(user.id && user.role === 'ADMIN')) {
    return <Navigate to={DEFINE_ROUTERS_ADMIN.loginAdmin} replace />;
  }

  const handleDelete = (record: IBadmintonGather) => {
    Modal.confirm({
      title: 'Bạn có muốn xóa thông tin này?',
      content: `Tên: ${record.nameClub} tại ${onGetDistrictName(
        record.district,
      )} - ${onGetWardName(record.district, record.ward)} - ${record.address}`,
      okText: 'Đồng ý',
      okType: 'danger',
      cancelText: 'Hủy',
      style: {
        top: '50%',
        transform: 'translateY(-50%)',
      },
      onOk: async () => {
        try {
          const rs = await badmintonGatherService.deleteBadmintonCourt(
            record.id,
          );
          notification.success({
            message: 'Thành công',
            description: rs.message,
          });
          handleGetList();
        } catch (error: any) {
          notification.error({
            message: 'Thất bại',
            description: error.message,
          });
        }
      },
    });
  };

  const columns: TableProps<IBadmintonGather>['columns'] = [
    {
      title: 'Tên câu lạc',
      dataIndex: 'nameClub',
      key: 'name',
      render: (text) => <span className="text-lg font-semibold">{text}</span>,
    },
    {
      title: 'Quận',
      dataIndex: 'district',
      key: 'district',
      render: (idDistrict) => <span>{onGetDistrictName(idDistrict)}</span>,
    },
    {
      title: 'Phường',
      key: 'ward',
      dataIndex: 'ward',
      render: (_: any, record: IBadmintonGather) => (
        <span>{onGetWardName(record.district, record.ward)}</span>
      ),
    },
    {
      title: 'Địa chỉ',
      key: 'address',
      dataIndex: 'address',
    },
    {
      title: 'Mô tả về sân',
      key: 'description',
      dataIndex: 'description',
    },
    {
      title: 'Ngày giao lưu',
      key: 'appointmentDate',
      dataIndex: 'appointmentDate',
      render: (appointmentDate) => (
        <span className="text-sm font-base">{formatDate(appointmentDate)}</span>
      ),
    },
    {
      title: 'Thời gian giao lưu',
      key: 'time',
      render: (_, record: IBadmintonGather) => (
        <span className=" text-base font-medium">
          {record?.startTime} đến {record?.endTime}
        </span>
      ),
    },
    {
      title: 'Xóa bài đăng',
      key: 'action',
      align: 'center',
      dataIndex: 'action',
      render: (_, record: IBadmintonGather) => (
        <div className="flex flex-row justify-center items-center space-x-5">
          <Tooltip title="Xóa thông tin sân">
            <Button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(record);
              }}
              className="ms-3"
              variant="solid"
              color="danger"
              shape="default"
              icon={<DeleteOutlined />}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  const handleGetList = async () => {
    try {
      setLoading(true);
      const rs = await badmintonGatherService.getBadmintonGatherList(query);
      setListGather(rs.data.content);
      setQuery({ ...query, total: rs.data.totalCount });
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClickRow = (record: IBadmintonGather) => {
    navigate(DEFINE_ROUTERS_ADMIN.courtDetail.replace(':id', record.id));
  };

  React.useEffect(() => {
    if (user.id && !query.nameLike) handleGetList();
  }, [user.id, query.nameLike]);

  return (
    <div className="w-full min-h-[320px] flex flex-col justify-start items-start space-y-5">
      <Visibility
        visibility={Boolean(listGather.length)}
        suspenseComponent={loading ? <Spin /> : <Empty />}
      >
        <div className="w-full">
          <Table<IBadmintonGather>
            rowKey="id"
            columns={columns}
            className="cursor-pointer"
            onRow={(record) => ({
              onClick: () => handleClickRow(record),
            })}
            dataSource={listGather}
            pagination={{
              current: query.page,
              pageSize: query.limit,
              total: query.total ?? 0,
              onChange: (page, limit) => {
                setQuery((pre) => ({
                  ...pre,
                  page,
                  limit,
                }));
                handleGetList();
              },
            }}
          />
        </div>
      </Visibility>
    </div>
  );
}
