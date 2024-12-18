import React, { useMemo } from 'react';
import { IBadmintonCourt, ILatLng } from '../../types/badmintonCourt.types';
import DATA from '../../mock/dvhc.json';
import { Form, Input, Select } from 'antd';
import { ISelectType } from '../../types/select.types';
import TextArea from 'antd/es/input/TextArea';
import ImgUpload from '../../components/base/ImgUpload';
import HanoiMap from '../../components/base/HanoiMap';

interface IProps {
  badmintonCourt: IBadmintonCourt;
}

type FieldType = {
  name: string;
  district: string;
  ward: string;
  address: string;
  description?: string;
};

export default function CourtInfo({
  badmintonCourt,
}: IProps) {
  const [currentImg] = React.useState<string | null>(
    badmintonCourt?.imageCourt ?? null,
  );

  const [location] = React.useState<ILatLng>({
    lat: Number(badmintonCourt?.lat),
    lng: Number(badmintonCourt?.lang),
  });
  const [form] = Form.useForm();
  const district = Form.useWatch('district', form);

  const districtData = DATA.level2s.map((district): ISelectType => {
    return {
      label: district.name,
      value: district.level2_id,
    };
  });

  const wardData = useMemo(() => {
    if (!district) return [];
    const currentDistrict = DATA.level2s.find(
      (districtData) => districtData.level2_id === district,
    );
    return currentDistrict?.level3s.map(
      (wardData): ISelectType => ({
        label: wardData.name,
        value: wardData.level3_id,
      }),
    );
  }, [district]);

  return (
    <div className="w-full pe-10">
      <Form
        className="w-full mt-5"
        form={form}
        labelCol={{ span: 6 }}
        labelAlign="left"
        name="form"
        initialValues={{
          name: badmintonCourt?.name,
          district: badmintonCourt?.district,
          ward: badmintonCourt?.ward,
          address: badmintonCourt?.address,
          description: badmintonCourt?.description,
        }}
        autoComplete="off"
      >
        <div className="grid grid-cols-2 gap-x-4">
          <div>
            <Form.Item<FieldType>
              label="Tên sân"
              name="name"
              rules={[{ required: true, message: 'Hãy nhập tên sân cầu' }]}
            >
              <Input disabled size="large" />
            </Form.Item>

            <Form.Item<FieldType>
              label="Quận/huyện"
              name="district"
              rules={[{ required: true, message: 'Hãy nhập tên quận/huyện' }]}
            >
              <Select
                options={districtData}
                disabled
                onChange={(_) => {
                  form.setFieldsValue({ ward: '' });
                }}
              />
            </Form.Item>

            <Form.Item<FieldType>
              label="Phường/xã"
              name="ward"
              rules={[{ required: true, message: 'Hãy nhập tên phường/xã' }]}
            >
              <Select disabled options={wardData} />
            </Form.Item>

            <Form.Item<FieldType>
              label="Địa chỉ cụ thể"
              name="address"
              rules={[
                { required: true, message: 'Hãy nhập tên địa chỉ cụ thể' },
              ]}
            >
              <Input disabled/>
            </Form.Item>

            <Form.Item<FieldType>
              label="Mô tả về sân"
              name="description"
              rules={[{ required: true, message: 'Hãy nhập mô tả về sân' }]}
            >
              <TextArea disabled />
            </Form.Item>
          </div>
          <Form.Item<any>
            label={
              <div className="text-sm space-x-2">
                <span className="text-red-500">*</span>
                <span>Ảnh của sân</span>
              </div>
            }
          >
            <ImgUpload
              disabled
              imgProps={currentImg}
              file={undefined}
              handleUploadFile={() => {}}
            />
          </Form.Item>
        </div>

        <div className="flex flex-col justify-start items-start space-y-5">
          <div className="text-sm space-x-2">
            <span className="text-red-500">*</span>
            <span>Địa điểm của sân trên bản đồ</span>
          </div>
          <HanoiMap location={location} handleClickMap={() => {}} />
        </div>
      </Form>
    </div>
  );
}
