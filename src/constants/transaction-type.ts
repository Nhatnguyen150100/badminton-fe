import { TTransactionType } from '../types/transactionHistory.types';

const DEFINE_TRANSACTION_TYPE: Record<TTransactionType, TTransactionType> = {
  GATHER_BOOKING: 'GATHER_BOOKING',
  COURT_BOOKING: 'COURT_BOOKING',
};

const DEFINE_LIST_TYPE = [
  {
    label: 'Thuê sân',
    value: DEFINE_TRANSACTION_TYPE.COURT_BOOKING,
  },
  {
    label: 'Đặt lịch giao lưu',
    value: DEFINE_TRANSACTION_TYPE.GATHER_BOOKING,
  },
];

export { DEFINE_TRANSACTION_TYPE, DEFINE_LIST_TYPE };
