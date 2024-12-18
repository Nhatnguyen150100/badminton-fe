import React, { useMemo } from 'react';
import BaseModal from '../../../../../../components/base/BaseModal';
import { Button, DatePicker, Form, Input, InputNumber, Select } from 'antd';
import { ISchedule } from '../../../../../../types/schedule.types';
import { ICourtNumber } from '../../../../../../types/courtNumber.types';
import { ITimeBooking } from '../../../../../../types/timeBooking.types';
import dayjs from 'dayjs';
import { formatter, parser } from '../../../../../../utils/input-format-money';

interface IProps {
  isOpenModal: boolean;
  listCourtNumber: ICourtNumber[];
  listTimeBooking: ITimeBooking[];
  handleClose: () => void;
  editSchedule?: ISchedule;
  onFinish?: ((values: any) => void) | undefined;
}

type FieldType = {
  courtNumberId: string;
  timeBookingId: string;
  appointmentDate: string;
  constBooking: number;
};

export default function ScheduleForm({
  isOpenModal,
  listCourtNumber,
  listTimeBooking,
  handleClose,
  editSchedule,
  onFinish,
}: IProps) {
  const [form] = Form.useForm();

  const timeSelect = useMemo(() => {
    return listTimeBooking.map((time) => ({
      label: `${time.startTime} đến ${time.endTime}`,
      value: time.id,
    }));
  }, [listTimeBooking]);

  const courtSelect = useMemo(() => {
    return listCourtNumber.map((court) => ({
      label: court.name,
      value: court.id,
    }));
  }, [listCourtNumber]);

  return (
    <BaseModal
      isOpen={isOpenModal}
      width={500}
      destroyOnClose
      footer={null}
      handleClose={handleClose}
      title={`${editSchedule ? 'Sửa lịch' : 'Thêm lịch mới'}`}
    >
      <div className="w-full mt-10">
        <Form
          className="w-full mt-5"
          form={form}
          labelCol={{ span: 6 }}
          labelAlign="left"
          // clearOnDestroy
          name="form"
          onFinish={onFinish}
          initialValues={{
            courtNumberId: editSchedule?.courtNumberId,
            timeBookingId: editSchedule?.timeBookingId,
            appointmentDate: editSchedule?.appointmentDate
              ? dayjs(editSchedule?.appointmentDate)
              : null,
            constBooking: editSchedule?.constBooking ?? 0,
          }}
          autoComplete="off"
        >
          <Form.Item<FieldType>
            label="Sân cầu"
            name="courtNumberId"
            rules={[{ required: true, message: 'Hãy nhập tên sân cầu' }]}
          >
            <Select options={courtSelect} />
          </Form.Item>

          <Form.Item<FieldType>
            label="Thời gian"
            name="timeBookingId"
            rules={[{ required: true, message: 'Hãy nhập thời gian' }]}
          >
            <Select options={timeSelect} />
          </Form.Item>

          <Form.Item<FieldType>
            label="Giá cho thuê"
            name="constBooking"
            rules={[{ required: true, message: 'Hãy nhập giá cho thuê' }]}
          >
            <InputNumber className='w-full' formatter={formatter} parser={parser} />
          </Form.Item>

          <Form.Item<FieldType>
            label="Ngày cho thuê"
            name="appointmentDate"
            rules={[{ required: true, message: 'Hãy nhập ngày cho thuê' }]}
          >
            <DatePicker format={'DD/MM/YYYY'} minDate={dayjs().add(1, 'day')}/>
          </Form.Item>

          <div className="w-full flex justify-end items-end my-5">
            <Button type="primary" htmlType="submit">
              Xác nhận
            </Button>
          </div>
        </Form>
      </div>
    </BaseModal>
  );
}
