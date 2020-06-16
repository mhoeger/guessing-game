import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { dbItems } from "../common/cosmosClient"
import { fromCountryCode } from 'emoji-country-code'

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    // Get data from Cosoms DB
    const querySpec = {
        query: 'SELECT DISTINCT r.diffToAnswer, r.username, r.isoCode FROM root r ORDER BY r.diffToAnswer ASC OFFSET 0 LIMIT 10'
    };
    let results = await dbItems.query(querySpec).fetchAll();
    
    // Transform data (add flag emoji per country)
    const prettyTop10 = results.resources.map((value, index) => {
        let rankedName = `${index + 1}. ${value.username}`
        let flag = "🏁";
        try {
            if (value.isoCode != "unknown")
                flag = fromCountryCode(value.isoCode)
        } catch (err) { context.log(`Invalid ISO code ${value.isoCode}`) }
        return rankedName += "  " + flag;
    });

    // Return data
    context.res = {
        status: 200,
        body: prettyTop10
    };

};

export default httpTrigger;