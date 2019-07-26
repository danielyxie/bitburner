export enum OverwriteStrategy {
    FORCE = 1, // overwrite
    INTERACTIVE, // asks the user for permission, currently impossible due to having no access to user input from a running program.
    NO_CLOBBER, // do not copy if a file exists with the same name.
    UPDATE, // copy only if the copied file is more recent. TIMING TO DO, check stats with fs.access or something like that, theres a modified date system integrated with fs.
}
