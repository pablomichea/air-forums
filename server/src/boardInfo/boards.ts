export interface date {
  creation: string;
  localeUsed: string;
  lastEdit?: string;
}
export interface board {
  id: number;
  title: string;
  desc: string;
  link: string;
  categories: Array<category>;
}
export interface category {
  id: number;
  title: string;
  desc: string;
  link: string;
  threads: Array<thread>;
}

export interface thread {
  id: number;
  username: string;
  title: string;
  threadContent: string;
  link: string;
  date: date;
  open: boolean;
  comments: Array<comment>;
}
export interface comment {
  id: number;
  username: string;
  commentContent: string;
  date: date;
  commentLink: string;
}
export const boards: Array<board> = [];
