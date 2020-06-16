import { AzureFunction, Context } from "@azure/functions"

const httpTrigger: AzureFunction = async function (context: Context, updateEstimates: any[]): Promise<void> {
    context.bindings.signalRMessages =
        updateEstimates.map(estimate => ({
            target: 'estimateUpdated',
            arguments: [{ isoCode: estimate.isoCode, squaresPerDay: estimate.squaresPerDay }]
        }));
};

export default httpTrigger;