/**
 * Radiocarbon "present" is 1950 CE. There is no year 0, so a BCE year Y is
 * Y + 1949 years before 1 January 1950.
 * 3200 BCE = 5,149 BP. 9000 BCE = 10,949 BP.
 * A negative age.year in the timeline is a BCE year number, not a BP count.
 */
export const BP_EPOCH_YEAR = 1950

export function yearsBefore1950FromBce(bceYear: number): number {
  if (!(bceYear > 0)) throw new Error(`BCE year must be positive, got ${bceYear}`)
  return bceYear + (BP_EPOCH_YEAR - 1)
}

export function formatBpFromBce(bceYear: number): string {
  const bp = yearsBefore1950FromBce(bceYear)
  return `${bp.toLocaleString('en-US')} BP (before 1950)`
}
