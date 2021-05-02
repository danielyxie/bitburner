/**
 * Represents the possible configuration values that can be provided when creating the progress bar text.
 */
interface IProgressBarConfiguration {
    /**
     * Current progress, taken as a decimal (i.e. '0.6' to represent '60%')
     */
    progress?: number;

    /**
     * Total number of ticks in progress bar. Preferably a factor of 100.
     */
    totalTicks?: number;
}

/**
 * Represents concrete configuration values when creating the progress bar text.
 */
interface IProgressBarConfigurationMaterialized extends IProgressBarConfiguration {
    progress: number;
    totalTicks: number;
}

/**
 * Creates a graphical "progress bar"
 * e.g.:  [||||---------------]
 * @param params The configuration parameters for the progress bar
 */
export function createProgressBarText(params: IProgressBarConfiguration): string {
    // Default values
    const defaultParams: IProgressBarConfigurationMaterialized = {
        progress: 0,
        totalTicks: 20,
    };

    // tslint:disable-next-line:prefer-object-spread
    const derived: IProgressBarConfigurationMaterialized = Object.assign({}, defaultParams, params);
    // Ensure it is 0..1
    derived.progress = Math.max(Math.min(derived.progress, 1), 0);

    // This way there is always at least one bar filled in...
    const bars: number = Math.max(Math.floor(derived.progress / (1 / derived.totalTicks)), 1);
    const dashes: number = Math.max(derived.totalTicks - bars, 0);

    // String.prototype.repeat isn't completley supported, but good enough for our purposes
    return `[${"|".repeat(bars)}${"-".repeat(dashes)}]`;
}
