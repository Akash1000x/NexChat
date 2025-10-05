export type MessageType = {
  id: string;
  role: "user" | "assistant";
  parts: {
    type: string;
    text: string;
  }[];
}