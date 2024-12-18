import React from 'react';
import BaseModal from '../../../../../../components/base/BaseModal';
import { Button, Form, Input, TimePicker } from 'antd';
import { ITimeBooking } from '../../../../../../types/timeBooking.types';
import { FORMAT_TIME } from '../../../../../../constants/time';
import dayjs from 'dayjs';

interface IProps {
  isOpenModal: boolean;
  handleClose: () => void;
  editTimeBooking?: ITimeBooking;
  onFinish?: ((values: any) => void) | undefined;
}

type FieldType = {
  startTime: string;
  endTime: string;
};

export default function TimeBookingForm({
  isOpenModal,
  handleClose,
  editTimeBooking,
  onFinish,
}: IProps) {
  const [form] = Form.useForm();
  return (
    <BaseModal
      isOpen={isOpenModal}
      width={500}
      destroyOnClose
      footer={null}
      handleClose={handleClose}
      title={`${editTimeBooking ? 'Sửa thời gian' : 'Thêm thời gian mới'}`}
    >
      <div className="w-full mt-10">
        <Form
          className="w-full mt-5"
          form={form}
          labelCol={{ span: 6 }}
          labelAlign="left"
          name="form"
          onFinish={onFinish}
          initialValues={{
            startTime: editTimeBooking?.startTime ? dayjs(editTimeBooking?.startTime, FORMAT_TIME) : null,
            endTime: editTimeBooking?.endTime ? dayjs(editTimeBooking?.endTime, FORMAT_TIME) : null,
          }}
          autoComplete="off"
        >
          <Form.Item<FieldType>
            label="Giờ bắt đầu"
            name="startTime"
            rules={[{ required: true, message: 'Hãy nhập thời gian bắt đầu' }]}
          >
            <TimePicker className='w-full' format={FORMAT_TIME} placeholder='Chọn thời gian bắt đầu'/>
          </Form.Item>

          <Form.Item<FieldType>
            label="Giờ kết thúc"
            name="endTime"
            rules={[{ required: true, message: 'Hãy nhập thời gian kết thúc' }]}
          >
            <TimePicker className='w-full' format={FORMAT_TIME} placeholder='Chọn thời gian kết thúc' />
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
