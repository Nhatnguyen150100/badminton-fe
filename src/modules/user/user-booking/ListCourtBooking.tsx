import * as React from 'react';
import { useSelector } from 'react-redux';
import { IRootState } from '../../../lib/store';
import { IBaseQuery } from '../../../types/query.types';
import { IUserBookingDetail } from '../../../types/userBooking.types';
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
import { userBookingService } from '../../../services';
import BaseSearch from '../../../components/base/BaseSearch';
import Visibility from '../../../components/base/visibility';
import { CloseOutlined, CompassOutlined } from '@ant-design/icons';
import {
  onGetDistrictName,
  onGetWardName,
} from '../../../utils/functions/on-location-name';
import { formatDate } from '../../../utils/functions/format-date';
import { formatCurrencyVND } from '../../../utils/functions/format-money';
import { onChooseStatus } from '../../../utils/on-choose-status';
import { DEFINE_STATUS } from '../../../constants/status';

export default function ListCourtBooking() {
  const [listUserBooking, setListUserBooking] = React.useState<
    IUserBookingDetail[]
  >([]);

  const user = useSelector((state: IRootState) => state.user);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [query, setQuery] = React.useState<IBaseQuery>({
    limit: 5,
    page: 1,
  });

  const handleGetList = async (queryPram = query) => {
    try {
      setLoading(true);
      const rs = await userBookingService.getListUserBookingByUser(
        user.id,
        queryPram,
      );
      setListUserBooking(rs.data.content);
      setQuery({ ...queryPram, total: rs.data.totalCount });
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (user.id && !query.nameLike) handleGetList();
  }, [user.id, query.nameLike]);

  const handleCancel = async (_record: IUserBookingDetail) => {
    Modal.confirm({
      title: 'Bạn có muốn hủy lịch này?',
      content: (
        <div className="flex flex-col justify-start items-start space-y-3 mb-5">
          <p>{`Sân: ${_record.schedule.courtNumber.name} tại ${_record.schedule.badmintonCourt.name}`}</p>
          <p>{`Ca từ: ${_record.schedule.timeBooking.startTime} đến ${_record.schedule.timeBooking.endTime}`}</p>
          <p>{`Địa chỉ: ${_record.schedule.badmintonCourt.address}`}</p>
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
        const rs = await userBookingService.cancelUserBooking(_record.id);
        notification.success({
          message: 'Thành công',
          description: rs.message,
        });
        handleGetList();
      },
    });
  };

  const columns: TableProps<IUserBookingDetail>['columns'] = [
    {
      title: 'Tên sân cầu',
      key: 'badmintonCourt',
      render: (_, record) => (
        <span className="text-lg font-semibold">
          {record.schedule.badmintonCourt.name}
        </span>
      ),
    },
    {
      title: 'Sân thuê',
      key: 'courtNumber',
      render: (_, record) => (
        <span className="text-lg font-semibold">
          {record.schedule.courtNumber.name}
        </span>
      ),
    },
    {
      title: 'Số điện thoại chủ sân',
      key: 'phoneNumber',
      render: (_, record) => (
        <Tooltip title="Nhấn để gọi">
          <a
            href={`tel:${record.schedule.badmintonCourt.user?.phoneNumber}`}
            className="text-lg font-semibold text-blue-500 underline"
          >
            {record.schedule.badmintonCourt.user?.phoneNumber}
          </a>
        </Tooltip>
      ),
    },
    {
      title: 'Địa chỉ sân cầu',
      key: 'address',
      render: (_, record) => (
        <div className="flex flex-row justify-start items-center">
          <span>{`${onGetDistrictName(
            record.schedule.badmintonCourt?.district,
          )} - ${onGetWardName(
            record.schedule.badmintonCourt?.district,
            record.schedule.badmintonCourt?.ward,
          )} - ${record.schedule.badmintonCourt?.address}`}</span>
        </div>
      ),
    },
    {
      title: 'Thời gian thuê',
      align: 'center',
      key: 'startTime',
      render: (_, record) => (
        <div className="flex flex-row justify-start items-center space-x-1">
          <span>{record.schedule.timeBooking.startTime}</span>
          <span>đến</span>
          <span>{record.schedule.timeBooking.endTime}</span>
        </div>
      ),
    },
    {
      title: 'Ngày cho thuê',
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
      align: 'center',
      key: 'constBooking',
      render: (_, record) => (
        <span className="text-sm font-base underline text-blue-600">
          {formatCurrencyVND(record.schedule.constBooking)}
        </span>
      ),
    },
    {
      title: 'Trạng thái của lịch',
      dataIndex: 'status',
      align: 'center',
      key: 'status',
      render: (status) => <span>{onChooseStatus(status)}</span>,
    },
    {
      title: 'Hủy đặt lịch',
      key: 'action',
      align: 'center',
      dataIndex: 'action',
      render: (_, record) => (
        <Tooltip title="Hủy yêu cầu">
          <Button
            onClick={(e) => {
              if (record.status === DEFINE_STATUS.CANCELED) {
                notification.error({
                  message: 'Thông báo',
                  description: 'Lịch đã bị hủy trước đó.',
                });
                return;
              }
              e.stopPropagation();
              handleCancel(record);
            }}
            variant="solid"
            style={{
              color: 'white',
              backgroundColor: 'gray',
            }}
            shape="default"
            icon={<CloseOutlined />}
          />
        </Tooltip>
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
          <Table<IUserBookingDetail>
            rowKey="id"
            columns={columns}
            className="cursor-pointer"
            dataSource={listUserBooking}
            // onRow={(record) => ({
            //   onClick: () => handleClickRow(record),
            // })}
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
