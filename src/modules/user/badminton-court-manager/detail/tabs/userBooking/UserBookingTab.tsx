import * as React from 'react';
import { useSelector } from 'react-redux';
import {
  Button,
  Empty,
  Modal,
  notification,
  Spin,
  Table,
  TableProps,
  Tooltip,
} from 'antd';
import {
  CheckCircleOutlined,
  CloseOutlined,
  CompassOutlined,
} from '@ant-design/icons';
import { IUserBookingDetailByAdmin } from '../../../../../../types/userBooking.types';
import { IRootState } from '../../../../../../lib/store';
import { IBaseQuery } from '../../../../../../types/query.types';
import { userBookingService } from '../../../../../../services';
import { onGetDistrictName } from '../../../../../../utils/functions/on-location-name';
import BaseSearch from '../../../../../../components/base/BaseSearch';
import Visibility from '../../../../../../components/base/visibility';
import { formatDate } from '../../../../../../utils/functions/format-date';
import { formatCurrencyVND } from '../../../../../../utils/functions/format-money';
import { onChooseStatus } from '../../../../../../utils/on-choose-status';
import { DEFINE_STATUS } from '../../../../../../constants/status';
import { IStatusLabel } from '../../../../../../types/status.types';

interface IProps {
  id: string;
}

export default function UserBookingTab({ id }: IProps) {
  const [listUserBooking, setListUserBooking] = React.useState<
    IUserBookingDetailByAdmin[]
  >([]);

  const [loading, setLoading] = React.useState<boolean>(false);
  const [query, setQuery] = React.useState<IBaseQuery>({
    limit: 5,
    page: 1,
  });

  const handleGetList = async (queryPram = query) => {
    try {
      setLoading(true);
      const rs = await userBookingService.getListUserBookingOwnerCourt(
        id,
        queryPram,
      );
      setListUserBooking(rs.data.content);
      setQuery({ ...queryPram, total: rs.data.totalCount });
    } finally {
      setLoading(false);
    }
  };

  const handleChangStatus = async (
    status: IStatusLabel,
    record: IUserBookingDetailByAdmin,
  ) => {
    Modal.confirm({
      title: 'Bạn có muốn cập nhật trạng lịch này?',
      content: (
        <div className="flex flex-col justify-start items-start space-y-3 mb-5">
          <p>{`Người đặt: ${record.user?.fullName ?? record.user?.email}`}</p>
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
          const rs =
            status === DEFINE_STATUS.ACCEPTED
              ? await userBookingService.acceptUserBooking(record.id)
              : await userBookingService.deniedUserBooking(record.id);
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

  React.useEffect(() => {
    if (id && !query.nameLike) handleGetList();
  }, [id, query.nameLike]);

  const columns: TableProps<IUserBookingDetailByAdmin>['columns'] = [
    {
      title: 'Tên người đặt',
      key: 'userName',
      render: (_, record) => (
        <span className="text-md font-semibold">
          {record.user?.fullName ?? record.user?.email}
        </span>
      ),
    },
    {
      title: 'Số điện thoại người đặt',
      key: 'userPhoneNumber',
      render: (_, record) => (
        <Tooltip title="Nhấn để gọi">
          <a
            href={`tel:${record.user?.phoneNumber}`}
            className="text-md font-semibold text-blue-500 underline"
          >
            {record.user?.phoneNumber}
          </a>
        </Tooltip>
      ),
    },
    {
      title: 'Sân cầu',
      key: 'courtName',
      render: (_, record) => (
        <span className="text-md font-semibold">
          {record.schedule.courtNumber.name}
        </span>
      ),
    },
    {
      title: 'Thời gian thuê',
      dataIndex: 'startTime',
      align: 'center',
      key: 'startTime',
      render: (_, record) => (
        <div className="text-md flex flex-row justify-center items-center space-x-1">
          <span>{record.schedule.timeBooking.startTime}</span>
          <span>đến</span>
          <span>{record.schedule.timeBooking.endTime}</span>
        </div>
      ),
    },
    {
      title: 'Ngày cho thuê',
      dataIndex: 'appointmentDate',
      align: 'center',
      key: 'appointmentDate',
      render: (_, record) => (
        <span className="text-sm font-base">
          {formatDate(record.schedule.appointmentDate)}
        </span>
      ),
    },
    {
      title: 'Giá tiền thuê',
      dataIndex: 'constBooking',
      align: 'center',
      key: 'constBooking',
      render: (_, record) => (
        <span className="text-sm font-base underline text-blue-600">
          {formatCurrencyVND(record.schedule.constBooking)}
        </span>
      ),
    },
    {
      title: 'Ghi chú của người đặt',
      dataIndex: 'note',
      align: 'center',
      key: 'note',
      render: (note) => (
        <span>
          {note}
        </span>
      ),
    },
    {
      title: 'Trạng thái của lịch',
      dataIndex: 'status',
      align: 'center',
      key: 'status',
      render: (_, record) => <span>{onChooseStatus(record.status)}</span>,
    },
    {
      title: 'Hành động',
      key: 'action',
      align: 'center',
      dataIndex: 'action',
      render: (_, record) => (
        <div className="flex flex-row justify-center items-center space-x-5">
          <Visibility visibility={record.status !== DEFINE_STATUS.ACCEPTED}>
            <Tooltip title="Chấp nhận yêu cầu">
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  handleChangStatus(DEFINE_STATUS.ACCEPTED, record);
                }}
                disabled={record.status !== DEFINE_STATUS.PENDING_APPROVAL}
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
            <Tooltip title="Từ chối yêu cầu">
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  handleChangStatus(DEFINE_STATUS.DENIED, record);
                }}
                disabled={record.status !== DEFINE_STATUS.PENDING_APPROVAL}
                variant="solid"
                color="danger"
                shape="default"
                icon={<CloseOutlined />}
              />
            </Tooltip>
          </Visibility>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full min-h-[320px] flex flex-col justify-start items-center space-y-5">
      <div className="w-full flex flex-row justify-between items-center">
        <BaseSearch
          value={query.nameLike!}
          placeholder="Nhập để tìm kiếm"
          onHandleChange={(value) => {
            setQuery({ ...query, nameLike: value });
          }}
          onSearch={() => handleGetList()}
        />
      </div>
      <Visibility
        visibility={Boolean(listUserBooking.length)}
        suspenseComponent={loading ? <Spin /> : <Empty />}
      >
        <div className="w-full">
          <Table<IUserBookingDetailByAdmin>
            rowKey="id"
            columns={columns}
            className="cursor-pointer"
            dataSource={listUserBooking}
            pagination={{
              current: query.page,
              pageSize: query.limit,
              total: query.total ?? 0,
              onChange: (page, limit) => {
                const newQuery = {
                  ...query,
                  page,
                  limit,
                };
                setQuery(newQuery);
                handleGetList(newQuery);
              },
            }}
          />
        </div>
      </Visibility>
    </div>
  );
}
