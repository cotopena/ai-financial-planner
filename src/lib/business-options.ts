export const businessProfileOptions = [
  { value: "services", label: "Services" },
  { value: "retail", label: "Retail" },
  { value: "hospitality", label: "Hospitality" },
  { value: "ecommerce", label: "E-commerce" },
  { value: "saas", label: "SaaS / software" },
  { value: "manufacturing", label: "Manufacturing" },
  { value: "other", label: "Other" },
] as const;

export const businessStageOptions = [
  { value: "startup", label: "Startup" },
  { value: "ongoing", label: "Ongoing business" },
] as const;

export const monthOptions = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
] as const;

export function formatStartPeriod(startMonth: number, startYear: number) {
  const month = monthOptions.find((option) => option.value === startMonth)?.label;

  return month ? `${month} ${startYear}` : `Month ${startMonth}, ${startYear}`;
}

export function formatProfileLabel(value: string) {
  return (
    businessProfileOptions.find((option) => option.value === value)?.label ?? value
  );
}

export function formatStageLabel(value: string) {
  return (
    businessStageOptions.find((option) => option.value === value)?.label ?? value
  );
}
