import type React from "react";

import { CONSTANTS } from "../Constants";
import { hash } from "../hash/hash";
import { Page } from "../ui/Router";

enum GameEnv {
  Production,
  Development,
}

enum Platform {
  Browser,
  Steam,
}

interface GameVersion {
  version: string;
  hash: string;

  toDisplay: () => string;
}

interface BrowserFeatures {
  userAgent: string;
  language: string;
  cookiesEnabled: boolean;
  doNotTrack: string | null;
  indexedDb: boolean;
}

interface IErrorMetadata {
  error: Error;
  errorInfo?: React.ErrorInfo;
  page?: Page;

  environment: GameEnv;
  platform: Platform;
  version: GameVersion;
  features: BrowserFeatures;
}

export interface IErrorData {
  metadata: IErrorMetadata;

  title: string;
  body: string;

  features: string;
  fileName?: string;

  issueUrl: string;
}

export const newIssueUrl = `https://github.com/danielyxie/bitburner/issues/new`;

function getErrorMetadata(error: Error, errorInfo?: React.ErrorInfo, page?: Page): IErrorMetadata {
  const isElectron = navigator.userAgent.toLowerCase().indexOf(" electron/") > -1;
  const env = process.env.NODE_ENV === "development" ? GameEnv.Development : GameEnv.Production;
  const version: GameVersion = {
    version: CONSTANTS.VersionString,
    hash: hash(),
    toDisplay: () => `v${CONSTANTS.VersionString} (${hash()})`,
  };
  const features: BrowserFeatures = {
    userAgent: navigator.userAgent,

    language: navigator.language,
    cookiesEnabled: navigator.cookieEnabled,
    doNotTrack: navigator.doNotTrack,
    indexedDb: !!window.indexedDB,
  };
  const metadata: IErrorMetadata = {
    platform: isElectron ? Platform.Steam : Platform.Browser,
    environment: env,
    version,
    features,
    error,
    errorInfo,
    page,
  };
  return metadata;
}

export function getErrorForDisplay(error: Error, errorInfo?: React.ErrorInfo, page?: Page): IErrorData {
  const metadata = getErrorMetadata(error, errorInfo, page);
  const fileName = (metadata.error as any).fileName;
  const features =
    `lang=${metadata.features.language} cookiesEnabled=${metadata.features.cookiesEnabled.toString()}` +
    ` doNotTrack=${metadata.features.doNotTrack} indexedDb=${metadata.features.indexedDb.toString()}`;

  const title = `${metadata.error.name}: ${metadata.error.message}${metadata.page && ` (at "${Page[metadata.page]}")`}`;
  const body = `
## ${title}

### How did this happen?

Please fill this information with details if relevant.

- [ ] Save file
- [ ] Minimal scripts to reproduce the issue
- [ ] Steps to reproduce

### Environment

* Error: ${metadata.error?.toString() ?? "n/a"}
* Page: ${metadata.page ? Page[metadata.page] : "n/a"}
* Version: ${metadata.version.toDisplay()}
* Environment: ${GameEnv[metadata.environment]}
* Platform: ${Platform[metadata.platform]}
* UserAgent: ${navigator.userAgent}
* Features: ${features}
* Source: ${fileName ?? "n/a"}

${
  metadata.environment === GameEnv.Development
    ? `
### Stack Trace
\`\`\`
${metadata.errorInfo?.componentStack.toString().trim()}
\`\`\`
`
    : ""
}
### Save
\`\`\`
Copy your save here if possible
\`\`\`
`.trim();

  const issueUrl = `${newIssueUrl}?title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`;

  const data: IErrorData = {
    metadata,
    fileName,
    features,
    title,
    body,
    issueUrl,
  };
  return data;
}
