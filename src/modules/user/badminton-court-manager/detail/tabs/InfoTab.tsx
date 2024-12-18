import * as React from 'react';
import GeneralLoading from '../../../../../components/base/GeneralLoading';
import CreateOrEditCourtInfo from '../../common/CreateOrEditCourtInfo';
import { badmintonCourtService } from '../../../../../services';
import { IBadmintonCourt } from '../../../../../types/badmintonCourt.types';
import { toast } from 'react-toastify';
import Visibility from '../../../../../components/base/visibility';
import { useDispatch } from 'react-redux';
import { setBadmintonCourtDetail } from '../../../../../lib/reducer/BadmintonCourtSlice';

interface IProps {
  id: string;
}

export default function InfoTab({ id }: IProps) {
  const dispatch = useDispatch();
  const [loading, setLoading] = React.useState(false);
  const [courtDetail, setCourtDetail] = React.useState<IBadmintonCourt>();

  const handleSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      const rs = await badmintonCourtService.updateBadmintonCourt(id, data);
      toast.success(rs.message);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGetCourtDetail = async () => {
    try {
      setLoading(true);
      const rs = await badmintonCourtService.getBadmintonCourtDetail(id);
      setCourtDetail(rs.data);
      dispatch(setBadmintonCourtDetail(rs.data));
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (id) handleGetCourtDetail();
  }, [id]);

  return (
    <>
      <Visibility visibility={Boolean(courtDetail)}>
        <CreateOrEditCourtInfo
          badmintonCourt={courtDetail}
          handleSubmit={handleSubmit}
        />
      </Visibility>
      <GeneralLoading isLoading={loading} />
    </>
  );
}
