import React, { useMemo, useState } from "react";
import Collapse from "@mui/material/Collapse";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { SidebarItem, ICreateProps as IItemProps } from "./SidebarItem";
import type { Page } from "../../ui/Router";

interface IProps {
  key_: string;
  page: Page;
  clickPage: (page: Page) => void;
  flash: Page | null;
  items: (IItemProps | boolean)[];
  icon: React.ReactElement["type"];
  sidebarOpen: boolean;
  classes: any;
}

// We can't useCallback for this, because in the items map it would be
// called a changing number of times, and hooks can't be called in loops. So
// we set up this explicit cache of function objects instead.
// This is at module scope, because it's fine for all Accordions to share the
// same cache.
// WeakMap prevents memory leaks. We won't drop slices of the cache too soon,
// because the fn keys are themselves memoized elsewhere, which keeps them
// alive and thus keeps the WeakMap entries alive.
const clickFnCache = new WeakMap();
function getClickFn(toWrap: (page: Page) => void, page: Page) {
  let first = clickFnCache.get(toWrap);
  if (first === undefined) {
    first = {};
    clickFnCache.set(toWrap, first);
  }
  // Short-circuit: Avoid assign/eval of function on found
  return (first[page] ??= () => toWrap(page));
}

// This can't be usefully memoized, because props.items is a new array every time.
export function SidebarAccordion(props: IProps): React.ReactElement {
  const [open, setOpen] = useState(true);
  const li_classes = useMemo(() => ({ root: props.classes.listitem }), [props.classes.listitem]);

  // Explicitily useMemo() to save rerendering deep chunks of this tree.
  // memo() can't be (easily) used on components like <List>, because the
  // props.children array will be a different object every time.
  return (
    <>
      {useMemo(
        () => (
          <ListItem classes={li_classes} button onClick={() => setOpen((open) => !open)}>
            <ListItemIcon>
              <Tooltip title={!props.sidebarOpen ? props.key_ : ""}>
                <props.icon color={"primary"} />
              </Tooltip>
            </ListItemIcon>
            <ListItemText primary={<Typography>{props.key_}</Typography>} />
            {open ? <ExpandLessIcon color="primary" /> : <ExpandMoreIcon color="primary" />}
          </ListItem>
        ),
        [li_classes, props.sidebarOpen, props.key_, open, props.icon],
      )}
      <Collapse in={open} timeout="auto" unmountOnExit>
        {props.items.map((x) => {
          if (typeof x !== "object") return null;
          const { key_, icon, count, active } = x;
          return (
            <SidebarItem
              key={key_}
              key_={key_}
              icon={icon}
              count={count}
              active={active ?? props.page === key_}
              clickFn={getClickFn(props.clickPage, key_)}
              flash={props.flash === key_}
              classes={props.classes}
              sidebarOpen={props.sidebarOpen}
            />
          );
        })}
      </Collapse>
    </>
  );
}
