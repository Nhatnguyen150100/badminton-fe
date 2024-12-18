import dayjs from "dayjs";

export function formatDate(dateString: string | Date): string {
  if(!dateString) return ''
  // Chuyển đổi đối tượng ngày thành dayjs
  const dayjsDate = dayjs(dateString);

  // Kiểm tra tính hợp lệ của ngày
  if (!dayjsDate.isValid()) {
    throw new Error("Invalid date format");
  }

  // Định dạng ngày theo dạng DD/MM/YYYY
  return dayjsDate.format('DD/MM/YYYY');
}
