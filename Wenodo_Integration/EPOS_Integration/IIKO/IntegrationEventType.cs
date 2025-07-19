namespace EPOS_Integration
{
    public enum IntegrationEventType
    {
        Information = 2210,
        Error = 2211,
        Warning = 2212,
        Unknown = 2219
    }
    public enum IntegrationSource
    {
        RUNTIME = -1, // For all Integration status id 7
        ONCE_A_DAY = -2, // For all Integration status id 0/2/4
        // For a particular epos system with Integration status id 0/2/4
        LightSpeed = 1,
        IIKO = 2,
        Xero = 3,
        SQUIRREL = 5,
        ALOHA = 6,
        COMTREX = 7,
        MARKETMAN = 8,
        VITAMOJO = 9,
        OMEGA = 10,
        LIGHTSPEED_LS = 11,
        TISSL = 12,
        OMNIVORE_MICROS_FA = 13,
        SQUAREUP = 14,
        TISSL_HORIZON = 18,
        ICG = 19,
        APICBASE = 20,
        FARM_GIRL = 21,
        ITB = 22,
        KOBAS = 23,
        KOUNTA_LIGHTSPEED_O_SERIES = 24,
        SIMPHONY = 27,
        FOODICS = 31,
        SYRVE = 32,
        QUADRANET = 33,
        TOAST=34,
        MICROS=15,
        SYMPHONY = 27,
        S4LABOUR=35,
        SHIFT4=36,
    }
}