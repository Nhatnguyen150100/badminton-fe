import React from 'react';
import BaseModal from '../../../../../../components/base/BaseModal';
import { ICourtNumber } from '../../../../../../types/courtNumber.types';
import { Button, Form, Input } from 'antd';

interface IProps {
  isOpenModal: boolean;
  handleClose: () => void;
  editCourtNumber?: ICourtNumber;
  onFinish?: ((values: any) => void) | undefined;
}

type FieldType = {
  name: string;
};

export default function CourtNumberForm({
  isOpenModal,
  handleClose,
  editCourtNumber,
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
      title={`${editCourtNumber ? 'Sửa tên sân' : 'Thêm sân mới'}`}
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
            name: editCourtNumber?.name,
          }}
          autoComplete="off"
        >
          <Form.Item<FieldType>
            label="Tên sân"
            name="name"
            rules={[{ required: true, message: 'Hãy nhập tên sân cầu' }]}
          >
            <Input size="large" />
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
