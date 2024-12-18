import React from 'react';
import { ISchedule } from '../../../../types/schedule.types';
import { IScheduleStatusLabel } from '../../../../types/status.types';
import { onChooseStatusSchedule } from '../../../../utils/on-choose-status-schedule';
import { formatDate } from '../../../../utils/functions/format-date';
import { formatCurrencyVND } from '../../../../utils/functions/format-money';
import {
  DatePicker,
  Empty,
  Modal,
  Select,
  Spin,
  Table,
  TableProps,
} from 'antd';
import { IBaseQuery } from '../../../../types/query.types';
import {
  courtNumberService,
  scheduleService,
  timeBookingService,
  userBookingService,
} from '../../../../services';
import BaseSearch from '../../../../components/base/BaseSearch';
import Visibility from '../../../../components/base/visibility';
import { toast } from 'react-toastify';
import { ITimeBooking } from '../../../../types/timeBooking.types';
import { ICourtNumber } from '../../../../types/courtNumber.types';
import { DEFINE_SCHEDULE_STATUS } from '../../../../constants/status';
import { useSelector } from 'react-redux';
import { IRootState } from '../../../../lib/store';
import TextArea from 'antd/es/input/TextArea';
import dayjs from 'dayjs';
import BookingForm from './BookingForm';

interface IProps {
  id: string;
  userId: string;
}

