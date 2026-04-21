# Smoke-Check Results: Step 2.2.8

Date: 2026-04-21
Mode: Handler/controller harness fallback (without Vercel runtime)
Reason for fallback: `vercel dev` local run was blocked by project-name/path constraints in current local environment.

## Scope

Validated API contract for Collection/Entry backend endpoints against Step 2 criteria:

1. Auth gate on private endpoints.
2. Validation behavior and HTTP 422 contract.
3. Unified response envelope.
4. Access-control error mapping (403/404).
5. CRUD flows for collections and entries.
6. Public examples endpoint without auth.

## Executed Checks

1. Smoke harness tests: `smoke/step-2.2.8.api.smoke.test.ts`.
2. Service contract tests: `lib/services/collection.service.test.ts`.
3. Schema contract tests: `lib/validation/collection.schema.test.ts`.
4. Aggregate run result: 24/24 tests passed.

## Result Summary

| Scenario                         | Expected                 | Result      |
| -------------------------------- | ------------------------ | ----------- | -------- | ---- |
| C1 Auth (missing/invalid bearer) | 401 + `UNAUTHORIZED`     | PASS        |
| C2 Validation                    | 422 + `VALIDATION_ERROR` | PASS        |
| C3 Unified envelope              | `{ ok: true              | false, data | error }` | PASS |
| C4 Access semantics              | 403/404 mapping          | PASS        |
| C5 Collections CRUD              | 201/200/200/200          | PASS        |
| C6 Entries CRUD                  | 201/200/200/200          | PASS        |
| C7 Public endpoint               | 200 without token        | PASS        |

## Notes

1. This smoke-check confirms endpoint contracts and orchestration behavior in a controlled fallback harness.
2. During smoke-check we found and fixed a controller issue: `collectionId` route param leaked into strict entry query validation and could cause false 422 for entries list; controller now strips route param before parsing entry list query.
3. Existing service tests additionally verify business rules and transaction rollback logic.
4. For full HTTP end-to-end parity, a separate runtime-level smoke pass can be executed after resolving local `vercel dev` infrastructure constraint.

## Conclusion

Step 2.2.8 acceptance criteria are satisfied for backend MVP contract readiness.
