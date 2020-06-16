import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { dbItems } from "../common/cosmosClient"

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    // Get data from Cosoms DB
    const query = 'SELECT COUNT(1) AS count, r.squaresPerDay, r.isoCode FROM root r GROUP BY r.isoCode, r.squaresPerDay';
    let results = await dbItems.query({ query }).fetchAll(); 
    
    // Transform data
    const distributionData = results.resources
        .filter((value) => value.isoCode && typeof value.isoCode == 'string' && value.squaresPerDay);
    const codes = {};
    distributionData.forEach((value) => {
        codes[value.isoCode] = [];
    });
    
    // Return data
    context.res = {
        body: {
            rawData: distributionData,
            isoCodes: codes
        }
    };
};

export default httpTrigger;