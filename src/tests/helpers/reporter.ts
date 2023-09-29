/* eslint-disable import/no-extraneous-dependencies */
import { SpecReporter } from 'jasmine-spec-reporter';
// import SuiteInfo = jasmine.SuiteInfo;
import CustomReporter = jasmine.CustomReporter;

// class CustomProcessor extends DisplayProcessor {
//   public displayJasmineStarted(info: SuiteInfo, log: string): string {
//     return `${log}`;
//   }
// }

jasmine.getEnv().clearReporters();
jasmine.getEnv().addReporter(new SpecReporter() as unknown as CustomReporter);
// jasmine.getEnv().addReporter(
//   new SpecReporter({
//     spec: {
//       displayStacktrace: StacktraceOption.NONE,
//     },
//     customProcessors: [CustomProcessor],
//   }),
// );
