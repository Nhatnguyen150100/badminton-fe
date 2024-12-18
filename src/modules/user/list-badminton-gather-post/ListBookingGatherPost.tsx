import * as React from 'react';
import { IBadmintonCourt } from '../../../types/badmintonCourt.types';
import { IBaseQuery } from '../../../types/query.types';
import Visibility from '../../../components/base/visibility';
import {
  Button,
  DatePicker,
  Empty,
  message,
  Select,
  Spin,
  TimePicker,
} from 'antd';
import {
  badmintonCourtService,
  badmintonGatherService,
} from '../../../services';
import {
  CompassOutlined,
  FilterOutlined,
  InfoOutlined,
} from '@ant-design/icons';
import {
  onGetDistrictName,
  onGetWardName,
} from '../../../utils/functions/on-location-name';
import CourtMapPost from '../../../components/base/CourtMapPost';
import DATA from '../../../mock/dvhc.json';
import { ISelectType } from '../../../types/select.types';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { IRootState } from '../../../lib/store';
import { IBadmintonGather } from '../../../types/badmintonGather.types';
import { DEFINE_ROUTERS_USER } from '../../../constants/routers-mapper';
import { formatCurrencyVND } from '../../../utils/functions/format-money';
import { DEFINE_GATHER_LEVEL_ARRAY } from '../../../constants/level-gather';
import { FORMAT_TIME } from '../../../constants/time';
import dayjs from 'dayjs';
import BaseModal from '../../../components/base/BaseModal';

const DEFINE_PRICE_FILTER = [
  {
    label: 'Nhỏ hơn 40k',
    value: 40000,
  },
  {
    label: 'Nhỏ hơn 50k',
    value: 50000,
  },

  {
    label: 'Nhỏ hơn 60k',
    value: 60000,
  },
  {
    label: 'Nhỏ hơn 80k',
    value: 80000,
  },
  {
    label: 'Nhỏ hơn 100k',
    value: 100000,
  },
  {
    label: 'Nhỏ hơn 150k',
    value: 150000,
  },
  {
    label: 'Nhỏ hơn 200k',
    value: 200000,
  },
];

