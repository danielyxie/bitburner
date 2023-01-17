/* eslint-disable no-await-in-loop */
import { Octokit } from "@octokit/rest";
import commandLineArgs from "command-line-args";

const owner = "danielyxie";
const repo = "bitburner";

const cliArgs = commandLineArgs([
  { name: "from", alias: "f", type: String },
  { name: "to", alias: "t", type: String },
]);

class MergeChangelog {
  constructor(options) {
    this.octokit = new Octokit(options);
  }

  async getCommitsSearchResults(query) {
    const iterator = this.octokit.paginate.iterator(this.octokit.rest.search.commits, {
      owner,
      repo,
      q: query,
      sort: "updated",
      direction: "desc",
    });
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
    const iterator = this.octokit.paginate.iterator(this.octokit.rest.search.issuesAndPullRequests, {
      owner,
      repo,
      q: query,
      sort: "committer-date",
      direction: "desc",
    });

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
      const r = await this.octokit.rest.pulls
        .get({
          owner,
          repo,
          pull_number: entry.number,
        })
        .then((response) => ({
          ...entry,
          merge_commit_sha: response.data.merge_commit_sha,
          head_commit_sha: response.data.head.sha,
        }));
      pulls.push(r);
      await sleep(1000);
    }
    return pulls;
  }

  async getCommit(sha) {
    const response = await this.octokit.rest.git.getCommit({
      owner,
      repo,
      commit_sha: sha,
    });
    const commit = {
      date: response.data.committer.date,
      message: response.data.message,
      sha: response.data.sha,
      url: response.data.html_url,
    };
    return commit;
  }

  async getPullsMergedBetween(sha_from, sha_to) {
    const from = {};
    const to = {};
    from.commit = await this.getCommit(sha_from);
    from.date = new Date(from.commit.date);

    if (!sha_to) {
      const newest = await this.getLastCommitByBranch("dev");
      to.commit = await this.getCommit(newest);
    } else {
      to.commit = await this.getCommit(sha_to);
    }

    to.date = new Date(to.commit.date);

    const commitQuery = `user:${owner} repo:${repo} merge:false committer-date:"${from.date.toISOString()}..${to.date.toISOString()}"`;
    const pullQuery = `user:${owner} repo:${repo} is:pr is:merged merged:"${from.date.toISOString()}..${to.date.toISOString()}"`;

    const commits = await this.getCommitsSearchResults(commitQuery);
    await sleep(5000);
    const pulls = await this.getPullsSearchResults(pullQuery);
    await sleep(5000);
    // We only have the merge commit sha & the HEAD sha in this data, but it can exclude some entries
    const pullsCommitSha = pulls
      .map((p) => [p.merge_commit_sha, p.head_commit_sha])
      .reduce((all, current) => [...all, ...current]);

    let danglingCommits = commits.filter((c) => !pullsCommitSha.includes(c.sha));
    const listPullsPromises = [];
    for (const commit of danglingCommits) {
      const promise = this.octokit.rest.repos
        .listPullRequestsAssociatedWithCommit({
          owner,
          repo,
          commit_sha: commit.sha,
        })
        .then((response) => ({
          ...commit,
          nbPulls: response.data.length,
        }));
      listPullsPromises.push(promise);
    }

    const commitsThatAreIncludedInPulls = (await Promise.all(listPullsPromises))
      .filter((c) => c.nbPulls > 0)
      .map((c) => c.sha);

    danglingCommits = danglingCommits.filter((c) => !commitsThatAreIncludedInPulls.includes(c.sha));
    return {
      from,
      to,
      pulls,
      danglingCommits,
      pullQuery,
      commitQuery,
    };
  }

  async getLastCommitByBranch(branch) {
    const response = await this.octokit.rest.repos.getBranch({
      owner,
      repo,
      branch,
    });
    return response.data.commit.sha;
  }

  async getChangelog(from, to) {
    const changes = await this.getPullsMergedBetween(from, to);
    const pullLines = changes.pulls
      .map((line) => this.getPullMarkdown(line))
      .concat(changes.danglingCommits.map((line) => this.getCommitMarkdown(line)));
    pullLines.push({ category: "MISC", title: "Nerf Noodle bar" });
    const title = `v2.x.x - ${new Date().toISOString().slice(0, 10)}  TITLE\n\n`;
    const map = {};
    pullLines.forEach((c) => {
      if (c.title.includes("allbuild commit")) return;
      let array = map[c.category];
      if (!array) {
        array = [];
        map[c.category] = array;
      }
      array.push(c);
    });

    let log = title;
    Object.entries(map).forEach(([key, value]) => {
      log += `  ${key}\n`;
      value.forEach((v) => (log += `  * ${v.title} ${v.by ? `(by @${v.by})` : ""}\n`));
      log += "\n";
    });

    return {
      log: log,
      changes: changes,
    };
  }

  getPullMarkdown(pr) {
    let category = "MISC";
    let title = pr.title;
    if (pr.title.includes(":")) {
      category = pr.title.split(":")[0];
      title = pr.title.split(":")[1];
    }
    return {
      category: category,
      title: title,
      by: pr.user.login,
    };
  }

  getCommitMarkdown(commit) {
    return {
      category: "MISC",
      title: commit.message,
      by: commit.user.login,
    };
  }
}

const sleep = async (wait) => {
  return new Promise((resolve) => {
    setTimeout(resolve, wait);
  });
};

const api = new MergeChangelog({ auth: process.env.GITHUB_API_TOKEN });
if (!cliArgs.from || !cliArgs.to) {
  console.error("USAGE: node index.js --from hash --to hash");
  process.exit();
}
api.getChangelog(cliArgs.from, cliArgs.to).then((data) => {
  console.log(data.log);
});
