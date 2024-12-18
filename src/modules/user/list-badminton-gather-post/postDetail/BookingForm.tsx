import * as React from 'react';
import { ISchedule } from '../../../../types/schedule.types';
import BaseModal from '../../../../components/base/BaseModal';
import TextArea from 'antd/es/input/TextArea';
import { InputNumber, message } from 'antd';
import { IBadmintonGather } from '../../../../types/badmintonGather.types';
import Visibility from '../../../../components/base/visibility';

interface IProps {
  gatherDetail: IBadmintonGather;
  isOpenModal: boolean;
  handleClose: () => void;
  handleOk: (data: IData) => void;
}

interface IData {
  numberMale?: number | null;
  numberFemale?: number | null;
  note: string | null;
}

export default function BookingForm({
  isOpenModal,
  gatherDetail,
  handleClose,
  handleOk,
}: IProps) {
  const [data, setData] = React.useState<IData>({
    numberMale: 0,
    numberFemale: 0,
    note: ''
  });

  return (
    <BaseModal
      isOpen={isOpenModal}
      width={500}
      onOk={() => {
        if(data.numberMale === 0 && data.numberFemale === 0) {
          message.error("Hãy chọn ít nhất 1 người đăng kí");
          return;
        }
        handleOk(data);
      }}
      destroyOnClose
      handleClose={() => {
        handleClose();
        setData({
          note: '',
          numberMale: 0,
          numberFemale: 0,
        })
      }}
      title="Bạn có muốn đặt lịch này?"
    >
      <div className="flex flex-col justify-start items-start space-y-5">
        <Visibility visibility={gatherDetail?.totalMale > 0}>
          <div className="grid grid-cols-2 gap-x-3 items-center">
            <label>Số người nam đăng kí: </label>
            <InputNumber
              min={0}
              max={gatherDetail.totalMale}
              value={data.numberMale}
              onChange={(value) => {
                setData({
                  ...data,
                  numberMale: value,
                });
              }}
            />
          </div>
        </Visibility>
        <Visibility visibility={gatherDetail?.totalFemale > 0}>
          <div className="grid grid-cols-2 gap-x-3 items-center">
            <label>Số người nữ đăng kí: </label>
            <InputNumber
              min={0}
              max={gatherDetail.totalFemale}
              value={data.numberFemale}
              onChange={(value) => {
                setData({
                  ...data,
                  numberFemale: value,
                });
              }}
            />
          </div>
        </Visibility>
        <TextArea
          placeholder="Ghi chú"
          value={data.note ?? undefined}
          onChange={(e) => {
            setData({
              ...data,
              note: e.target.value,
            });
          }}
        />
      </div>
    </BaseModal>
  );
}
