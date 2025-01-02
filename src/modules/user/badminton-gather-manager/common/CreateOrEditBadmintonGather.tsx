import * as React from 'react';
import { IBadmintonGather } from '../../../../types/badmintonGather.types';
import { useSelector } from 'react-redux';
import { IRootState } from '../../../../lib/store';
import {
  Button,
  Checkbox,
  DatePicker,
  Form,
  FormProps,
  Input,
  InputNumber,
  Radio,
  Select,
  TimePicker,
} from 'antd';
import DATA from '../../../../mock/dvhc.json';
import { ISelectType } from '../../../../types/select.types';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import { FORMAT_TIME } from '../../../../constants/time';
import TextArea from 'antd/es/input/TextArea';
import ImgUpload from '../../../../components/base/ImgUpload';
import HanoiMap from '../../../../components/base/HanoiMap';
import { ILatLng } from '../../../../types/badmintonCourt.types';
import { DEFINE_GATHER_LEVEL_ARRAY } from '../../../../constants/level-gather';
import { userBookingService } from '../../../../services';
import { DEFINE_STATUS } from '../../../../constants/status';
import { IUserBookingDetail } from '../../../../types/userBooking.types';
import Visibility from '../../../../components/base/visibility';
import { formatter, parser } from '../../../../utils/input-format-money';
import VideoUpload from '../../../../components/base/VideoUpload';

interface IProps {
  badmintonGather?: IBadmintonGather;
  handleSubmit: (data: FormData) => void;
}

type FieldType = {
  nameClub: string;
  description?: string;
  badmintonCourtName: string;
  district: string;
  ward: string;
  address: string;
  courtNumber: string;
  startTime: string;
  endTime: string;
  appointmentDate: string;
  totalMale: number;
  totalFemale: number;
  constPerMale: number;
  constPerFemale: number;
  imgCourt: string;
  level: string;
};

