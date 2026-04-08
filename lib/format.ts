export function formatDate(dateStr: string, isSimple?: boolean) {
  const date = new Date(dateStr);

  if (isSimple) {
    return date.toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  }

  return date.toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
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
