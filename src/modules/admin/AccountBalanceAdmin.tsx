import * as React from 'react';
import { useSelector } from 'react-redux';
import { IRootState } from '../../lib/store';
import { formatCurrencyVND } from '../../utils/functions/format-money';
import { IUser } from '../../types/user.types';
import { profileService } from '../../services';
import { Spin } from 'antd';

export default function AccountBalanceAdmin() {
  const user = useSelector((state: IRootState) => state.user);
  const [loading, setLoading] = React.useState(false);
  const [userInfo, setUserInfo] = React.useState<IUser>();

  const handleGetProfile = async () => {
    try {
      setLoading(true);
      const rs = await profileService.getProfile(user.id);
      setUserInfo(rs.data);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (user.id) handleGetProfile();
  }, [user.id]);

  if (!userInfo?.id)
    return (
      <div className="w-full h-full flex justify-center items-center">
        <Spin />
      </div>
    );

  return (
    <div className="flex flex-col justify-start items-start space-y-3">
      <label className='text-xl'>
        Tổng số tiền đã nhận chiết khấu:{' '}
        <span className='text-green-800 font-semibold'>{formatCurrencyVND(userInfo.accountBalance ?? 0)}</span>
      </label>
    </div>
  );
}
