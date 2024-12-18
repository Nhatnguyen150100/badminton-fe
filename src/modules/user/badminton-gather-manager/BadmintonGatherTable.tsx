import * as React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { IRootState } from '../../../lib/store';
import { IBaseQuery } from '../../../types/query.types';
import { IBadmintonGather } from '../../../types/badmintonGather.types';
import { Button, Empty, Spin, Table, TableProps } from 'antd';
import {
  onGetDistrictName,
  onGetWardName,
} from '../../../utils/functions/on-location-name';
import { formatDate } from '../../../utils/functions/format-date';
import BaseSearch from '../../../components/base/BaseSearch';
import Visibility from '../../../components/base/visibility';
import { badmintonGatherService } from '../../../services';
import { DEFINE_ROUTERS_USER } from '../../../constants/routers-mapper';

export default function BadmintonGatherTable() {
  const navigate = useNavigate();
  const user = useSelector((state: IRootState) => state.user);
  const [listGather, setListCourt] = React.useState<IBadmintonGather[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [query, setQuery] = React.useState<IBaseQuery>({
    limit: 5,
    page: 1,
  });

  const handleGetList = async (queryPram = query) => {
    try {
      setLoading(true);
      const rs = await badmintonGatherService.getBadmintonGatherManager(
        user.id,
        queryPram,
      );
      setListCourt(rs.data.content);
      setQuery({ ...queryPram, total: rs.data.totalCount });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNewGather = () => {
    navigate(DEFINE_ROUTERS_USER.newBadmintonGather);
  };

  React.useEffect(() => {
    if (user.id && !query.nameLike) handleGetList();
  }, [user.id, query.nameLike]);

  const columns: TableProps<IBadmintonGather>['columns'] = [
    {
      title: 'Tên câu lạc bộ',
      dataIndex: 'nameClub',
      key: 'nameClub',
      render: (text) => <span className="text-xl font-semibold">{text}</span>,
    },
    {
      title: 'Tên sân cầu',
      dataIndex: 'badmintonCourtName',
      key: 'badmintonCourtName',
      render: (text) => <span className="font-semibold">{text}</span>,
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
      title: 'Thời gian thuê',
      dataIndex: 'startTime',
      align: 'center',
      key: 'startTime',
      render: (_, record) => (
        <div className="text-md flex flex-row justify-center items-center space-x-1">
          <span>{record.startTime}</span>
          <span>đến</span>
          <span>{record.endTime}</span>
        </div>
      ),
    },
    {
      title: 'Ngày cho thuê',
      dataIndex: 'appointmentDate',
      align: 'center',
      key: 'appointmentDate',
      render: (date) => (
        <span className="text-sm font-base">{formatDate(date)}</span>
      ),
    },
  ];

  const handleClickRow = (record: IBadmintonGather) => {
    navigate(
      DEFINE_ROUTERS_USER.badmintonGatherDetail.replace(
        ':id',
        record.id.toString(),
      ),
    );
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
          onClick={handleCreateNewGather}
        >
          Thêm thông tin giao lưu mới
        </Button>
      </div>
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
                const newQuery = {
                  ...query,
                  page,
                  limit,
                };
                handleGetList(newQuery);
              },
            }}
          />
        </div>
      </Visibility>
    </div>
  );
}
