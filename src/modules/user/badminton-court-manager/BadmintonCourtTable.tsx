import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../../../lib/store';
import { badmintonCourtService } from '../../../services';
import { IBaseQuery } from '../../../types/query.types';
import { IBadmintonCourt } from '../../../types/badmintonCourt.types';
import { Button, Empty, message, Spin, Table, TableProps } from 'antd';
import Visibility from '../../../components/base/visibility';
import BaseSearch from '../../../components/base/BaseSearch';
import { onChooseStatus } from '../../../utils/on-choose-status';
import { useNavigate } from 'react-router-dom';
import { DEFINE_ROUTERS_USER } from '../../../constants/routers-mapper';
import { onGetDistrictName, onGetWardName } from '../../../utils/functions/on-location-name';

export default function BadmintonCourtTable() {
  const navigate = useNavigate();
  const user = useSelector((state: IRootState) => state.user);
  const [listCourt, setListCourt] = React.useState<IBadmintonCourt[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [query, setQuery] = React.useState<IBaseQuery>({
    limit: 5,
    page: 1,
  });

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
      render: (_: any, record: IBadmintonCourt) => <span>{onGetWardName(record.district, record.ward)}</span>,
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
  ];

  const handleGetList = async () => {
    try {
      setLoading(true);
      const rs = await badmintonCourtService.getBadmintonCourtManager(
        user.id,
        query,
      );
      setListCourt(rs.data.content);
      setQuery({ ...query, total: rs.data.totalCount });
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (user.id && !query.nameLike) handleGetList();
  }, [user.id, query.nameLike]);

  const handleCreateNewCourt = () => {
    navigate(DEFINE_ROUTERS_USER.newBadmintonCourt);
  };

  const handleClickRow = (record: IBadmintonCourt) => {
    navigate(`/badminton-court-manager/${record.id}`);
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
          onClick={handleCreateNewCourt}
        >
          Thêm thông tin sân cầu mới
        </Button>
      </div>
      <Visibility
        visibility={Boolean(listCourt.length)}
        suspenseComponent={loading ? <Spin /> : <Empty />}
      >
        <div className="w-full">
          <Table<IBadmintonCourt>
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
    </div>
  );
}
