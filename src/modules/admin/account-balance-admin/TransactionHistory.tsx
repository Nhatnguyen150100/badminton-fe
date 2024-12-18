import * as React from 'react';
import {
  ITransactionHistory,
  TTransactionType,
} from '../../../types/transactionHistory.types';
import { Divider, Empty, Select, Spin, Table, TableProps, Tag } from 'antd';
import {
  DEFINE_LIST_TYPE,
  DEFINE_TRANSACTION_TYPE,
} from '../../../constants/transaction-type';
import { formatCurrencyVND } from '../../../utils/functions/format-money';
import { formatDate } from '../../../utils/functions/format-date';
import { IBaseQuery } from '../../../types/query.types';
import transactionHistoryService from '../../../services/transactionHistoryService';
import Visibility from '../../../components/base/visibility';

const onChooseTransactionType = (type: TTransactionType) => {
  const label = DEFINE_LIST_TYPE.find((_item) => _item.value === type)?.label;

  return (
    <Tag
      color={type === DEFINE_TRANSACTION_TYPE.GATHER_BOOKING ? 'cyan' : 'green'}
    >
      {label}
    </Tag>
  );
};

export default function TransactionHistory() {
  const [loading, setLoading] = React.useState(false);
  const [query, setQuery] = React.useState<IBaseQuery>({
    page: 1,
    limit: 5,
    transactionType: undefined,
  });
  const [listTransactions, setListTransactions] = React.useState<
    ITransactionHistory[]
  >([]);

  const handleGetTransactionHistory = async () => {
    try {
      setLoading(true);
      const rs = await transactionHistoryService.getTransactionHistory(query);
      setListTransactions(rs.data.content);
      setQuery({ ...query, total: rs.data.totalCount });
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    handleGetTransactionHistory();
  }, [query.page, query.transactionType]);

  const columns: TableProps<ITransactionHistory>['columns'] = [
    {
      title: 'Mã giao dịch',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Người thanh toán',
      key: 'transactionUserId',
      render: (_: any, record: ITransactionHistory) => (
        <div className="flex flex-col justify-start items-start space-y-2">
          <span className="font-semibold">
            Tên: {record.transactionUser?.fullName}
          </span>
          <span>
            Email:{' '}
            <a
              className="text-blue-600 font-semibold underline"
              href={`mailto:${record.transactionUser?.email}`}
            >
              {record.transactionUser?.email}
            </a>
          </span>
        </div>
      ),
    },
    {
      title: 'Người thụ hưởng',
      key: 'receiveUserId',
      render: (_: any, record: ITransactionHistory) => (
        <div className="flex flex-col justify-start items-start space-y-2">
          <span className="font-semibold">
            Tên: {record.receiveUser?.fullName}
          </span>
          <span>
            Email:{' '}
            <a
              className="text-blue-600 font-semibold underline"
              href={`mailto:${record.receiveUser?.email}`}
            >
              {record.receiveUser?.email}
            </a>
          </span>
        </div>
      ),
    },
    {
      title: 'Loại giao dịch',
      dataIndex: 'transactionType',
      align: 'center',
      key: 'transactionType',
      render: (transactionType: TTransactionType) =>
        onChooseTransactionType(transactionType),
    },
    {
      title: 'Số tiền giao dịch',
      key: 'transactionAmount',
      dataIndex: 'transactionAmount',
      render: (transactionAmount) => (
        <span className="text-base font-bold text-green-800">
          {formatCurrencyVND(transactionAmount)}
        </span>
      ),
    },
    {
      title: 'Số tiền chiếu khấu (10%)',
      key: 'discountedAdmin',
      dataIndex: 'discountedAdmin',
      render: (discountedAdmin) => (
        <span className="text-base font-bold text-orange-800">
          {formatCurrencyVND(discountedAdmin)}
        </span>
      ),
    },
    {
      title: 'Thời gian giao dịch',
      key: 'createdAt',
      dataIndex: 'createdAt',
      render: (createdAt) => (
        <span className="text-base font-bold">{formatDate(createdAt)}</span>
      ),
    },
  ];

  return (
    <div className="w-full">
      <Select
        className="min-w-[320px] mb-4"
        allowClear
        placeholder="Lọc giao dịch theo loại giao dịch (Thuê sân hoặc Đặt giao lưu)"
        value={query.transactionType}
        onChange={(value) => {
          setQuery((pre) => ({ ...pre, transactionType: value }));
        }}
        options={DEFINE_LIST_TYPE}
      />
      <Visibility
        visibility={listTransactions.length}
        suspenseComponent={
          loading ? <Spin /> : <Empty description="Không có dữ liệu" />
        }
      >
        <Table<ITransactionHistory>
          rowKey="id"
          columns={columns}
          className="cursor-pointer"
          dataSource={listTransactions}
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
            },
          }}
        />
      </Visibility>
    </div>
  );
}
