import React from 'react';
import { useSelector } from 'react-redux';
import { IRootState } from '../../lib/store';
import { Navigate, useNavigate } from 'react-router-dom';
import { DEFINE_ROUTERS_ADMIN } from '../../constants/routers-mapper';
import {
  IBadmintonCourt,
  IQueryBadmintonCourtAdmin,
} from '../../types/badmintonCourt.types';
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
import {
  onGetDistrictName,
  onGetWardName,
} from '../../utils/functions/on-location-name';
import { onChooseStatus } from '../../utils/on-choose-status';
import BaseSearch from '../../components/base/BaseSearch';
import { badmintonCourtService } from '../../services';
import Visibility from '../../components/base/visibility';
import {
  CheckCircleOutlined,
  CloseOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { IStatusLabel } from '../../types/status.types';
import { DEFINE_STATUS } from '../../constants/status';

type Props = {};

export default function AdminPage({}: Props) {
  const user = useSelector((state: IRootState) => state.user);
  const [listCourt, setListCourt] = React.useState<IBadmintonCourt[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [query, setQuery] = React.useState<IQueryBadmintonCourtAdmin>({
    limit: 5,
    page: 1,
  });
  const navigate = useNavigate();

  if (!(user.id && user.role === 'ADMIN')) {
    return <Navigate to={DEFINE_ROUTERS_ADMIN.loginAdmin} replace />;
  }

  const handleDelete = (record: IBadmintonCourt) => {
    Modal.confirm({
      title: 'Bạn có muốn xóa thông tin sân này?',
      content: `Sân: ${record.name} tại ${onGetDistrictName(
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
          const rs = await badmintonCourtService.deleteBadmintonCourt(
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

  const handleChangStatus = async (
    status: IStatusLabel,
    record: IBadmintonCourt,
  ) => {
    Modal.confirm({
      title: 'Bạn có muốn cập nhật trạng thái sân này?',
      content: (
        <div className="flex flex-col justify-start items-start space-y-3 mb-5">
          <p>{`Sân: ${record.name} tại ${onGetDistrictName(
            record.district,
          )} - ${onGetWardName(record.district, record.ward)} - ${
            record.address
          }`}</p>
          <div className="flex flex-row justify-between items-center space-x-3">
            <span>Từ</span> {onChooseStatus(record.status)} <span>thành</span>{' '}
            {onChooseStatus(status)}
          </div>
        </div>
      ),
      okText: 'Đồng ý',
      okType: 'primary',
      cancelText: 'Hủy',
      style: {
        top: '50%',
        transform: 'translateY(-50%)',
      },
      onOk: async () => {
        try {
          const rs = await badmintonCourtService.updateStatusBadmintonCourt(
            record.id,
            {
              status,
            },
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

  const columns: TableProps<IBadmintonCourt>['columns'] = [
    {
      title: 'Tên sân cầu',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <span className="text-xl font-semibold">{text}</span>,
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
      render: (_: any, record: IBadmintonCourt) => (
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
      title: 'Trạng thái',
      key: 'status',
      dataIndex: 'status',
      render: (status) => onChooseStatus(status),
    },
    {
      title: 'Hành động',
      key: 'action',
      align: 'center',
      dataIndex: 'action',
      render: (_, record: IBadmintonCourt) => (
        <div className="flex flex-row justify-center items-center space-x-5">
          <Visibility visibility={record.status !== DEFINE_STATUS.ACCEPTED}>
            <Tooltip title="Duyệt thông tin sân">
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  handleChangStatus(DEFINE_STATUS.ACCEPTED, record);
                }}
                className="ms-3"
                variant="solid"
                style={{
                  color: 'white',
                  backgroundColor: 'green',
                }}
                shape="default"
                icon={<CheckCircleOutlined />}
              />
            </Tooltip>
          </Visibility>
          <Visibility visibility={record.status !== DEFINE_STATUS.DENIED}>
            <Tooltip title="Từ chối thông tin sân">
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  handleChangStatus(DEFINE_STATUS.DENIED, record);
                }}
                className="ms-3"
                variant="solid"
                style={{
                  color: 'white',
                  backgroundColor: 'gray',
                }}
                shape="default"
                icon={<CloseOutlined />}
              />
            </Tooltip>
          </Visibility>
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
      const rs = await badmintonCourtService.getBadmintonCourtAdmin(query);
      setListCourt(rs.data.content);
      setQuery({ ...query, total: rs.data.totalCount });
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClickRow = (record: IBadmintonCourt) => {
    navigate(DEFINE_ROUTERS_ADMIN.courtDetail.replace(':id', record.id));
  };

  React.useEffect(() => {
    if (user.id && !query.nameLike) handleGetList();
  }, [user.id, query.nameLike]);

  return (
    <div className="w-full min-h-[320px] flex flex-col justify-start items-start space-y-5">
      <BaseSearch
        value={query.nameLike!}
        placeholder="Nhập để tìm kiếm"
        onHandleChange={(value) => {
          setQuery({ ...query, nameLike: value });
        }}
        onSearch={() => handleGetList()}
      />
      <Visibility
        visibility={Boolean(listCourt.length)}
        suspenseComponent={loading ? <Spin /> : <Empty />}
      >
        <div className="w-full">
          <Table<IBadmintonCourt>
            rowKey="id"
            columns={columns}
            className="cursor-pointer"
            onRow={(record) => ({
              onClick: () => handleClickRow(record),
            })}
            dataSource={listCourt}
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
