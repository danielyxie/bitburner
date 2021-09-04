import * as React from "react";

export function DialogBox(content: HTMLElement): React.ReactElement {
  return (
    <div className="dialog-box-content text">
      <span className="dialog-box-close-button ">&times;</span>
      {content}
    </div>
  );
}
