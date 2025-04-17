import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string | null): string {
  if (!dateString) return "-";

  const date = new Date(dateString);
  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export const defaultPageSizeOptions = [5, 10, 20, 50, 100];

export const getTableVisibilityKey = (tableId: string) => `table-visibility-${tableId}`;

export function getFilterOptions<T>(
  data: T[],
  accessor: keyof T,
  labelMap?: Record<string, string>,
): { label: string; value: string }[] {
  const uniqueValues = new Set<string>();

  data.forEach((item) => {
    const value = String(item[accessor]);
    if (value) uniqueValues.add(value);
  });

  return Array.from(uniqueValues)
    .sort()
    .map((value) => ({
      label: labelMap?.[value] || value,
      value,
    }));
}
