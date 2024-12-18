import * as React from 'react';
import { IScheduleStatusLabel } from '../types/status.types';
import { DEFINE_SCHEDULE_STATUS } from '../constants/status';
import { Tag } from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';

export function onChooseStatusSchedule(
  status: IScheduleStatusLabel | undefined,
): React.ReactNode {
  if (!status) return null;
  let element;
  switch (status) {
    case DEFINE_SCHEDULE_STATUS.AVAILABLE:
      element = (
        <Tag icon={<CheckCircleOutlined />} color="success">
          Vẫn còn trống
        </Tag>
      );
      break;
    case DEFINE_SCHEDULE_STATUS.NOT_AVAILABLE:
      element = (
        <Tag icon={<CloseCircleOutlined />} color="error">
          Đã được đặt
        </Tag>
      );
      break;
    default:
      element = null;
      break;
  }
  return element;
}
