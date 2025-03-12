export default function dateConversion(period) {
  const yer = parseInt(period.slice(0, 4));
  const month = parseInt(period.slice(6, 8));
  const endDey = new Date(yer, month, 0).getDate();

  return {
    beginningOfPeriod: period + `-${'01'}`,
    endOfPeriod: period + `-${endDey}`,
  };
}
