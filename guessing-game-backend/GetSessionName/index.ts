import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { generate } from "project-name-generator"

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    // Generate random username
    const responseMessage = generate({ words: 2, number: true }).dashed;
    context.res = {
        body: responseMessage
    };

};

export default httpTrigger;