import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../../../lib/store';
import {
  Button,
  DatePicker,
  Form,
  FormProps,
  Input,
  InputNumber,
  Radio,
  Spin,
} from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import GeneralLoading from '../../../components/base/GeneralLoading';
import { profileService } from '../../../services';
import { toast } from 'react-toastify';
import { setUser } from '../../../lib/reducer/userSlice';
import AvatarUpload from '../../../components/common/AvatarUpload';
import { useNavigate } from 'react-router-dom';
import { formatter, parser } from '../../../utils/input-format-money';
import { IUser } from '../../../types/user.types';

type FieldType = {
  email: string;
  fullName?: string;
  gender?: string;
  phoneNumber?: number;
  accountBalance?: number;
};

export default function Profile() {
  const [file, setFile] = React.useState<File>();
  const [form] = Form.useForm();
  const user = useSelector((state: IRootState) => state.user);
  const [userInfo, setUserInfo] = React.useState<IUser>();
  const dispatch = useDispatch();
  const [loading, setLoading] = React.useState(false);
  const [currentAvatar, setCurrentAvatar] = React.useState<string | null>();
  const navigate = useNavigate();

  const handleGetProfile = async () => {
    try {
      setLoading(true);
      const rs = await profileService.getProfile(user.id);
      setUserInfo(rs.data);
      setCurrentAvatar(rs.data.avatar);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (user.id) handleGetProfile();
  }, [user.id]);

  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    const data = { ...values };
    try {
      setLoading(true);
      const formData = new FormData();
      if (file) formData.append('avatar', file);
      formData.append('fullName', data.fullName!);
      formData.append('gender', data.gender!);
      formData.append('phoneNumber', data.phoneNumber!.toString());
      formData.append('accountBalance', data.accountBalance!.toString());
      const rs = await profileService.updateProfile(user.id, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      dispatch(setUser({ ...user, ...rs.data }));
      toast.success(rs.message);
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadFile = async (file: File | undefined) => {
    setFile(file);
    setCurrentAvatar(null);
  };

  if (!userInfo?.id)
    return (
      <div className="w-full h-full flex justify-center items-center">
        <Spin />
      </div>
    );

  return (
    <div className="p-10 rounded-2xl border-[2px] border-blue-500 border-dotted flex flex-col justify-center items-start w-full">
      <Form
        className="w-full mt-5"
        form={form}
        labelCol={{ span: 6 }}
        labelAlign="left"
        name="form"
        onFinish={onFinish}
        initialValues={{
          email: userInfo?.email,
          fullName: userInfo?.fullName,
          gender: userInfo?.gender ?? 'Male',
          phoneNumber: userInfo?.phoneNumber,
          accountBalance: userInfo?.accountBalance,
        }}
        autoComplete="off"
      >
        <Form.Item<any> label="Ảnh đại diện">
          <AvatarUpload
            avatar={currentAvatar ?? null}
            file={file}
            handleUploadFile={handleUploadFile}
          />
        </Form.Item>

        <Form.Item<FieldType>
          label="Email"
          name="email"
          rules={[{ required: true, message: 'Please input character' }]}
        >
          <Input disabled />
        </Form.Item>

        <Form.Item<FieldType>
          label="Tên đầy đủ"
          name="fullName"
          rules={[{ required: true, message: 'Please input full name' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label="Giới tính"
          name="gender"
          rules={[{ required: true, message: 'Please input gender' }]}
        >
          <Radio.Group>
            <Radio value={'Male'}>Nam</Radio>
            <Radio value={'Female'}>Nữ</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item<FieldType>
          label="Số điện thoại"
          name="phoneNumber"
          rules={[{ required: true, message: 'Please input phone number' }]}
        >
          <Input type="number" />
        </Form.Item>

        <Form.Item<FieldType>
          label="Số dư tài khoản"
          name="accountBalance"
          rules={[
            { required: true, message: 'Hãy nhập số tiền có trong tài khoản' },
          ]}
        >
          <InputNumber
            className="w-full"
            formatter={formatter}
            parser={parser}
          />
        </Form.Item>

        <div className="w-full flex justify-end items-end">
          <Button type="primary" htmlType="submit">
            Cập nhật thông tin người dùng
          </Button>
        </div>
      </Form>
      <GeneralLoading isLoading={loading} />
    </div>
  );
}
