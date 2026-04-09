export function formatDate(dateStr: string, isSimple?: boolean) {
  const date = new Date(dateStr);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  if (isSimple) {
    return `${year}.${month}.${day}`;
  }

  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");

  return `${year}.${month}.${day} ${hour}:${minute}`;
}

export function formatAmount(amount: number) {
  return new Intl.NumberFormat("ko-KR").format(amount);
}

export async function ensureMinDelay(startTime: number, min = 400) {
  const elapsed = Date.now() - startTime;
  if (elapsed < min) {
    await new Promise((res) => setTimeout(res, min - elapsed));
  }
}
