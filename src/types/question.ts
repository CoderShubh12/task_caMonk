// types/question.ts
export interface QuestionData {
  questionId: string;
  question: string;
  questionType: "text";
  answerType: "options";
  options: string[];
  correctAnswer: string[];
}
