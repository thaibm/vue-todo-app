export enum ETodoType {
  All = "all",
  Active = "active",
  Completed = "completed"
}

export interface ITodo {
  id: number;
  text: string;
  done: boolean;
}
