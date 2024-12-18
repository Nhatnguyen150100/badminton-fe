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
import { ICourtNumber } from '../../../../../../types/courtNumber.types';
import { courtNumberService } from '../../../../../../services';
import { toast } from 'react-toastify';
import { DeleteOutlined } from '@ant-design/icons';
import BaseSearch from '../../../../../../components/base/BaseSearch';
import Visibility from '../../../../../../components/base/visibility';
import CourtNumberForm from './CourtNumberForm';
import { formatDate } from '../../../../../../utils/functions/format-date';

interface IProps {
  id: string;
}

const CourtNumberTab: React.FC<IProps> = ({ id }) => {
  const [listCourt, setListCourt] = React.useState<ICourtNumber[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [query, setQuery] = React.useState<IBaseQuery>({
    limit: 5,
    page: 1,
  });
  const [editCourtNumber, setEditCourtNumber] = React.useState<ICourtNumber>();
  const [isOpenModal, setIsOpenModal] = React.useState<boolean>(false);

  const handleDeleteCourtNumber = async (_courtNumber: ICourtNumber) => {
    Modal.confirm({
      title: 'Bạn có muốn xóa sân này',
      content: `Sân: ${_courtNumber.name}`,
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
          const rs = await courtNumberService.deleteCourtNumber(
            _courtNumber.id,
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

  const columns: TableProps<ICourtNumber>['columns'] = [
    {
      title: 'Index',
      key: 'index',
      render: (_: any, __: any, index: number) =>
        (query.page! - 1) * query.limit! + index + 1,
    },
    {
      title: 'Tên sân cầu',
      dataIndex: 'name',
      align: 'center',
      key: 'name',
      render: (text) => <span className="text-xl font-semibold">{text}</span>,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      align: 'center',
      key: 'createdAt',
      render: (createdAt: string) => (
        <span className="text-sm font-base">{formatDate(createdAt)}</span>
      ),
    },
    {
      title: 'Xóa sân cầu',
      key: 'deleteCourtNumber',
      align: 'center',
      dataIndex: 'deleteCourtNumber',
      render: (_, _courtNumber: ICourtNumber) => (
        <Button
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteCourtNumber(_courtNumber);
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
    name: string;
  }>['onFinish'] = async (values) => {
    const data = { ...values };
    if (!id) {
      toast.error('User id không tìm thấy');
      return;
    }
    try {
      setLoading(true);
      const rs = editCourtNumber?.id
        ? await courtNumberService.updateCourtNumber(editCourtNumber!.id, data)
        : await courtNumberService.createCourtNumber({
            ...data,
            badmintonCourtId: id,
          });
      toast.success(rs.message);
      handleGetList();
      setIsOpenModal(false);
      setEditCourtNumber(undefined);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGetList = async () => {
    try {
      setLoading(true);
      const rs = await courtNumberService.getListCourtNumber(id, query);
      setListCourt(rs.data.content);
      setQuery({ ...query, total: rs.data.totalCount });
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (id && !query.nameLike) handleGetList();
  }, [id, query.nameLike]);

  const handleClickRow = (record: ICourtNumber) => {
    setEditCourtNumber(record);
    setIsOpenModal(true);
  };

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
        visibility={Boolean(listCourt.length)}
        suspenseComponent={loading ? <Spin /> : <Empty />}
      >
        <div className="w-full">
          <Table<ICourtNumber>
            rowKey="id"
            columns={columns}
            className="cursor-pointer"
            dataSource={listCourt}
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
        <CourtNumberForm
          isOpenModal={isOpenModal}
          editCourtNumber={editCourtNumber}
          onFinish={onFinish}
          handleClose={() => {
            setIsOpenModal(false);
            setEditCourtNumber(undefined);
          }}
        />
      </Visibility>
    </div>
  );
};

export default React.memo(CourtNumberTab);
