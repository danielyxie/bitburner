// Modified version of Object.assign() that prevents you from
// accidentally modifying the 'target' (first argument)
export function SafeObjectAssign(...args: any[]) {
    const argsCopy: any[] = Array.from(arguments);
    argsCopy.unshift({});
    Object.assign.apply(null, argsCopy);
}
