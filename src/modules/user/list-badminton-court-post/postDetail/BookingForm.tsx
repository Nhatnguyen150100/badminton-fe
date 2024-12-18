import * as React from 'react';
import { ISchedule } from '../../../../types/schedule.types';
import BaseModal from '../../../../components/base/BaseModal';
import TextArea from 'antd/es/input/TextArea';

interface IProps {
  isOpenModal: boolean;
  record: ISchedule;
  handleClose: () => void;
  handleOk: (note: string) => void;
}

export default function BookingForm({
  record,
  isOpenModal,
  handleClose,
  handleOk
}: IProps) {
  const [note, setNote] = React.useState<string>('');
  return (
    <BaseModal
      isOpen={isOpenModal}
      width={500}
      onOk={() => {
        handleOk(note);
      }}
      destroyOnClose
      handleClose={handleClose}
      title="Bạn có muốn đặt lịch này?"
    >
      <div className="flex flex-col justify-start items-start space-y-5">
        <span>
          Lịch sân : {record.courtNumber.name} vào lúc{' '}
          {record.timeBooking.startTime} đến {record.timeBooking.endTime}
        </span>
        <TextArea
          placeholder="Ghi chú"
          onChange={(e) => {
            setNote(e.target.value);
          }}
        />
      </div>
    </BaseModal>
  );
}
