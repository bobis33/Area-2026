export interface GitlabTodo {
  id: number;
  action_name: string;
  body: string;
  target_type: string;
  target_url: string;
  project?: {
    id: number;
    name: string;
    web_url: string;
  };
  author: {
    id: number;
    name: string;
    username: string;
  };
  created_at: string;
}
