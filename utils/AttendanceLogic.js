export const getSubjectStats = (records) => {
  const total = records.length;
  const present = records.filter(r => r.status === "Present").length;

  const percentage =
    total === 0 ? 0 : Math.round((present / total) * 100);

  const requiredFor75 = Math.ceil(0.75 * total);
  const needMore =
    present >= requiredFor75 ? 0 : requiredFor75 - present;

  return {
    total,
    present,
    percentage,
    needMore
  };
};