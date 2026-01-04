export type ChangeType = "feature" | "fix" | "improvement" | "security";

export interface Change {
  type: ChangeType;
  description: string;
}

export interface Release {
  version: string;
  date: string;
  changes: Change[];
}
