using EPOS_Integration.Transformers;
using System;
using System.Collections.Generic;

namespace EPOS_Integration.Common
{
    public class DataTransformerFactory
    {
        private readonly Dictionary<IntegrationSource, IDataTransformer> _transformers;

        public DataTransformerFactory()
        {
            _transformers = new Dictionary<IntegrationSource, IDataTransformer>
            {
                { IntegrationSource.LightSpeed, new LightSpeedTransformer() },
                { IntegrationSource.OMEGA, new OmegaTransformer() },
                { IntegrationSource.SQUIRREL, new SquirrelTransformer() },
                { IntegrationSource.SQUAREUP, new SquareUpTransformer() },
                { IntegrationSource.VITAMOJO, new VitaMojoTransformer() },
                { IntegrationSource.ALOHA, new AlohaTransformer() },
                { IntegrationSource.KOUNTA_LIGHTSPEED_O_SERIES, new KountaLightspeedOTransformer() },
                { IntegrationSource.TISSL_HORIZON, new TisslHorizonTransformer() },
                { IntegrationSource.IIKO, new IikoTransformer() },
                { IntegrationSource.KOBAS, new KobasTransformer() },
                { IntegrationSource.LIGHTSPEED_LS, new LightspeedLSTransformer() },
                { IntegrationSource.FOODICS, new FoodicsTransformer() },
                { IntegrationSource.SYRVE, new SyrveTransformer() },
                { IntegrationSource.QUADRANET, new QuadranetTransformer() },
                { IntegrationSource.TOAST, new ToastTransformer() },
                { IntegrationSource.MICROS, new MicrosTransformer() },
                { IntegrationSource.SYMPHONY, new SymphonyTransformer() }
            };
        }

        public IDataTransformer GetTransformer(IntegrationSource source)
        {
            if (_transformers.TryGetValue(source, out var transformer))
            {
                return transformer;
            }
            throw new NotSupportedException($"Integration source '{source}' is not supported.");
        }
    }
}
