import React from 'react';
import { badmintonGatherBookingService } from '../../../../../services';
import { IBadmintonGatherBookingOwner } from '../../../../../types/badmintonGatherBooking.types';
import { IBaseQuery } from '../../../../../types/query.types';
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
import Visibility from '../../../../../components/base/visibility';
import { onChooseStatus } from '../../../../../utils/on-choose-status';
import { DEFINE_STATUS } from '../../../../../constants/status';
import { CheckCircleOutlined, CloseOutlined } from '@ant-design/icons';
import { IStatusLabel } from '../../../../../types/status.types';

interface IProps {
  id: string;
}

export default function BookingTab({ id }: IProps) {
  const [listGatherBooking, setListGatherBooking] = React.useState<
    IBadmintonGatherBookingOwner[]
  >([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [query, setQuery] = React.useState<IBaseQuery>({
    limit: 5,
    page: 1,
  });

  const handleGetList = async (queryParam = query) => {
    try {
      setLoading(true);
      const rs =
        await badmintonGatherBookingService.getBadmintonGatherBookingByOwner(
          id,
          queryParam,
        );
      setQuery({ ...queryParam, total: rs.data.totalCount });
      setListGatherBooking(rs.data.content);
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChangStatus = async (
    status: IStatusLabel,
    record: IBadmintonGatherBookingOwner,
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
              ? await badmintonGatherBookingService.acceptUserBooking(record.id)
              : await badmintonGatherBookingService.deniedUserBooking(
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

  React.useEffect(() => {
    if (id) handleGetList();
  }, [id]);

  const columns: TableProps<IBadmintonGatherBookingOwner>['columns'] = [
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
      title: 'Số lượng nam đăng kí',
      dataIndex: 'numberMale',
      key: 'numberMale',
      render: (text) => <span className="text-md font-semibold">{text}</span>,
    },
    {
      title: 'Số lượng nữ đăng kí',
      dataIndex: 'numberFemale',
      key: 'numberFemale',
      render: (text) => <span className="text-md font-semibold">{text}</span>,
    },
    {
      title: 'Ghi chú của người đặt',
      dataIndex: 'note',
      align: 'center',
      key: 'note',
      render: (note) => <span>{note}</span>,
    },
    {
      title: 'Trạng thái của lịch',
      dataIndex: 'status',
      align: 'center',
      key: 'status',
      render: (status) => <span>{onChooseStatus(status)}</span>,
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
      <Visibility
        visibility={Boolean(listGatherBooking.length)}
        suspenseComponent={loading ? <Spin /> : <Empty />}
      >
        <div className="w-full">
          <Table<IBadmintonGatherBookingOwner>
            rowKey="id"
            columns={columns}
            className="cursor-pointer"
            dataSource={listGatherBooking}
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
