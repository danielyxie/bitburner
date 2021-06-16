export const GangConstants: {
    GangRespectToReputationRatio: number;
    MaximumGangMembers: number;
    CyclesPerTerritoryAndPowerUpdate: number;
    AscensionMultiplierRatio: number;
    Names: string[];
} = {
     // Respect is divided by this to get rep gain
    GangRespectToReputationRatio: 5,
    MaximumGangMembers: 30,
    CyclesPerTerritoryAndPowerUpdate: 100,
     // Portion of upgrade multiplier that is kept after ascending
    AscensionMultiplierRatio: .15,
    // Names of possible Gangs
    Names: [
        "Slum Snakes",
        "Tetrads",
        "The Syndicate",
        "The Dark Army",
        "Speakers for the Dead",
        "NiteSec",
        "The Black Hand",
    ],
};