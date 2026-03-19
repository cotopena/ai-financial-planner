export { requiredRevenueParityFixtures as requiredParityFixtures } from "./revenue-fixtures";
export { revenueParityFixtures } from "./revenue-fixtures";
import { listRevenueParityFixtures } from "./revenue-fixtures";

export function listParityFixtures() {
  return listRevenueParityFixtures();
}
