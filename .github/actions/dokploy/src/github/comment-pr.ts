import * as core from '@actions/core';
import * as github from '@actions/github';

const COMMENT_TAG = '<!-- dokploy-preview-comment -->';

export async function setPullRequestComment(
  octokit: ReturnType<typeof github.getOctokit>,
  {
    appName,
    appUrl,
    appSettingsUrl,
  }: {
    appName: string;
    appUrl: string;
    appSettingsUrl: string;
  },
) {
  try {
    const { owner, repo } = github.context.repo;
    const { number: issue_number } = github.context.issue;

    const commentBody = `
  ## 🚀 Preview deployment
  
  **Your PR has been automatically deployed to Dokploy**

  - ✅ [App Preview](${appUrl})
  
  - ⚙️ [App Administration](${appSettingsUrl})
  
  ${COMMENT_TAG}
      `;

    const { data } = await octokit.rest.issues.listComments({
      owner,
      repo,
      issue_number,
    });
    core.debug(`Comments: ${JSON.stringify(data, null, 2)}`);

    const existingComment = data.find((comment) =>
      comment.body?.includes(COMMENT_TAG),
    );

    if (!existingComment) {
      await octokit.rest.issues.createComment({
        owner,
        repo,
        issue_number,
        body: commentBody,
      });
      core.info('Comment successfully added');
    } else if (existingComment.body !== commentBody) {
      await octokit.rest.issues.updateComment({
        owner,
        repo,
        comment_id: existingComment.id,
        body: commentBody,
      });
      core.info('Comment updated');
    }
  } catch (error) {
    core.error(error.stack);
    core.setFailed(error.message);
  }
}
