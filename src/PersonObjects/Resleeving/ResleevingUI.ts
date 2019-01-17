/**
 * Module for handling the Re-sleeving UI
 */
import { Resleeve } from "./Resleeve";
import { generateResleeves,
         resleeve } from "./Resleeving";

import { IMap } from "../../types";

import { numeralWrapper } from "../../ui/numeralFormat";
import { Page,
         routing } from "../../ui/navigationTracking";

import { createElement } from "../../../utils/uiHelpers/createElement";
import { createOptionElement } from "../../../utils/uiHelpers/createOptionElement";
import { getSelectValue } from "../../../utils/uiHelpers/getSelectData";
import { removeChildrenFromElement } from "../../../utils/uiHelpers/removeChildrenFromElement";
import { removeElement } from "../../../utils/uiHelpers/removeElement";
import { removeElementById } from "../../../utils/uiHelpers/removeElementById";
