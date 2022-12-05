import React, { memo } from "react";
import Badge from "@mui/material/Badge";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import type { Page } from "../../ui/Router";

export interface ICreateProps {
  key_: Page;
  icon: React.ReactElement;
  count?: number;
  active?: boolean;
}

export interface IProps extends ICreateProps {
  clickFn: () => void;
  flash: boolean;
  classes: any;
  sidebarOpen: boolean;
}

export const SidebarItem = memo(function (props: IProps): React.ReactElement {
  // Use icon as a template. (We can't modify props)
  const icon: React.ReactElement = {
    type: props.icon.type,
    key: props.icon.key,
    props: {
      color: props.flash ? "error" : !props.active ? "secondary" : "primary",
      ...props.icon.props,
    },
  };
  return (
    <ListItem
      classes={{ root: props.classes.listitem }}
      button
      key={props.key_}
      className={props.active ? props.classes.active : ""}
      onClick={props.clickFn}
    >
      <ListItemIcon>
        <Badge badgeContent={(props.count ?? 0) > 0 ? props.count : undefined} color="error">
          <Tooltip title={!props.sidebarOpen ? props.key_ : ""} children={icon} />
        </Badge>
      </ListItemIcon>
      <ListItemText>
        <Typography color={props.flash ? "error" : !props.active ? "secondary" : "primary"} children={props.key_} />
      </ListItemText>
    </ListItem>
  );
});
