export interface GithubNotification {
  id: string;
  updated_at: string;
  repository: {
    full_name: string;
  };
  subject: {
    title: string;
    type: string;
    url: string;
  };
}