export default function CreateOrEditBadmintonGather({
  badmintonGather,
  handleSubmit,
}: IProps) {
  const [gatherType, setGatherType] = React.useState<
    'FROM_SCHEDULE' | 'CUSTOM'
  >('CUSTOM');
  const [listUserBooking, setListUserBooking] = React.useState<
    IUserBookingDetail[]
  >([]);
  const [selectedScheduleId, setSelectedScheduleId] = React.useState<string>();
  const [peopleType, setPeopleType] = React.useState<'MALE' | 'FEMALE' | 'ALL'>(
    'ALL',
  );
  const user = useSelector((state: IRootState) => state.user);
  const [file, setFile] = React.useState<File>();
  const [currentImg, setCurrentImg] = React.useState<string | null>(
    badmintonGather?.imgCourt ?? null,
  );

  const [location, setLocation] = React.useState<ILatLng>({
    lat: Number(badmintonGather?.lat),
    lng: Number(badmintonGather?.lang),
  });
  const [form] = Form.useForm();
  const district = Form.useWatch('district', form);

  const districtData = DATA.level2s.map((district): ISelectType => {
    return {
      label: district.name,
      value: district.level2_id,
    };
  });

  const wardData = React.useMemo(() => {
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

  React.useEffect(() => {
    if (selectedScheduleId) {
      const schedule = listUserBooking.find(
        (item) => item.id === selectedScheduleId,
      )!;
      form.setFieldValue(
        'badmintonCourtName',
        schedule.schedule.badmintonCourt.name,
      );
      form.setFieldValue('district', schedule.schedule.badmintonCourt.district);
      form.setFieldValue('ward', schedule.schedule.badmintonCourt.ward);
      form.setFieldValue('address', schedule.schedule.badmintonCourt.address);
      setLocation({
        lat: Number(schedule.schedule.badmintonCourt.lat),
        lng: Number(schedule.schedule.badmintonCourt.lang),
      });
      setCurrentImg(schedule.schedule.badmintonCourt.imageCourt);
      form.setFieldValue('courtNumber', schedule.schedule.courtNumber.name);
      form.setFieldValue(
        'startTime',
        dayjs(schedule.schedule.timeBooking.startTime, FORMAT_TIME),
      );
      form.setFieldValue(
        'endTime',
        dayjs(schedule.schedule.timeBooking.endTime, FORMAT_TIME),
      );
      form.setFieldValue(
        'appointmentDate',
        dayjs(schedule.schedule.appointmentDate),
      );
    }
  }, [selectedScheduleId]);

  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    const data = { ...values };
    if (!user.id) {
      toast.error('User id không tìm thấy');
      return;
    }
    const formData = new FormData();
    formData.append('userId', user.id.toString());
    formData.append('nameClub', data.nameClub);
    formData.append('description', data.description ?? '');
    formData.append('badmintonCourtName', data.badmintonCourtName ?? '');
    formData.append('district', data.district);
    formData.append('ward', data.ward);
    formData.append('address', data.address);
    formData.append('lang', location.lng.toString());
    formData.append('lat', location.lat.toString());
    formData.append('courtNumber', data.courtNumber);
    formData.append('startTime', dayjs(data.startTime).format(FORMAT_TIME));
    formData.append('endTime', dayjs(data.endTime).format(FORMAT_TIME));
    formData.append('appointmentDate', data.appointmentDate.toString());
    formData.append('totalMale', data.totalMale?.toString() ?? 0);
    formData.append('totalFemale', data.totalFemale?.toString() ?? 0);
    formData.append('constPerMale', data.constPerMale?.toString() ?? 0);
    formData.append('constPerFemale', data.constPerFemale?.toString() ?? 0);
    formData.append('level', data.level);

    if (file) formData.append('imgCourt', file);
    if (currentImg) formData.append('imgCourt', currentImg);
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

  const handleGetListSchedule = async () => {
    const rs = await userBookingService.getListUserBookingByUser(user.id, {
      status: DEFINE_STATUS.ACCEPTED,
    });
    setListUserBooking(rs.data.content);
  };

  const options = React.useMemo(() => {
    return listUserBooking.map((item) => ({
      label: (
        <span>
          Sân cầu: {item.schedule.badmintonCourt.name} từ{' '}
          {item.schedule.timeBooking.startTime} đến{' '}
          {item.schedule.timeBooking.endTime}
        </span>
      ),
      value: item.id,
    }));
  }, [listUserBooking]);

  return (
    <div className="w-full pe-10">
      <div className="flex flex-col justify-start items-start">
        <Radio.Group
          className="mt-4"
          onChange={(e) => {
            setGatherType(e.target.value);
            if (e.target.value === 'FROM_SCHEDULE') handleGetListSchedule();
          }}
          value={gatherType}
        >
          <Radio value={'CUSTOM'}>Tự nhập lịch</Radio>
          <Radio value={'FROM_SCHEDULE'}>Chọn từ lịch đã đặt</Radio>
        </Radio.Group>
        <Visibility visibility={gatherType === 'FROM_SCHEDULE'}>
          <Select
            allowClear
            placeholder="Chọn lịch đã được xác nhận"
            className="min-w-[340px] mt-4"
            value={selectedScheduleId}
            onChange={(value) => {
              setSelectedScheduleId(value);
            }}
            options={options}
          />
        </Visibility>
      </div>
      <Form
        className="w-full mt-5"
        form={form}
        labelCol={{ span: 6 }}
        labelAlign="left"
        name="form"
        onFinish={onFinish}
        initialValues={{
          nameClub: badmintonGather?.nameClub,
          description: badmintonGather?.description,
          badmintonCourtName: badmintonGather?.badmintonCourtName,
          district: badmintonGather?.district,
          ward: badmintonGather?.ward,
          address: badmintonGather?.address,
          courtNumber: badmintonGather?.courtNumber,
          startTime: badmintonGather?.startTime
            ? dayjs(badmintonGather?.startTime, FORMAT_TIME)
            : null,
          endTime: badmintonGather?.endTime
            ? dayjs(badmintonGather?.endTime, FORMAT_TIME)
            : null,
          appointmentDate: badmintonGather?.appointmentDate
            ? dayjs(badmintonGather?.appointmentDate)
            : null,
          totalMale: badmintonGather?.totalMale,
          totalFemale: badmintonGather?.totalFemale,
          constPerMale: badmintonGather?.constPerMale,
          constPerFemale: badmintonGather?.constPerFemale,
          level: badmintonGather?.level,
        }}
        autoComplete="off"
      >
        <div className="grid grid-cols-2 gap-x-4">
          <div>
            <Form.Item<FieldType>
              label="Tiêu đề bài đăng"
              name="nameClub"
              rules={[{ required: true, message: 'Hãy nhập tiêu đề bài đăng' }]}
            >
              <Input size="large" />
            </Form.Item>

            <Form.Item<FieldType>
              label="Mô tả câu lạc bộ"
              name="description"
              rules={[{ required: true, message: 'Hãy nhập mô tả về sân' }]}
            >
              <TextArea rows={7} />
            </Form.Item>

            <Form.Item<FieldType>
              label="Tên sân cầu"
              name="badmintonCourtName"
              rules={[{ required: true, message: 'Hãy nhập tên sân cầu' }]}
            >
              <Input disabled={Boolean(selectedScheduleId)} />
            </Form.Item>

            <Form.Item<FieldType>
              label="Quận/huyện"
              name="district"
              rules={[{ required: true, message: 'Hãy nhập tên quận/huyện' }]}
            >
              <Select
                options={districtData}
                disabled={Boolean(selectedScheduleId)}
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
              <Select
                disabled={!district || Boolean(selectedScheduleId)}
                options={wardData}
              />
            </Form.Item>

            <Form.Item<FieldType>
              label="Địa chỉ cụ thể"
              name="address"
              rules={[
                { required: true, message: 'Hãy nhập tên địa chỉ cụ thể' },
              ]}
            >
              <Input disabled={Boolean(selectedScheduleId)} />
            </Form.Item>

            <Form.Item<FieldType>
              label="Sân thi đấu"
              name="courtNumber"
              rules={[
                { required: true, message: 'Hãy nhập tên sân thi đấu cụ thể' },
              ]}
            >
              <Input disabled={Boolean(selectedScheduleId)} />
            </Form.Item>

            <Form.Item<FieldType>
              label="Ngày cho thuê"
              name="appointmentDate"
              rules={[{ required: true, message: 'Hãy nhập ngày cho thuê' }]}
            >
              <DatePicker
                disabled={Boolean(selectedScheduleId)}
                className="w-full"
                format={'DD/MM/YYYY'}
                minDate={dayjs()}
              />
            </Form.Item>

            <Form.Item<FieldType>
              label="Giờ bắt đầu"
              name="startTime"
              rules={[{ required: true, message: 'Hãy nhập giờ bắt đầu' }]}
            >
              <TimePicker
                disabled={Boolean(selectedScheduleId)}
                className="w-full"
                format={FORMAT_TIME}
                placeholder="Chọn thời gian bắt đầu"
              />
            </Form.Item>

            <Form.Item<FieldType>
              label="Giờ kết thúc"
              name="endTime"
              rules={[{ required: true, message: 'Hãy nhập giờ kết thúc' }]}
            >
              <TimePicker
                disabled={Boolean(selectedScheduleId)}
                className="w-full"
                format={FORMAT_TIME}
                placeholder="Chọn thời gian kết thúc"
              />
            </Form.Item>
          </div>
          <div className="flex flex-col">
            <Form.Item<any>
              label={
                <div className="text-sm space-x-2">
                  <span className="text-red-500">*</span>
                  <span>Ảnh của sân</span>
                </div>
              }
            >
              <VideoUpload
                disabled={Boolean(selectedScheduleId)}
                videoProps={currentImg}
                file={file}
                handleUploadFile={handleUploadFile}
              />
            </Form.Item>

            <Form.Item<FieldType>
              label="Chọn nam nữ thuê"
              rules={[
                { required: true, message: 'Hãy nhập số lượng nam cần thuê' },
              ]}
            >
              <div>
                <Radio.Group
                  onChange={(e) => {
                    setPeopleType(e.target.value);
                  }}
                  value={peopleType}
                >
                  <Radio value={'ALL'}>Cả nam và nữ</Radio>
                  <Radio value={'MALE'}>Chỉ nam</Radio>
                  <Radio value={'FEMALE'}>Chỉ nữ</Radio>
                </Radio.Group>
              </div>
            </Form.Item>

            <Form.Item<FieldType> label="Nam cần thuê" name="totalMale">
              <Input type="number" disabled={peopleType === 'FEMALE'} />
            </Form.Item>
            <Form.Item<FieldType> label="Nữ cần thuê" name="totalFemale">
              <Input type="number" disabled={peopleType === 'MALE'} />
            </Form.Item>
            <Form.Item<FieldType> label="Giá thuê nam" name="constPerMale">
              <InputNumber
                className="w-full"
                formatter={formatter}
                parser={parser}
                disabled={peopleType === 'FEMALE'}
              />
            </Form.Item>

            <Form.Item<FieldType> label="Giá thuê nữ" name="constPerFemale">
              <InputNumber
                className="w-full"
                formatter={formatter}
                parser={parser}
                disabled={peopleType === 'MALE'}
              />
            </Form.Item>

            <Form.Item<FieldType>
              label="Trình độ"
              name="level"
              rules={[
                { required: true, message: 'Hãy nhập trình độ cần thuê' },
              ]}
            >
              <Select options={DEFINE_GATHER_LEVEL_ARRAY} />
            </Form.Item>
          </div>
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
            {badmintonGather?.id
              ? 'Cập nhật thông tin giao lưu'
              : 'Thêm mới thông tin giao lưu'}
          </Button>
        </div>
      </Form>
    </div>
  );
}
