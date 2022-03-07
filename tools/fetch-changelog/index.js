/* eslint-disable no-await-in-loop */
import { Octokit } from "@octokit/rest";
import commandLineArgs from "command-line-args";

const owner = "danielyxie";
const repo = "bitburner"
const basePath = `https://github.com/${owner}/${repo}`;

const cliArgs = commandLineArgs([
  { name: 'from', alias: 'f', type: String },
  { name: 'to', alias: 't', type: String },
  { name: 'detailed', alias: 'd', type: Boolean }
]);

class MergeChangelog {
  constructor(options) {
    this.octokit = new Octokit(options);
  }

  async getCommitsSearchResults(query) {
    const iterator = this.octokit.paginate.iterator(
      this.octokit.rest.search.commits,
      {
        owner, repo,
        q: query,
        sort: 'updated',
        direction: 'desc',
      },
    );
    const searchResults = [];
    for await (const response of iterator) {
      const entries = response.data.map((entry) => ({
        sha: entry.sha,
        url: entry.html_url,
        user: {
          id: entry.author?.id,
          login: entry.author?.login,
          avatar: entry.author?.avatar_url,
          url: entry.author?.html_url,
        },
        commit_date: entry.commit.committer.date,
        message: entry.commit.message,
      }));
      searchResults.push(...entries);
    }
    return searchResults;
  }

  async getPullsSearchResults(query) {
    const iterator = this.octokit.paginate.iterator(
      this.octokit.rest.search.issuesAndPullRequests,
      {
        owner, repo,
        q: query,
        sort: 'committer-date',
        direction: 'desc',
      },
    );

    const searchResults = [];
    for await (const response of iterator) {
      const entries = response.data.map((entry) => ({
        id: entry.id,
        number: entry.number,
        created_at: entry.updated_at,
        merged_at: entry.pull_request.merged_at,
        url: entry.pull_request.html_url,
        title: entry.title,
        body: entry.body,
        diff: entry.diff_url,
        patch: entry.patch_url,
        user: {
          id: entry.user.id,
          login: entry.user.login,
          avatar: entry.user.avatar_url,
          url: entry.user.html_url,
        },
      }));
      searchResults.push(...entries);
    }

    const pulls = [];
    for (const entry of searchResults) {
      const r = await (this.octokit.rest.pulls.get({
        owner, repo,
        pull_number: entry.number,
      }).then((response) => ({
        ...entry,
        merge_commit_sha: response.data.merge_commit_sha,
        head_commit_sha: response.data.head.sha,
      })));
      pulls.push(r);
      await sleep(1000);
    }
    return pulls;
  }

  async getCommit(sha) {
    const response = await this.octokit.rest.git.getCommit({
      owner, repo,
      commit_sha: sha,
    });
    const commit = {
      date: response.data.committer.date,
      message: response.data.message,
      sha: response.data.sha,
      url: response.data.html_url,
    }
    return commit;
  }

