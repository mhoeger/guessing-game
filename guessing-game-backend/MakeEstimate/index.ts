import { AzureFunction, Context, HttpRequest } from "@azure/functions"
const axios = require('axios').default;

const CORRECT_ANSWER = parseInt(process.env["CORRECT_ANSWER"]);

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    // Get data from request
    const squareEstimate = parseInt(context.req.query.squareEstimate);
    const dayEstimate = parseInt(context.req.query.dayEstimate);
    const squaresPerDay = parseInt(context.req.query.squaresPerDay);
    const itemName = context.bindingData.query.itemname || "ToiletPaper";
    const userName = context.bindingData.query.username;
    const userAgent = req.headers["user-agent"];
    const ip = req.headers["x-forwarded-for"]?.split(":")[0];

    // Validate user inputs
    const squareValidation = validationError(squareEstimate, CORRECT_ANSWER * 10);
    const daysValidation = validationError(dayEstimate, CORRECT_ANSWER);
    const perDayValidation = validationError(squaresPerDay, CORRECT_ANSWER / 2);
    const validation = Object.assign({}, squareValidation, daysValidation, perDayValidation);

    // Give user informative error on invalid input
    if (validation.errored) {
        let errorMessage = "";

        if (validation.isTooLow) {
            errorMessage += "Your guess must be a number >= 1. ";
        }

        if (validation.isTooHigh) {
            errorMessage += "Your guess doesn't seem very reasonable. Would you like to guess again? ";
        }

        context.res = {
            status: 400,
            body: errorMessage
        }
    // Put data in database and return 200
    } else {
        const isoCode = await getIsoLocation(ip, context.log);
        // This is using the Cosmos DB binding (see function.json)
        context.bindings.dbEstimate = {
            squareEstimate,
            dayEstimate,
            squaresPerDay: squaresPerDay,
            diffToAnswer: Math.abs(CORRECT_ANSWER - squareEstimate),
            username: userName || "ANONYMOUS",
            userAgent,
            itemName,
            isoCode
        };
        // Return ok status
        context.res = {
            status: 200
        };
    }
};

function validationError(estimate, max_value) {
    if (isNaN(estimate) || estimate < 1) {
        return { 
            errored: true,
            isTooLow: true
        }
    } else if (estimate > max_value) {
        return {
            errored: true,
            isTooHigh: true
        }
    }
    return {};
}

async function getIsoLocation(ip, log) {
    let isoCode = "unknown"
    if (ip) {
        log("ip: " + ip);
        let response = await axios.get(`https://atlas.microsoft.com/geolocation/ip/json?subscription-key=${process.env["AzureMap_Key"]}&api-version=1.0&ip=${ip}`);
        isoCode = response.data?.countryRegion?.isoCode;
        log(isoCode);
    }
    return isoCode;
}

export default httpTrigger;