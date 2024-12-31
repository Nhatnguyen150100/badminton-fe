import React, { useState } from 'react';
import {
  badmintonGatherCommentService,
  badmintonGatherService,
  gatherBookingService,
} from '../../../../services';
import Visibility from '../../../../components/base/visibility';
import { useParams } from 'react-router-dom';
import { Button, Divider, Empty, message, Spin, Tooltip } from 'antd';
import {
  onGetDistrictName,
  onGetWardName,
} from '../../../../utils/functions/on-location-name';
import HanoiMap from '../../../../components/base/HanoiMap';
import { IBadmintonGather } from '../../../../types/badmintonGather.types';
import { formatDate } from '../../../../utils/functions/format-date';
import { formatCurrencyVND } from '../../../../utils/functions/format-money';
import { onChooseLevelGather } from '../../../../utils/on-choose-level-gather';
import BookingForm from './BookingForm';
import { IRootState } from '../../../../lib/store';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import TextArea from 'antd/es/input/TextArea';
import dayjs from 'dayjs';

export default function GatherPostDetail() {
  const { id } = useParams<{ id: string }>();
  const user = useSelector((state: IRootState) => state.user);
  const [openModal, setOpenModel] = useState(false);
  const [loading, setLoading] = React.useState(false);
  const [gatherDetail, setGatherDetail] = React.useState<IBadmintonGather>();

  const [comment, setComment] = React.useState('');

  const handleGetCourtDetail = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const rs = await badmintonGatherService.getBadmintonGatherDetail(id);
      setGatherDetail(rs.data);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async ({
    numberMale,
    numberFemale,
    note,
  }: {
    numberMale?: number | null;
    numberFemale?: number | null;
    note: string | null;
  }) => {
    if (!user) {
      message.error('Vui lòng đăng nhập để đặt lịch.');
      return;
    }
    const isEnoughMoneyToPay =
      (numberFemale ?? 0) * (gatherDetail?.constPerFemale ?? 0) +
        (numberMale ?? 0) * (gatherDetail?.constPerMale ?? 0) <=
      (user.accountBalance ?? 0);
    if (!isEnoughMoneyToPay) {
      message.error('Bạn không đủ tiền để đặt lịch.');
      return;
    }
    try {
      const rs = await gatherBookingService.createGatherBooking({
        badmintonGatherId: gatherDetail?.id,
        userId: user.id,
        numberMale,
        numberFemale,
        note,
      });
      toast.success(rs.message);
      setOpenModel(false);
    } catch (error: any) {
      message.error(error.message);
    }
  };

  const handleComment = async () => {
    if (!(user.id && gatherDetail?.id)) {
      message.error('Vui lòng đăng nhập để bình luận.');
      return;
    }
    if (!comment) {
      message.error('Vui lòng nhập nội dung bình luận.');
      return;
    }
    try {
      const rs =
        await badmintonGatherCommentService.createBadmintonGatherComment({
          userId: user.id,
          badmintonGatherId: gatherDetail?.id,
          comment,
        });
      toast.success(rs.message);
      handleGetCourtDetail();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  React.useEffect(() => {
    if (id) handleGetCourtDetail();
  }, [id]);

  return (
    <div className="flex flex-col justify-start items-center w-full overflow-y-auto">
      <Visibility
        visibility={Boolean(gatherDetail)}
        suspenseComponent={loading ? <Spin /> : <Empty />}
      >
        <img
          crossOrigin="anonymous"
          className="max-h-[240px] rounded-2xl object-contain"
          src={gatherDetail?.imgCourt}
          alt="Ảnh sân cầu"
        />
        <h1 className="text-start font-bold text-2xl w-full uppercase mt-5">
          {gatherDetail?.nameClub}
        </h1>
        <Divider variant="solid" className="border-[1px] border-gray-300" />
        <div className="w-full flex flex-col justify-start items-start space-y-4">
          <div className="flex flex-row justify-start items-end space-x-2">
            <label className="text-lg">Tên sân cầu:</label>
            <h1 className="text-3xl font-bold">
              {gatherDetail?.badmintonCourtName}
            </h1>
          </div>
          <div className="flex flex-row justify-start items-end space-x-2">
            <label className="text-lg">Chủ câu lạc bộ:</label>
            <h1 className="text-lg font-bold">
              {gatherDetail?.user?.fullName ?? gatherDetail?.user?.email}
            </h1>
          </div>
          <div className="flex flex-row justify-start items-end space-x-2">
            <label className="text-lg">Số điện thoại câu lạc bộ:</label>
            <Tooltip title="Nhấn để gọi">
              <a
                href={`tel:${gatherDetail?.user?.phoneNumber}`}
                className="text-lg font-semibold text-blue-500 underline"
              >
                {gatherDetail?.user?.phoneNumber}
              </a>
            </Tooltip>
          </div>
          <div className="flex flex-row justify-start items-center space-x-2">
            <label className="text-lg">Địa chỉ sân cầu:</label>
            <img
              className="h-[26px]"
              alt="location"
              src="/icons/location.png"
            />
            <span>{`${onGetDistrictName(
              gatherDetail?.district,
            )} - ${onGetWardName(
              gatherDetail?.district,
              gatherDetail?.ward,
            )} - ${gatherDetail?.address}`}</span>
          </div>
          <div className="flex flex-row justify-start items-start space-x-2">
            <label className="text-lg">Mô tả câu lạc bộ:</label>
            <pre>{gatherDetail?.description}</pre>
          </div>
        </div>
        <h1 className="text-start font-bold text-2xl w-full uppercase mt-5">
          Lịch thi đấu
        </h1>
        <Divider variant="solid" className="border-[1px] border-gray-300" />
        <div className="flex flex-col justify-start items-start space-y-3 w-full">
          <div className="flex flex-row justify-start items-center space-x-4">
            <div className="flex flex-row items-center space-x-2">
              <img
                className="h-[26px]"
                alt="schedule"
                src="/icons/schedule.png"
              />
              <label className="text-lg">Ngày:</label>
            </div>
            <span className=" text-xl font-medium">
              {formatDate(gatherDetail?.appointmentDate ?? '')}
            </span>
          </div>
          <div className="flex flex-row justify-start items-center space-x-4">
            <div className="flex flex-row items-center space-x-2">
              <img
                className="h-[26px]"
                alt="chronometer"
                src="/icons/chronometer.png"
              />
              <label className="text-lg">Từ : </label>
            </div>
            <span className=" text-xl font-medium">
              {gatherDetail?.startTime} đến {gatherDetail?.endTime}
            </span>
          </div>
        </div>
        <h1 className="text-start font-bold text-2xl w-full uppercase mt-5">
          Thông tin chi tiết về số lượng người cần thuê
        </h1>
        <Divider variant="solid" className="border-[1px] border-gray-300" />
        <div className="flex flex-col justify-start items-start space-y-3 w-full">
          <div className="flex flex-row justify-start items-center space-x-4">
            <label className="text-lg">Số lượng nam cần thuê:</label>
            <div className="flex flex-row items-center space-x-2">
              <span className=" text-xl font-medium">
                {gatherDetail?.totalMale} nam
              </span>
              <img className="h-[26px]" alt="male" src="/icons/male.png" />
            </div>
          </div>
          <div className="flex flex-row justify-start items-center space-x-4">
            <label className="text-lg">Số lượng nữ cần thuê:</label>
            <div className="flex flex-row items-center space-x-2">
              <span className=" text-xl font-medium">
                {gatherDetail?.totalFemale} nữ
              </span>
              <img className="h-[26px]" alt="male" src="/icons/female.png" />
            </div>
          </div>
          <Visibility visibility={Boolean(gatherDetail?.constPerMale)}>
            <div className="flex flex-row justify-start items-center space-x-4">
              <div className="flex flex-row items-center space-x-2">
                <img className="h-[26px]" alt="money" src="/icons/money.png" />
                <label className="text-lg">Giá thuê nam:</label>
              </div>
              <span className=" text-xl font-medium">
                {formatCurrencyVND(gatherDetail?.constPerMale ?? 0)}
              </span>
            </div>
          </Visibility>
          <Visibility visibility={Boolean(gatherDetail?.constPerFemale)}>
            <div className="flex flex-row justify-start items-center space-x-4">
              <div className="flex flex-row items-center space-x-2">
                <img className="h-[26px]" alt="money" src="/icons/money.png" />
                <label className="text-lg">Giá thuê nữ:</label>
              </div>
              <span className=" text-xl font-medium">
                {formatCurrencyVND(gatherDetail?.constPerFemale ?? 0)}
              </span>
            </div>
          </Visibility>
          <div className="flex flex-row justify-start items-center space-x-4">
            <div className="flex flex-row items-center space-x-2">
              <img className="h-[26px]" alt="level" src="/icons/level.png" />
              <label className="text-lg">Trình độ:</label>
            </div>
            <span className=" text-xl font-medium">
              {onChooseLevelGather(gatherDetail?.level ?? 'Y')}
            </span>
          </div>
        </div>
        <Visibility
          visibility={
            !(gatherDetail?.totalMale === 0 || gatherDetail?.totalFemale === 0)
          }
          suspenseComponent={
            <div className="py-2 px-5 min-w-[520px] rounded-lg bg-red-600 text-white text-center cursor-not-allowed">
              Số lượng người đăng kí đã đủ. Không nhận đăng kí thêm
            </div>
          }
        >
          <Visibility
            visibility={
              dayjs(gatherDetail?.appointmentDate).isSame(dayjs(), 'day') ||
              dayjs(gatherDetail?.appointmentDate).isAfter(dayjs())
            }
            suspenseComponent={
              <div className="py-2 px-5 min-w-[520px] rounded-lg bg-red-600 text-white text-center cursor-not-allowed">
                Quá hạn ngày đăng kí
              </div>
            }
          >
            <Button
              type="primary"
              variant="filled"
              className="h-[40px] min-w-[280px]"
              onClick={() => {
                if (user.id === gatherDetail?.userId) {
                  message.error('Bạn không thể đặt lịch cho chính bạn!');
                  return;
                }
                setOpenModel(true);
              }}
            >
              Đăng kí tham gia
            </Button>
          </Visibility>
        </Visibility>
        <h1 className="text-start font-bold text-2xl w-full uppercase mt-5">
          Vị trí sân cầu {gatherDetail?.badmintonCourtName} trên bản đồ
        </h1>
        <Divider variant="solid" className="border-[1px] border-gray-300" />
        <Visibility
          visibility={Boolean(gatherDetail?.lat && gatherDetail.lang)}
        >
          <HanoiMap
            location={{
              lat: Number(gatherDetail?.lat) ?? 0,
              lng: Number(gatherDetail?.lang) ?? 0,
            }}
          />
        </Visibility>
        <h1 className="text-start font-bold text-2xl w-full uppercase mt-5">
          Bình luận về bài đăng
        </h1>
        <Divider variant="solid" className="border-[1px] border-gray-300" />
        <Visibility
          visibility={Boolean(
            gatherDetail?.badmintonGatherComments?.length && gatherDetail,
          )}
        >
          <div className="flex flex-col justify-start items-start space-y-4 w-full mb-5">
            {gatherDetail?.badmintonGatherComments?.map((item) => {
              return (
                <div
                  key={item.id}
                  className="flex flex-row justify-between items-start space-x-3"
                >
                  <img
                    crossOrigin="anonymous"
                    className="h-[56px] w-[56px] rounded-[50%]"
                    alt="user"
                    src={item.user?.avatar ?? ''}
                  />
                  <div className="flex flex-col items-start justify-start space-y-1">
                    <span className="text-lg font-semibold">
                      {item.user?.fullName ?? item.user?.email}{' '}
                      <span className="text-sm font-thin">
                        ({formatDate(item.createdAt)})
                      </span>
                    </span>
                    <p>{item.comment}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Visibility>
      </Visibility>
      <div className="w-full flex flex-col justify-start items-end space-y-3">
        <TextArea
          rows={3}
          className="w-full p-3"
          placeholder="Nhập để bình luận"
          value={comment}
          onChange={(e) => {
            setComment(e.target.value);
          }}
        />
        <Button
          type="primary"
          variant="filled"
          className="h-[40px] min-w-[280px]"
          onClick={handleComment}
        >
          Bình luận
        </Button>
      </div>
      <Visibility visibility={Boolean(gatherDetail)}>
        <BookingForm
          gatherDetail={gatherDetail!}
          isOpenModal={openModal}
          handleClose={() => setOpenModel(false)}
          handleOk={handleSubmit}
        />
      </Visibility>
    </div>
  );
}