export default function SchedulePostTable({ id, userId }: IProps) {
  const user = useSelector((state: IRootState) => state.user);
  const [isOpenModal, setIsOpenModal] = React.useState<boolean>(false);
  const [scheduleBooking, setScheduleBooking] = React.useState<ISchedule>();
  const [listSchedule, setListSchedule] = React.useState<ISchedule[]>([]);
  const [listTimeBooking, setListTimeBooking] = React.useState<ITimeBooking[]>(
    [],
  );
  const [listCourtNumber, setListCourtNumber] = React.useState<ICourtNumber[]>(
    [],
  );
  const [loading, setLoading] = React.useState<boolean>(false);
  const [query, setQuery] = React.useState<IBaseQuery>({
    limit: 5,
    page: 1,
    courtNumberId: undefined,
    timeBookingId: undefined,
    status: undefined,
    appointmentDate: undefined,
  });

  const handleGetList = async (queryPram = query) => {
    try {
      setLoading(true);
      const rs = await scheduleService.getListSchedule(id, queryPram);
      setListSchedule(rs.data.content);
      setQuery({ ...queryPram, total: rs.data.totalCount });
    } finally {
      setLoading(false);
    }
  };

  const handleGetListCourtAndTime = async () => {
    try {
      setLoading(true);
      const courts = await courtNumberService.getListCourtNumber(id, {});
      const times = await timeBookingService.getListTimeBooking(id, {});
      setListTimeBooking(times.data.content);
      setListCourtNumber(courts.data.content);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    handleGetListCourtAndTime();
  }, []);

  React.useEffect(() => {
    if (id) handleGetList();
  }, [id]);

  const handleClickRow = (record: ISchedule) => {
    if (record.status === DEFINE_SCHEDULE_STATUS.NOT_AVAILABLE) {
      toast.error('Lịch đã được đặt!');
      return;
    }
    if (user.id === userId) {
      toast.error('Bạn không thể đặt lịch cho chính bạn!');
      return;
    }
    if((user.accountBalance ?? 0) < record.constBooking) {
      toast.error('Số dư tiền của bạn không đủ để đặt lịch. Hãy nạp thêm tiền');
      return;
    }
    setScheduleBooking(record);
    setIsOpenModal(true);
  };

  const handleBooking = async (note = '') => {
    if (!scheduleBooking) {
      toast.error('Chưa chọn lịch đặt');
      return;
    }
    try {
      setLoading(true);
      const rs = await userBookingService.createUserBooking({
        userId: user.id,
        scheduleId: scheduleBooking.id,
        note,
      });
      setScheduleBooking(undefined);
      setIsOpenModal(false);
      toast.success(rs.message);
    } finally {
      setLoading(false);
    }
  };

  const columns: TableProps<ISchedule>['columns'] = [
    {
      title: 'Số thứ tự',
      key: 'index',
      render: (_: any, __: any, index: number) =>
        (query.page! - 1) * query.limit! + index + 1,
    },
    {
      title: 'Tên sân cầu',
      dataIndex: 'courtNumber',
      align: 'center',
      key: 'courtNumber',
      render: (_, record) => (
        <span className="text-xl font-semibold">{record.courtNumber.name}</span>
      ),
    },
    {
      title: 'Thời gian bắt đầu',
      dataIndex: 'startTime',
      align: 'center',
      key: 'startTime',
      render: (_, record) => (
        <span className="text-sm font-base">
          {record.timeBooking.startTime}
        </span>
      ),
    },
    {
      title: 'Thời gian kết thúc',
      dataIndex: 'endTime',
      align: 'center',
      key: 'endTime',
      render: (_, record) => (
        <span className="text-sm font-base">{record.timeBooking.endTime}</span>
      ),
    },
    {
      title: 'Giá tiền thuê',
      dataIndex: 'constBooking',
      align: 'center',
      key: 'constBooking',
      render: (constBooking: number) => (
        <span className="text-sm font-base underline text-blue-600">
          {formatCurrencyVND(constBooking)}
        </span>
      ),
    },
    {
      title: 'Ngày thuê',
      dataIndex: 'appointmentDate',
      align: 'center',
      key: 'appointmentDate',
      render: (appointmentDate: string) => (
        <span className="text-sm font-base">{formatDate(appointmentDate)}</span>
      ),
    },
    {
      title: 'Ngày tạo lịch',
      dataIndex: 'createdAt',
      align: 'center',
      key: 'createdAt',
      render: (createdAt: string) => (
        <span className="text-sm font-base">{formatDate(createdAt)}</span>
      ),
    },
    {
      title: 'Trạng thái của lịch',
      dataIndex: 'status',
      align: 'center',
      key: 'status',
      render: (status: IScheduleStatusLabel) => (
        <span>{onChooseStatusSchedule(status)}</span>
      ),
    },
  ];
  return (
    <div className="w-full flex flex-col justify-start items-center space-y-5">
      <div className="flex flex-row justify-start items-center space-x-3 w-full">
        <Select
          placeholder="Lọc theo sân"
          allowClear
          value={query.courtNumberId}
          onChange={(value) => {
            const newQuery = {
              ...query,
              courtNumberId: value,
              page: 1,
            };
            setQuery(newQuery);
            handleGetList(newQuery);
          }}
        >
          {listCourtNumber.map((court) => (
            <Select.Option key={court.id} value={court.id}>
              {court.name}
            </Select.Option>
          ))}
        </Select>
        <Select
          placeholder="Lọc theo ca cho thuê"
          allowClear
          value={query.timeBookingId}
          onChange={(value) => {
            const newQuery = {
              ...query,
              timeBookingId: value,
              page: 1,
            };
            setQuery(newQuery);
            handleGetList(newQuery);
          }}
        >
          {listTimeBooking.map((time) => (
            <Select.Option key={time.id} value={time.id}>
              {time.startTime} đến {time.endTime}
            </Select.Option>
          ))}
        </Select>
        <DatePicker
          placeholder="Tìm kiếm theo ngày"
          value={
            query?.appointmentDate
              ? dayjs(query.appointmentDate.toString())
              : null
          }
          onChange={(value) => {
            const newQuery = {
              ...query,
              appointmentDate: value,
              page: 1,
            };
            setQuery(newQuery);
            handleGetList(newQuery);
          }}
          format={'DD/MM/YYYY'}
        />
        <Select
          placeholder="Lọc theo trạng thái lịch"
          allowClear
          value={query.status}
          onChange={(value) => {
            const newQuery = {
              ...query,
              status: value,
              page: 1,
            };
            setQuery(newQuery);
            handleGetList(newQuery);
          }}
        >
          {Object.values(DEFINE_SCHEDULE_STATUS).map((item) => (
            <Select.Option key={item} value={item}>
              {item === 'AVAILABLE' ? 'Vẫn còn trống' : 'Đã được đặt'}
            </Select.Option>
          ))}
        </Select>
      </div>
      <Visibility
        visibility={Boolean(listSchedule.length)}
        suspenseComponent={loading ? <Spin /> : <Empty />}
      >
        <div className="w-full">
          <Table<ISchedule>
            rowKey="id"
            columns={columns}
            className="cursor-pointer"
            dataSource={listSchedule}
            onRow={(record) => ({
              onClick: () => handleClickRow(record),
            })}
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
      <Visibility visibility={Boolean(scheduleBooking && isOpenModal)}>
        <BookingForm
          isOpenModal={isOpenModal}
          record={scheduleBooking!}
          handleOk={handleBooking}
          handleClose={() => {
            setIsOpenModal(false);
            setScheduleBooking(undefined);
          }}
        />
      </Visibility>
    </div>
  );
}
