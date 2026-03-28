/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as ai from "../ai.js";
import type * as assumptions from "../assumptions.js";
import type * as billing from "../billing.js";
import type * as businesses from "../businesses.js";
import type * as dev from "../dev.js";
import type * as engine from "../engine.js";
import type * as exports from "../exports.js";
import type * as http from "../http.js";
import type * as imports from "../imports.js";
import type * as lib_auth from "../lib/auth.js";
import type * as lib_scenario_calculation_input from "../lib/scenario_calculation_input.js";
import type * as lib_scenario_records from "../lib/scenario_records.js";
import type * as lib_scenario_snapshot_queries from "../lib/scenario_snapshot_queries.js";
import type * as lib_scenario_snapshot_rows from "../lib/scenario_snapshot_rows.js";
import type * as scenarios from "../scenarios.js";
import type * as snapshot_writes from "../snapshot_writes.js";
import type * as snapshots from "../snapshots.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  ai: typeof ai;
  assumptions: typeof assumptions;
  billing: typeof billing;
  businesses: typeof businesses;
  dev: typeof dev;
  engine: typeof engine;
  exports: typeof exports;
  http: typeof http;
  imports: typeof imports;
  "lib/auth": typeof lib_auth;
  "lib/scenario_calculation_input": typeof lib_scenario_calculation_input;
  "lib/scenario_records": typeof lib_scenario_records;
  "lib/scenario_snapshot_queries": typeof lib_scenario_snapshot_queries;
  "lib/scenario_snapshot_rows": typeof lib_scenario_snapshot_rows;
  scenarios: typeof scenarios;
  snapshot_writes: typeof snapshot_writes;
  snapshots: typeof snapshots;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
