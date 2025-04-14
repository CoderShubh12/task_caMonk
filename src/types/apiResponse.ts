import { TestResponseData } from "./testResponseData";
import { ActivityData } from "./activity";

export interface ApiResponse {
  status: "SUCCESS" | "FAILED";
  data?: TestResponseData;
  message: string;
  activity?: ActivityData;
}
