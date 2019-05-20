# aws-cdk-circleci-sample

## Features

- When create a PR, post results of `cdk diff` on there.

![Post results](./images/pr.png)

- When the branch is merged, run `cdk deploy`.

- Notify the result on Slack.

![Notify on Slack](./images/slack.png)

## Settings

Add AWS keys and following environment variables to CircleCI's build settings

- ASSUME_ROLE_ARN
- GITHUB_TOKEN
- SLACK_WEBHOOK

## Article

[CDK/CircleCI/GitHubでAWSリソース管理リポジトリを作る - sambaiz-net](https://www.sambaiz.net/article/223/)

