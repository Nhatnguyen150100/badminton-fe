import * as React from 'react';
import { useSelector } from 'react-redux';
import { IRootState } from '../../../lib/store';
import { Navigate } from 'react-router-dom';
import { DEFINE_ROUTERS_USER } from '../../../constants/routers-mapper';
import { toast } from 'react-toastify';
import Visibility from '../../../components/base/visibility';
import BadmintonCourtTable from './BadmintonCourtTable';
export default function BadmintonCourtRoot() {
  const user = useSelector((state: IRootState) => state.user);

  const isUpdateProfile = React.useMemo((): boolean => {
    const isUpdate = Boolean(user.fullName && user.phoneNumber);
    if (!isUpdate)
      toast.error('Hãy cập nhật đầy đủ thông tin các nhân trước khi đăng tin');
    return isUpdate;
  }, [user]);

  return (
    <>
      <Visibility
        visibility={isUpdateProfile}
        suspenseComponent={
          <Navigate to={DEFINE_ROUTERS_USER.profile} replace={true} />
        }
      >
        <div className="w-full space-y-5 flex flex-col justify-start items-start mb-5">
          <h1 className="text-start font-bold text-xl">
            Danh sách thông tin các sân cầu
          </h1>
        </div>
        <BadmintonCourtTable />
      </Visibility>
    </>
  );
}
