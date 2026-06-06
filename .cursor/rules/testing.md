# Testing Strategy

Use Vitest for all tests.

Required commands:

- `npm test`: runs tests and creates JUnit and coverage reports.
- `npm run coverage`: creates HTML, LCOV, and Cobertura coverage reports.
- `npm run lint`: runs ESLint.

Report outputs:

- `reports/junit.xml`: CI and SonarQube test report.
- `coverage/lcov.info`: SonarQube JavaScript coverage input.
- `coverage/cobertura-coverage.xml`: XML coverage artifact.
- `coverage/index.html`: human-readable HTML coverage entrypoint.

Testing rules for AI agents:

- Prefer small deterministic tests.
- Use generated edge-case tables when branch coverage needs many combinations.
- Mock only boundaries such as event listeners.
- Do not mock domain models when testing services.
- New business rules must include positive, negative, and edge-case tests.
