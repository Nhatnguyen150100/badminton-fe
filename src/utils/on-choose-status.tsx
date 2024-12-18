import * as React from 'react';
import { IStatusLabel } from '../types/status.types';
import { DEFINE_STATUS } from '../constants/status';
import { Tag } from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  MinusCircleOutlined,
} from '@ant-design/icons';

export function onChooseStatus(
  status: IStatusLabel | undefined,
): React.ReactNode {
  if (!status) return null;
  let element;
  switch (status) {
    case DEFINE_STATUS.ACCEPTED:
      element = (
        <Tag icon={<CheckCircleOutlined />} color="success">
          Đã được duyệt
        </Tag>
      );
      break;
    case DEFINE_STATUS.DENIED:
      element = (
        <Tag icon={<CloseCircleOutlined />} color="error">
          Đã từ chối
        </Tag>
      );
      break;
    case DEFINE_STATUS.CANCELED:
      element = (
        <Tag icon={<MinusCircleOutlined />} color="default">
          Đã hủy
        </Tag>
      );
      break;
    case DEFINE_STATUS.PENDING_APPROVAL:
      element = (
        <Tag icon={<ExclamationCircleOutlined />} color="warning">
          Đang chờ duyệt
        </Tag>
      );
      break;
    default:
      element = null;
      break;
  }
  return element;
}
