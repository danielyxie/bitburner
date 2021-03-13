export const BladeburnerConstants: {
    CityNames: string[];
    CyclesPerSecond: number;
    StaminaGainPerSecond: number;
    BaseStaminaLoss: number;
    MaxStaminaToGainFactor: number;
    DifficultyToTimeFactor: number;
    DiffMultExponentialFactor: number;
    DiffMultLinearFactor: number;
    EffAgiLinearFactor: number;
    EffDexLinearFactor: number;
    EffAgiExponentialFactor: number;
    EffDexExponentialFactor: number;
    BaseRecruitmentTimeNeeded: number;
    PopulationThreshold: number;
    PopulationExponent: number;
    ChaosThreshold: number;
    BaseStatGain: number;
    BaseIntGain: number;
    ActionCountGrowthPeriod: number;
    RankToFactionRepFactor: number;
    RankNeededForFaction: number;
    ContractSuccessesPerLevel: number;
    OperationSuccessesPerLevel: number;
    RanksPerSkillPoint: number;
    ContractBaseMoneyGain: number;
    HrcHpGain: number;
    HrcStaminaGain: number;
} = {
    CityNames: ["Aevum", "Chongqing", "Sector-12", "New Tokyo", "Ishima", "Volhaven"],
    CyclesPerSecond: 5, // Game cycle is 200 ms

    StaminaGainPerSecond: 0.0085,
    BaseStaminaLoss: 0.285, // Base stamina loss per action. Increased based on difficulty
    MaxStaminaToGainFactor: 70000, // Max Stamina is divided by this to get bonus stamina gain

    DifficultyToTimeFactor: 10, // Action Difficulty divided by this to get base action time

    /**
     * The difficulty multiplier affects stamina loss and hp loss of an action. Also affects
     * experience gain. Its formula is:
     * difficulty ^ exponentialFactor + difficulty / linearFactor
     */
    DiffMultExponentialFactor: 0.28,
    DiffMultLinearFactor: 650,

    /**
     * These factors are used to calculate action time.
     * They affect how much action time is reduced based on your agility and dexterity
     */
    EffAgiLinearFactor: 10e3,
    EffDexLinearFactor: 10e3,
    EffAgiExponentialFactor: 0.04,
    EffDexExponentialFactor: 0.035,

    BaseRecruitmentTimeNeeded: 300, // Base time needed (s) to complete a Recruitment action

    PopulationThreshold: 1e9, // Population which determines baseline success rate
    PopulationExponent: 0.7, // Exponent that influences how different populations affect success rate
    ChaosThreshold: 50, // City chaos level after which it starts making tasks harder

    BaseStatGain: 1, // Base stat gain per second
    BaseIntGain: 0.001, // Base intelligence stat gain

    ActionCountGrowthPeriod: 480, // Time (s) it takes for action count to grow by its specified value

    RankToFactionRepFactor: 2, // Delta Faction Rep = this * Delta Rank
    RankNeededForFaction: 25,

    ContractSuccessesPerLevel: 3, // How many successes you need to level up a contract
    OperationSuccessesPerLevel: 2.5, // How many successes you need to level up an op

    RanksPerSkillPoint: 3, // How many ranks needed to get 1 Skill Point

    ContractBaseMoneyGain: 250e3, // Base Money Gained per contract

    HrcHpGain: 2, // HP Gained from Hyperbolic Regeneration chamber
    HrcStaminaGain: 1, // Percentage Stamina gained from Hyperbolic Regeneration Chamber
}