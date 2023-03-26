import { AIModel, PromptTemplate } from "../types";

export class GenerateAnswerPromptTemplate implements PromptTemplate {
  // AI Model Parameters.
  public model: AIModel = AIModel.GPT_3_5_TURBO_0301;
  public stop: string[] = ["#", "---"];
  public maxTokens: number = 1400;
  public temperature: number = 0;
  public topP: number = 1;
  public n: number = 1;

  stringify(question: string): string {
    return `# MySQL SQL
Table github_events, columns = [id, type, created_at, repo_id, repo_name, actor_id, actor_login, additions, deletions, action, number, org_login, org_id, state, closed_at, comments, pr_merged_at, pr_merged, pr_changed_files, pr_review_comments, pr_or_issue_id, push_size, push_distinct_size, creator_user_login, creator_user_id, pr_or_issue_created_at]
- Column type, enums = ['PullRequestEvent', 'PushEvent', 'IssueCommentEvent', 'IssuesEvent', 'PullRequestReviewCommentEvent', 'WatchEvent', 'CreateEvent', 'DeleteEvent', 'ForkEvent', 'ReleaseEvent']
- Column action:
* type in [PullRequestReviewCommentEvent, IssueCommentEvent, ReviewEvent]: created
* type in [PullRequestEvent, IssuesEvent]: opened, closed, reopened
- Column number, number is issue number
- Column created_at, closed_at, pr_merged_at, pr_or_issue_created_at DEFAULT '1970-01-01 00:00:00'
- Column additions, deletions are invalid and must not be used when type is PushEvent!!!

Table github_repos, columns = [repo_id, repo_name, owner_id, owner_login, owner_is_org, description, primary_language, license, stars, forks, parent_repo_id, is_archived, is_deleted, latest_released_at, pushed_at, created_at, updated_at]
- Column primary_language means programming language, invalid = [null, '']

Table github_users, columns = [id, login, type, name, organization, country_code, followers, followings, created_at, updated_at]
- Column type, enums = ['USR', 'ORG']
- Column country_code, invalid = ['', 'N/A', 'UND']

Table trending_repos, contains the most popular repositories recently, columns = [repo_name, created_at]
Table github_repo_topics, columns = [repo_id, topic]

# Relations
github_events.repo_id = github_repos.repo_id
github_events.repo_name = github_repos.repo_name
github_events.actor_id = github_users.id
github_events.actor_login = github_users.login
github_events.creator_user_id = github_users.id
github_repos.owner_id = github_users.id
github_repos.repo_id = github_repo_topics.repo_id
trending_repos.repo_name = github_repos.repo_name

Select statement limit 20 by default, if question need more data, please add limit 50
Use column alias for all columns: SELECT ge.repo_name AS repo_name
Open to merged time: TIMESTAMPDIFF(SECOND, ge.pr_or_issue_created_at, ge.closed_at)
Issue link: CONCAT('https://github.com/', repo_name, '/issues/', number) AS link
Exclude bots: actor_login NOT LIKE "%bot%"
Database repos: description LIKE '%database%'
Filter by @org_or_user_login/repo_name: repo_name = 'org_or_user_login/repo_name'
Filter by @org_or_user_login: owner_login = 'org_or_user_login'
Star in 2022: WHERE ge.type = 'WatchEvent' AND ge.action = 'started' AND YEAR(ge.created_at) = 2022
Merged PR: type = 'PullRequestEvent' AND action = 'closed' AND pr_merged = 1
Create issue comment: type = 'IssueCommentEvent' AND action = 'created'
The number of PR: type = 'PullRequestEvent' AND action = 'opened'
Contributor: the person who opened pull request to the repo, it will trigger a PullRequestEvent
The most popular repos has the most stars
Similar repositories will have similar topics
When calculating country, inner join actor_id and github_users.id, then use github_users.country_code.

A template for calculating trend by star history across months
SELECT DATE_FORMAT(ge.created_at, '%Y-%m-01') AS t_month, COUNT(*) AS stars FROM github_events ge WHERE ge.type = 'WatchEvent' AND ge.repo_id = (SELECT repo_id FROM github_repos WHERE repo_name = {fill with repo_name and remove @ !!!} LIMIT 1) GROUP BY t_month ORDER BY t_month ASC

# ChartOptions
type Column = string; // must be the column name in the SQL result!!!
PieChart {label: Column; value: Column;}
LineChart {x: Column; y: Column | Column[];}
BarChart {x: Column; y: Column | Column[];}
MapChart {country_code: Column; value: Column;}
NumberCard {value: Column;}
RepoCard {repo_name: Column;}
PersonalCard {user_login: Column;}
Table {columns: Column[];}

When result has country_code and a number column, use MapChart

Answer {
  chart: {chartName: string; title: string; options: ChartOptions;}; // must generate chart!!!
  sql: string; // must single line sql, remove line break in sql!!
}

---
Make sure to avoid ambiguous column references and non-existent columns by using table aliases and double-checking column names before running the query.
If the question is talking about repos like [a, b, c], use the format:org_or_user/repo.
If the time period is not specified, assume a duration of 3 months.Let's think step by step, use best practice of writing SQL, use common table expression if and only if necessary, scan all repos if there is no specific repo, generate a answer.json file to answer the question: "in github, ${question}".
---
answer.json // must be json!!!
---
`;
  }
}
