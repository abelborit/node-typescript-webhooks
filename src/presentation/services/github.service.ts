import { GitHubIssuePayload, GitHubStarPayload } from "../../interfaces";

export class GitHubService {
  constructor() {}

  onStar(payload: GitHubStarPayload): string {
    let message: string;

    const { action, sender, repository } = payload;

    message = `User ${sender.login} ${action} star on ${repository.full_name}`;

    return message;
  }

  onIssues(payload: GitHubIssuePayload): string {
    const { action, sender, issue } = payload;

    if (action === "opened") {
      const message = `An issue was created with this title ${issue.title} by ${sender.login}`;
      return message;
    }

    if (action === "closed") {
      const message = `An issue was closed by ${sender.login}`;
      return message;
    }

    if (action === "reopened") {
      const message = `An issue was reopened by ${sender.login}`;
      return message;
    }

    return `Unhandled action for the issue event ${action}`;
  }
}
