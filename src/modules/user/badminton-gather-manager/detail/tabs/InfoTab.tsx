import * as React from 'react'
import { badmintonGatherService } from '../../../../../services';
import { IBadmintonGather } from '../../../../../types/badmintonGather.types';
import { toast } from 'react-toastify';
import Visibility from '../../../../../components/base/visibility';
import GeneralLoading from '../../../../../components/base/GeneralLoading';
import CreateOrEditBadmintonGather from '../../common/CreateOrEditBadmintonGather';

interface IProps {
  id: string;
}

export default function InfoTab({id}: IProps) {
  const [loading, setLoading] = React.useState(false);
  const [gatherDetail, setGatherDetail] = React.useState<IBadmintonGather>();

  const handleSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      const rs = await badmintonGatherService.updateBadmintonGather(id, data);
      toast.success(rs.message);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGetGatherDetail = async () => {
    try {
      setLoading(true);
      const rs = await badmintonGatherService.getBadmintonGatherDetail(id);
      setGatherDetail(rs.data);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (id) handleGetGatherDetail();
  }, [id]);

  return (
    <>
      <Visibility visibility={Boolean(gatherDetail)}>
        <CreateOrEditBadmintonGather
          badmintonGather={gatherDetail}
          handleSubmit={handleSubmit}
        />
      </Visibility>
      <GeneralLoading isLoading={loading} />
    </>
  )
}