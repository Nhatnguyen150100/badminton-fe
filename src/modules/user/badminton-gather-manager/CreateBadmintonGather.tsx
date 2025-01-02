import * as React from 'react';
import GeneralLoading from '../../../components/base/GeneralLoading';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import CreateOrEditBadmintonGather from './common/CreateOrEditBadmintonGather';
import { badmintonGatherService } from '../../../services';

export default function CreateBadmintonGather() {
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      const rs = await badmintonGatherService.createBadmintonGather(data);
      toast.success(rs.message);
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        className="min-w-[220px]"
        icon={<ArrowLeftOutlined />}
        onClick={() => {
          navigate(-1);
        }}
      >
        Trở lại
      </Button>
      <CreateOrEditBadmintonGather handleSubmit={handleSubmit} />
      <GeneralLoading isLoading={loading} />
    </>
  );
}
