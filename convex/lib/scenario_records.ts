import type { Doc, Id } from "../_generated/dataModel";
import type { MutationCtx } from "../_generated/server";

type ScenarioRecordLike = Pick<
  Doc<"scenarios">,
  "_creationTime" | "isBase" | "name" | "status"
>;

const scenarioStatusOrder = {
  draft: 0,
  ready: 1,
  archived: 2,
} as const;

export function sortScenarios<T extends ScenarioRecordLike>(scenarios: T[]) {
  return [...scenarios].sort((left, right) => {
    if (left.isBase !== right.isBase) {
      return left.isBase ? -1 : 1;
    }

    if (left.status !== right.status) {
      return (
        scenarioStatusOrder[left.status] - scenarioStatusOrder[right.status]
      );
    }

    if (left._creationTime !== right._creationTime) {
      return right._creationTime - left._creationTime;
    }

    return left.name.localeCompare(right.name);
  });
}

export async function appendScenarioVersion(
  ctx: MutationCtx,
  {
    scenarioId,
    versionNumber,
    createdByUserId,
    changeSource,
    summary,
  }: {
    scenarioId: Id<"scenarios">;
    versionNumber: number;
    createdByUserId: Id<"users">;
    changeSource: "manual" | "system";
    summary: string;
  },
) {
  await ctx.db.insert("scenario_versions", {
    scenarioId,
    versionNumber,
    changeSource,
    createdByUserId,
    summary,
  });
}
