import { gangMemberTasksMetadata } from "./data/tasks";
import { GangMemberTask } from "./GangMemberTask";

export const GangMemberTasks: {
    [key: string]: GangMemberTask;
} = {};

(function() {
    gangMemberTasksMetadata.forEach((e) => {
        GangMemberTasks[e.name] = new GangMemberTask(e.name, e.desc, e.isHacking, e.isCombat, e.params);
    });
})();