  async getPullsMergedBetween(sha_from, sha_to) {
    const from = {};
    const to = {};
    from.commit = await this.getCommit(sha_from);
    from.date = new Date(from.commit.date);

    if (!sha_to) {
      const newest = await this.getLastCommitByBranch('dev');
      to.commit = await this.getCommit(newest)
    } else {
      to.commit = await this.getCommit(sha_to);
    }

    to.date = new Date(to.commit.date);

    const commitQuery = `user:${owner} repo:${repo} merge:false committer-date:"${from.date.toISOString()}..${to.date.toISOString()}"`;
    const pullQuery = `user:${owner} repo:${repo} is:pr is:merged merged:"${from.date.toISOString()}..${to.date.toISOString()}"`;

    const commits = await this.getCommitsSearchResults(commitQuery);
    await sleep(5000)
    const pulls = await this.getPullsSearchResults(pullQuery);
    await sleep(5000)
    // We only have the merge commit sha & the HEAD sha in this data, but it can exclude some entries
    const pullsCommitSha = pulls.
      map((p) => [p.merge_commit_sha, p.head_commit_sha]).
      reduce((all, current) => [...all, ...current]);

    let danglingCommits = commits.filter((c) => !pullsCommitSha.includes(c.sha));
    const listPullsPromises = [];
    for (const commit of danglingCommits) {
      const promise = this.octokit.rest.repos.listPullRequestsAssociatedWithCommit({
        owner, repo, commit_sha: commit.sha
      }).then((response) => ({
        ...commit,
        nbPulls: response.data.length,
      }));
      listPullsPromises.push(promise);
    }

    const commitsThatAreIncludedInPulls = (await Promise.all(listPullsPromises)).
      filter((c) => c.nbPulls > 0).
      map((c) => c.sha);

    danglingCommits = danglingCommits.
      filter((c) => !commitsThatAreIncludedInPulls.includes(c.sha));
    return {
      from,
      to,
      pulls,
      danglingCommits,
      pullQuery,
      commitQuery,
    }
  }

  async getLastCommitByBranch(branch) {
    const response = await this.octokit.rest.repos.getBranch({
      owner,
      repo,
      branch,
    });
    return response.data.commit.sha;
  }

  async getChangelog(from, to, detailedOutput) {
    const changes = await this.getPullsMergedBetween(from, to);
    const pullLines = changes.pulls.map((line) => this.getPullMarkdown(line, detailedOutput));
    const commitLines = changes.danglingCommits.map((line) => this.getCommitMarkdown(line, detailedOutput));
    commitLines.push(`* Nerf noodle bar.`)
    const shortFrom = changes.from.date.toISOString().split('T')[0];
    const shortTo = changes.to.date.toISOString().split('T')[0]
    const shortFromSha = changes.from.commit.sha.slice(0, 7);
    const shortToSha = changes.to.commit.sha.slice(0, 7);
    const title = `## [draft] v1.x.x - ${shortFrom} to ${shortTo}`;
    let log = `
${title}

#### Information

Modifications included between **${shortFrom}** and **${shortTo}** (\`${shortFromSha}\` to \`${shortToSha}\`).

*[See Pull Requests on GitHub](https://github.com/search?q=${encodeURIComponent(changes.pullQuery)})*

#### Merged Pull Requests

${pullLines.join('\n')}

`;

    if (commitLines.length > 0) {
      log += `
#### Other Changes

${commitLines.join('\n')}
`;
    }
    return {
      log: log.trim(),
      changes: changes,
    };
  }

  getPullMarkdown(pr, detailedOutput) {
    if (!detailedOutput) {
      return `* ` +
        `${pr.title} (by @${pr.user.login})` +
        ` #[${pr.number}](${pr.url})`;
    } else {
      return `* [${pr.merge_commit_sha.slice(0, 7)}](${basePath}/commit/${pr.merge_commit_sha}) | ` +
        `${pr.title} ([@${pr.user.login}](${pr.user.url}))` +
        ` PR #[${pr.number}](${pr.url})`;
      }
  }

  getCommitMarkdown(commit, detailedOutput) {
    if (!detailedOutput) {
      return `* ` +
      `${commit.message} (by @${commit.user.login})` +
      ` - [${commit.sha.slice(0, 7)}](${commit.url})`;
    } else {
      return `* [${commit.sha.slice(0, 7)}](${commit.url}) | ` +
      `${commit.message} ([@${commit.user.login}](${commit.user.url}))`;
    }
  }
}

const sleep = async (wait) => {
  return new Promise((resolve) => {
    setTimeout(resolve, wait)
  })
}

const api = new MergeChangelog({ auth: process.env.GITHUB_API_TOKEN });
api.getChangelog(cliArgs.from, cliArgs.to, cliArgs.detailed).then((data) => {
  console.log(data.log);
});
