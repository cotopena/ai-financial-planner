export {
  requiredFoundationParityFixtures,
  foundationParityFixtures,
} from "./foundation-fixtures";
export { revenueParityFixtures } from "./revenue-fixtures";
export const requiredParityFixtures = [
  ...requiredFoundationParityFixtures,
  ...requiredRevenueParityFixtures,
] as const;
import {
  listFoundationParityFixtures,
  requiredFoundationParityFixtures,
} from "./foundation-fixtures";
import { listRevenueParityFixtures } from "./revenue-fixtures";
import { requiredRevenueParityFixtures } from "./revenue-fixtures";

export function listParityFixtures() {
  return [...listFoundationParityFixtures(), ...listRevenueParityFixtures()];
}
