export type SubmissionMemberHours = {
  id: string;
  name: string;
  hours: number;
};

export type MemberHoursSlice = SubmissionMemberHours & {
  percentage: number;
  fill: string;
};

export function buildMemberHoursChart(
  members: SubmissionMemberHours[],
): { slices: MemberHoursSlice[]; totalHours: number } {
  const positiveMembers = members
    .map((member) => ({
      ...member,
      hours: Number.isFinite(member.hours) ? Math.max(0, member.hours) : 0,
    }))
    .filter((member) => member.hours > 0);

  const totalHours = positiveMembers.reduce(
    (total, member) => total + member.hours,
    0,
  );

  return {
    totalHours,
    slices: positiveMembers.map((member, index) => ({
      ...member,
      percentage: totalHours > 0 ? (member.hours / totalHours) * 100 : 0,
      fill: `var(--chart-${(index % 5) + 1})`,
    })),
  };
}
