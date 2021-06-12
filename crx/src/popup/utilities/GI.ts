export function convertTimezone(date: Date, timezone: string): Date {
  const target = date.toLocaleString('en-US', {
    timeZone: timezone,
  });
  return new Date(Date.parse(target));
}

export function isBetweenLogin(a: Date): [boolean, Date, Date] {
  const now = new Date();
  const lowerBound = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    4
  );
  const upperBound = new Date(lowerBound);
  upperBound.setDate(upperBound.getDate() + 1);
  if (
    a.getTime() > lowerBound.getTime() &&
    a.getTime() < upperBound.getTime()
  ) {
    return [true, lowerBound, upperBound];
  }
  return [false, lowerBound, upperBound];
}

export default null;
