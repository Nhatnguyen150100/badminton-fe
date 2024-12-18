export function formatCurrencyVND(amount: number): string {
  if (isNaN(amount)) {
    throw new Error("Invalid amount");
  }

  const formattedAmount = amount.toLocaleString('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
  });

  return formattedAmount.replace('₫', '').trim() + ' VND';
}
