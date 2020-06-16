import { AzureFunction, Context, HttpRequest } from "@azure/functions"

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest, connectionInfo: string): Promise<void> {
    context.res = { body: connectionInfo };
};

export default httpTrigger;