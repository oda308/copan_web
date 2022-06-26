export default function getToday(): string {
  const now = new Date();
  const year = now.getFullYear().toString();
  const month = (now.getMonth() + 1).toString();
  const date = now.getDate().toString();

  return `${year}-${month}-${date}`;
}
