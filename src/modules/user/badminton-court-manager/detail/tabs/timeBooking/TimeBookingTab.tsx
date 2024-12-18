import * as React from 'react';
import { IBaseQuery } from '../../../../../../types/query.types';
import {
  Button,
  Empty,
  Form,
  FormProps,
  Input,
  Modal,
  Spin,
  Table,
  TableProps,
} from 'antd';
import {
  courtNumberService,
  timeBookingService,
} from '../../../../../../services';
import { toast } from 'react-toastify';
import { DeleteOutlined } from '@ant-design/icons';
import BaseSearch from '../../../../../../components/base/BaseSearch';
import Visibility from '../../../../../../components/base/visibility';
import BaseModal from '../../../../../../components/base/BaseModal';
import CourtNumberForm from './TimeBookingForm';
import dayjs from 'dayjs';
import { formatDate } from '../../../../../../utils/functions/format-date';
import TimeBookingForm from './TimeBookingForm';
import { ITimeBooking } from '../../../../../../types/timeBooking.types';
import { FORMAT_TIME } from '../../../../../../constants/time';

interface IProps {
  id: string;
}

const CourtNumberTab: React.FC<IProps> = ({ id }) => {
  const [listTime, setListTime] = React.useState<ITimeBooking[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [query, setQuery] = React.useState<IBaseQuery>({
    limit: 5,
    page: 1,
  });
  const [editTimeBooking, setEditTimeBooking] = React.useState<ITimeBooking>();
  const [isOpenModal, setIsOpenModal] = React.useState<boolean>(false);

  const handleDeleteCourtNumber = async (_timeBooking: ITimeBooking) => {
    Modal.confirm({
      title: 'Bạn có muốn xóa thời gian này này',
      content: `Ca: ${_timeBooking.startTime} - ${_timeBooking.endTime}`,
      okText: 'Đồng ý',
      okType: 'danger',
      cancelText: 'Hủy',
      style: {
        top: '50%',
        transform: 'translateY(-50%)',
      },
      onOk: async () => {
        try {
          setLoading(true);
          const rs = await timeBookingService.deleteTimeBooking(
            _timeBooking.id,
          );
          handleGetList();
          toast.success(rs.message);
        } catch (error: any) {
          toast.success(error.message);
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const columns: TableProps<ITimeBooking>['columns'] = [
    {
      title: 'Index',
      key: 'index',
      render: (_: any, __: any, index: number) =>
        (query.page! - 1) * query.limit! + index + 1,
    },
    {
      title: 'Thời gian bắt đầu',
      dataIndex: 'startTime',
      align: 'center',
      key: 'startTime',
      render: (text) => <span className="text-xl font-semibold">{text}</span>,
    },
    {
      title: 'Thời gian kết thúc',
      dataIndex: 'endTime',
      align: 'center',
      key: 'endTime',
      render: (text) => <span className="text-xl font-semibold">{text}</span>,
    },
    {
      title: 'Thời gian tạo',
      dataIndex: 'createdAt',
      align: 'center',
      key: 'createdAt',
      render: (createdAt: string) => (
        <span className="text-sm font-base">{formatDate(createdAt)}</span>
      ),
    },
    {
      title: 'Xóa thời gian',
      key: 'deleteTimeBooking',
      align: 'center',
      dataIndex: 'deleteTimeBooking',
      render: (_, _timeBooking: ITimeBooking) => (
        <Button
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteCourtNumber(_timeBooking);
          }}
          className="ms-3"
          variant="solid"
          color="danger"
          shape="default"
          icon={<DeleteOutlined />}
        />
      ),
    },
  ];

  const onFinish: FormProps<{
    startTime: string;
    endTime: string;
  }>['onFinish'] = async (values) => {
    const data = { ...values };
    if (!id) {
      toast.error('User id không tìm thấy');
      return;
    }
    try {
      setLoading(true);
      const rs = editTimeBooking?.id
        ? await timeBookingService.updateTimeBooking(editTimeBooking!.id, data)
        : await timeBookingService.createTimeBooking({
            startTime: dayjs(data.startTime).format(FORMAT_TIME),
            endTime: dayjs(data.endTime).format(FORMAT_TIME),
            badmintonCourtId: id,
          });
      toast.success(rs.message);
      handleGetList();
      setIsOpenModal(false);
      setEditTimeBooking(undefined);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGetList = async () => {
    try {
      setLoading(true);
      const rs = await timeBookingService.getListTimeBooking(id, query);
      setListTime(rs.data.content);
      setQuery({ ...query, total: rs.data.totalCount });
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (id) handleGetList();
  }, [id]);

  const handleClickRow = (record: ITimeBooking) => {
    setEditTimeBooking(record);
    setIsOpenModal(true);
  };

  return (
    <div className="w-full min-h-[320px] flex flex-col justify-start items-center space-y-5">
      <div className="w-full flex flex-row justify-end items-center">
        <Button
          type="primary"
          variant="filled"
          className="px-10 py-3 text-end"
          onClick={() => {
            setIsOpenModal(true);
          }}
        >
          Thêm thông tin sân cầu mới
        </Button>
      </div>
      <Visibility
        visibility={Boolean(listTime.length)}
        suspenseComponent={loading ? <Spin /> : <Empty />}
      >
        <div className="w-full">
          <Table<ITimeBooking>
            rowKey="id"
            columns={columns}
            className="cursor-pointer"
            dataSource={listTime}
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
      <Visibility visibility={isOpenModal}>
        <TimeBookingForm
          isOpenModal={isOpenModal}
          editTimeBooking={editTimeBooking}
          onFinish={onFinish}
          handleClose={() => {
            setIsOpenModal(false);
            setEditTimeBooking(undefined);
          }}
        />
      </Visibility>
    </div>
  );
};

export default React.memo(CourtNumberTab);
