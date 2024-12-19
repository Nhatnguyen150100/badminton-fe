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
  message,
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
import { formatCurrencyVND } from '../../../utils/functions/format-money';
import { MoneyCollectOutlined } from '@ant-design/icons';
import BaseModal from '../../../components/base/BaseModal';
import paymentService from '../../../services/paymentService';

type FieldType = {
  email: string;
  fullName?: string;
  gender?: string;
  phoneNumber?: number;
};

export default function Profile() {
  const [file, setFile] = React.useState<File>();
  const [form] = Form.useForm();
  const user = useSelector((state: IRootState) => state.user);
  const [userInfo, setUserInfo] = React.useState<IUser>();
  const dispatch = useDispatch();
  const [loading, setLoading] = React.useState(false);
  const [loadingPosition, setLoadingPosition] = React.useState<boolean>(false);
  const [currentAvatar, setCurrentAvatar] = React.useState<string | null>();
  const [openModal, setOpenModal] = React.useState<boolean>(false);
  const [currentMoney, setCurrentMoney] = React.useState<number>();
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

  const handleCreatePayment = async () => {
    if (!currentMoney) {
      message.error('Vui lòng nhập số tiền để thanh toán');
      return;
    }
    try {
      setLoadingPosition(true);
      const rs = await paymentService.createPayment({
        id: user.id,
        amount: currentMoney,
      });
      const urlPayment = rs.data;
      window.open(urlPayment, '_self');
      setOpenModal(false);
      setCurrentMoney(undefined);
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setLoadingPosition(false);
    }
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
        }}
        autoComplete="off"
      >
        <Form.Item<any> label="Ảnh đại diện">
          <div className="flex flex-row justify-between items-start">
            <AvatarUpload
              avatar={currentAvatar ?? null}
              file={file}
              handleUploadFile={handleUploadFile}
            />
            <div className="flex flex-col justify-start items-end space-y-3">
              <div className="flex flex-row justify-start items-center space-x-3">
                <span className="text-xl">Số dư tài khoản:</span>
                <span className="text-green-800 text-xl font-bold">
                  {formatCurrencyVND(userInfo?.accountBalance ?? 0)}
                </span>
              </div>
              <Button
                variant="filled"
                type="primary"
                onClick={() => {
                  setOpenModal(true);
                }}
                icon={<MoneyCollectOutlined />}
              >
                Nạp tiền
              </Button>
            </div>
          </div>
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

        <div className="w-full flex justify-end items-end">
          <Button type="primary" htmlType="submit">
            Cập nhật thông tin người dùng
          </Button>
        </div>
      </Form>
      <GeneralLoading isLoading={loading} />
      <BaseModal
        isOpen={openModal}
        loading={loadingPosition}
        title="Nạp tiền vào tài khoản"
        onOk={handleCreatePayment}
        handleClose={() => {
          setOpenModal(false);
          setCurrentMoney(undefined);
        }}
      >
        <InputNumber
          className="w-full"
          min={0}
          value={currentMoney}
          formatter={formatter}
          parser={parser}
          onChange={(value) => {
            setCurrentMoney(value as number);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleCreatePayment();
          }}
          placeholder="Hãy nhập số tiền cần nạp"
        />
      </BaseModal>
    </div>
  );
}
