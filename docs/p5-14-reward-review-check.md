# P5-14 reward and review check

Source: learning.ts at ea0fb0fe018c55cd1c55933e48aae645e9d96855 and current review.ts. Extracted four question arrays and actual implementation bodies of scheduleReview, recordAttempt, checkAnswer, ratingFor and createState; stripped type annotations and executed as JavaScript in an isolated runtime. Not a full TypeScript build or browser execution.

For each of 72 questions: hinted correct, independent correct, repeated independent correct, wrong. Each attempt asserted star delta, attempt length increment, expected review rating and future review due date. 288 attempts, 1152 assertions, zero failures, final 72 stars, 6 review skills. Fixed timestamp 2026-11-20T00:00:00Z. No storage or real tab concurrency tested. CI, full build and public deployment remain pending.
