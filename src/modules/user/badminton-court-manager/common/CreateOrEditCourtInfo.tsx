import React, { useMemo } from 'react';
import {
  IBadmintonCourt,
  ILatLng,
} from '../../../../types/badmintonCourt.types';
import { Button, Form, FormProps, Input, Select } from 'antd';
import ImgUpload from '../../../../components/base/ImgUpload';
import TextArea from 'antd/es/input/TextArea';
import HanoiMap from '../../../../components/base/HanoiMap';
import { useSelector } from 'react-redux';
import { IRootState } from '../../../../lib/store';
import { toast } from 'react-toastify';
import DATA from '../../../../mock/dvhc.json';
import { ISelectType } from '../../../../types/select.types';

interface IProps {
  badmintonCourt?: IBadmintonCourt;
  handleSubmit: (data: FormData) => void;
}

type FieldType = {
  name: string;
  district: string;
  ward: string;
  address: string;
  description?: string;
};

export default function CreateOrEditCourtInfo({
  badmintonCourt,
  handleSubmit,
}: IProps) {
  const user = useSelector((state: IRootState) => state.user);
  const [file, setFile] = React.useState<File>();
  const [currentImg, setCurrentImg] = React.useState<string | null>(
    badmintonCourt?.imageCourt ?? null,
  );

  const [location, setLocation] = React.useState<ILatLng>({
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

  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    const data = { ...values };
    if (!user.id) {
      toast.error('User id không tìm thấy');
      return;
    }
    const formData = new FormData();
    formData.append('userId', user.id.toString());
    formData.append('name', data.name);
    formData.append('district', data.district);
    formData.append('ward', data.ward);
    formData.append('address', data.address);
    formData.append('lang', location.lng.toString());
    formData.append('lat', location.lat.toString());
    formData.append('description', data.description ?? '');
    if (file) formData.append('imageCourt', file);
    handleSubmit(formData);
  };

  const handleUploadFile = (file: File | undefined) => {
    setFile(file);
    setCurrentImg(null);
  };

  const handleClickMap = (latLng: ILatLng | null) => {
    setLocation({
      lat: latLng?.lat ?? location.lat,
      lng: latLng?.lng ?? location.lng,
    });
  };

  return (
    <div className="w-full pe-10">
      <Form
        className="w-full mt-5"
        form={form}
        labelCol={{ span: 6 }}
        labelAlign="left"
        name="form"
        onFinish={onFinish}
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
              <Input size="large" />
            </Form.Item>

            <Form.Item<FieldType>
              label="Quận/huyện"
              name="district"
              rules={[{ required: true, message: 'Hãy nhập tên quận/huyện' }]}
            >
              <Select
                options={districtData}
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
              <Select disabled={!district} options={wardData} />
            </Form.Item>

            <Form.Item<FieldType>
              label="Địa chỉ cụ thể"
              name="address"
              rules={[
                { required: true, message: 'Hãy nhập tên địa chỉ cụ thể' },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item<FieldType>
              label="Mô tả về sân"
              name="description"
              rules={[{ required: true, message: 'Hãy nhập mô tả về sân' }]}
            >
              <TextArea />
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
              imgProps={currentImg}
              file={file}
              handleUploadFile={handleUploadFile}
            />
          </Form.Item>
        </div>

        <div className="flex flex-col justify-start items-start space-y-5">
          <div className="text-sm space-x-2">
            <span className="text-red-500">*</span>
            <span>Địa điểm của sân trên bản đồ</span>
          </div>
          <HanoiMap location={location} handleClickMap={handleClickMap} />
        </div>

        <div className="w-full flex justify-end items-end my-5">
          <Button type="primary" htmlType="submit">
            {badmintonCourt?.id
              ? 'Cập nhật thông tin sân'
              : 'Thêm mới thông tin sân'}
          </Button>
        </div>
      </Form>
    </div>
  );
}
