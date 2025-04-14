import { QuestionData } from "./question";

export interface TestResponseData {
  testId: string;
  questions: QuestionData[];
}