export default function ListBadmintonGatherPost() {
  const user = useSelector((state: IRootState) => state.user);
  const navigate = useNavigate();
  const [listGather, setListGather] = React.useState<IBadmintonGather[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [query, setQuery] = React.useState<IBaseQuery>({
    limit: 5,
    page: 1,
    sortBy: 'createdAt',
  });

  const [openModalFilter, setOpenModalFilter] = React.useState<boolean>(false);

  const handleGetList = async () => {
    try {
      setLoading(true);
      const rs = await badmintonGatherService.getBadmintonGatherList(query);
      setListGather(rs.data.content);
      setQuery({ ...query, total: rs.data.totalCount });
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const listMarkers = React.useMemo(() => {
    return listGather.map((gather) => ({
      id: gather.id,
      position: [gather.lat, gather.lang],
      address: gather.address,
    }));
  }, [listGather]);

  React.useEffect(() => {
    handleGetList();
  }, [query.limit]);

  const districtData = DATA.level2s.map((district): ISelectType => {
    return {
      label: district.name,
      value: district.level2_id,
    };
  });

  const wardData = React.useMemo(() => {
    if (!query.district) return [];
    const currentDistrict = DATA.level2s.find(
      (districtData) => districtData.level2_id === query.district,
    );
    return currentDistrict?.level3s.map(
      (wardData): ISelectType => ({
        label: wardData.name,
        value: wardData.level3_id,
      }),
    );
  }, [query.district]);

  return (
    <>
      <div className="flex flex-row justify-between items-center mb-5 w-full">
        <Button
          icon={<FilterOutlined />}
          onClick={() => {
            setOpenModalFilter(true);
          }}
        >
          Bộ lọc
        </Button>
        <BaseModal
          isOpen={openModalFilter}
          title="Bộ lọc bài đăng giao lưu"
          footer={
            <div className="flex flex-row w-full justify-end items-center">
              <Button
                type="primary"
                className="min-w-[120px]"
                onClick={() => {
                  handleGetList();
                  setOpenModalFilter(false);
                }}
              >
                Tìm kiếm
              </Button>
            </div>
          }
          handleClose={() => {
            setOpenModalFilter(false);
          }}
        >
          <div className="grid grid-cols-2 gap-5">
            <Select
              options={[
                { label: 'Ngày tạo mới nhất', value: 'createdAt' },
                { label: 'Sắp diễn ra', value: 'appointmentDate' },
              ]}
              value={query.sortBy}
              onChange={(value) => {
                setQuery((pre) => ({ ...pre, sortBy: value }));
              }}
              placeholder="Lọc theo ngày"
            />
            <Select
              className="min-w-[120px]"
              placeholder="Lọc theo quận/huyện"
              allowClear
              onClear={() => {
                setQuery(
                  (pre) => ({ ...pre, ward: null } as unknown as IBaseQuery),
                );
              }}
              value={query.district}
              onChange={(value) =>
                setQuery((pre) => ({ ...pre, district: value }))
              }
            >
              {districtData.map((district) => (
                <Select.Option key={district.value} value={district.value}>
                  {district.label}
                </Select.Option>
              ))}
            </Select>
            <Select
              className="min-w-[120px]"
              disabled={!query?.district}
              placeholder="Lọc theo phường/xã"
              allowClear
              onChange={(value) => setQuery((pre) => ({ ...pre, ward: value }))}
              value={query.ward}
            >
              {wardData!.map((ward) => (
                <Select.Option key={ward.value} value={ward.value}>
                  {ward.label}
                </Select.Option>
              ))}
            </Select>
            <Select
              allowClear
              placeholder="Lọc theo trình độ cần tuyển"
              value={query.level}
              onChange={(value) =>
                setQuery((pre) => ({ ...pre, level: value }))
              }
              options={DEFINE_GATHER_LEVEL_ARRAY}
            />
            <Select
              allowClear
              className="min-w-[160px]"
              placeholder="Lọc theo giá"
              value={query.price}
              onChange={(value) =>
                setQuery((pre) => ({ ...pre, price: value }))
              }
              options={DEFINE_PRICE_FILTER}
            />
            <TimePicker
              className="min-w-[160px]"
              value={
                query.startTime ? dayjs(query.startTime, FORMAT_TIME) : null
              }
              onChange={(value) =>
                setQuery((pre) => ({
                  ...pre,
                  startTime: value ? dayjs(value).format(FORMAT_TIME) : value,
                }))
              }
              format={FORMAT_TIME}
              placeholder="Thời gian bắt đầu"
            />
            <Select
              placeholder="Lọc theo giới tính"
              allowClear
              value={query.gender}
              onChange={(value) =>
                setQuery((pre) => ({ ...pre, gender: value }))
              }
              options={[
                {
                  label: 'Chỉ nam',
                  value: 'Male',
                },
                {
                  label: 'Chỉ nữ',
                  value: 'Female',
                },
                {
                  label: 'Cả nam và nữ',
                  value: 'ALL',
                },
              ]}
            />
            <DatePicker
              format={'DD/MM/YYYY'}
              placeholder="Tìm ngày cụ thể"
              value={
                query.appointmentDate ? dayjs(query.appointmentDate) : null
              }
              onChange={(value) =>
                setQuery((pre) => ({
                  ...pre,
                  appointmentDate: value ? dayjs(value) : value,
                }))
              }
            />
          </div>
        </BaseModal>
      </div>
      <div
        className={`h-[calc(100vh-230px)] grid gap-x-3 ${
          Boolean(listGather.length) ? 'grid-cols-2' : 'grid-cols-1 w-full'
        }`}
      >
        <Visibility
          visibility={Boolean(listGather.length)}
          suspenseComponent={loading ? <Spin /> : <Empty />}
        >
          <div className="h-full overflow-y-auto overflow-x-hidden flex-col justify-center items-start space-y-3">
            {listGather.map((gather) => (
              <div
                key={gather.id}
                onClick={() => {
                  if (!user.id) {
                    message.error(
                      'Vui lòng đăng nhập để xem thông tin chi tiết',
                    );
                    return;
                  }
                  navigate(
                    DEFINE_ROUTERS_USER.gatherPostDetail.replace(
                      ':id',
                      gather.id,
                    ),
                  );
                }}
                className="flex flex-row justify-start items-start rounded-2xl shadow-xl p-5 space-x-5 cursor-pointer border border-solid hover:border-dashed hover:border hover:border-blue-500"
              >
                <div className="relative">
                  <img
                    className="h-full max-w-[260px] rounded-xl object-cover"
                    src={gather.imgCourt}
                    alt="Ảnh sân"
                  />
                  <div className="absolute py-1 px-2 top-1 right-1 bg-red-600 rounded-xl">
                    <span className="text-white text-xs">{`Từ ${formatCurrencyVND(
                      gather.constPerFemale,
                    )}`}</span>
                  </div>
                </div>
                <div className="flex flex-col justify-start items-start space-y-1">
                  <h1 className="capitalize text-xl font-bold">
                    {gather.nameClub}
                  </h1>
                  <div className="flex flex-row justify-start items-center space-x-2">
                    <img
                      className="h-[26px]"
                      alt="location"
                      src="/icons/location.png"
                    />
                    <span>{`${onGetDistrictName(
                      gather.district,
                    )} - ${onGetWardName(gather.district, gather.ward)} - ${
                      gather.address
                    }`}</span>
                  </div>
                  <div className="flex flex-row justify-start items-center space-x-2">
                    <img
                      className="h-[26px]"
                      alt="notes"
                      src="/icons/notes.png"
                    />
                    <span className="whitespace-pre-wrap capitalize">
                      {gather.description}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            <div className="flex justify-center items-center">
              <Visibility
                visibility={
                  query?.total ? listGather?.length < query?.total : true
                }
              >
                <Button
                  type="primary"
                  onClick={() => {
                    setQuery({ ...query, limit: query.limit! + 3 });
                  }}
                >
                  Xem thêm
                </Button>
              </Visibility>
            </div>
          </div>
          <CourtMapPost listLocation={listMarkers} />
        </Visibility>
      </div>
    </>
  );
}
