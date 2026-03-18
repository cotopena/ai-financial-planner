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
import type * as engine from "../engine.js";
import type * as exports from "../exports.js";
import type * as http from "../http.js";
import type * as imports from "../imports.js";
import type * as lib_auth from "../lib/auth.js";
import type * as scenarios from "../scenarios.js";
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
  engine: typeof engine;
  exports: typeof exports;
  http: typeof http;
  imports: typeof imports;
  "lib/auth": typeof lib_auth;
  scenarios: typeof scenarios;
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
