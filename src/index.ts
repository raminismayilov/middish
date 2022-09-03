import {
    APIGatewayProxyEvent,
    APIGatewayProxyResult,
} from 'aws-lambda';
import middy from '@middy/core';
import httpRouterHandler, {Method} from '@middy/http-router';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import httpErrorHandler from "@middy/http-error-handler";
import httpHeaderNormalizer from "@middy/http-header-normalizer"
import createError from "http-errors";

const bscChars = [
    {
        id: 1,
        name: "Gustavo Fring",
    },
    {
        id: 2,
        name: "Mike Ehrmentraut",
    },
    {
        id: 3,
        name: "Saul Goodman",
    },
];

const getBscCharHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    return {
        statusCode: 200,
        body: JSON.stringify(bscChars),
    };
}

const getBscCharByIdHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const charId = Number.parseInt(event.pathParameters?.id ?? "0");
    const existingCharIds = bscChars.map(char => char.id);

    if (!existingCharIds.includes(charId)) {
        throw createError(400, { message: JSON.stringify({ message: "No char with that ID" }) });
    }

    return {
        statusCode: 200,
        body: JSON.stringify(bscChars.find(char => char.id === charId)),
    };
}

const getBscCharLambda = middy()
    .handler(getBscCharHandler);

const getBscCharByIdLambda = middy()
    .handler(getBscCharByIdHandler);

const routes = [
    {
        method: 'GET' as Method,
        path: '/chars',
        handler: getBscCharLambda,
    },
    {
        method: 'GET' as Method,
        path: '/chars/{id}',
        handler: getBscCharByIdLambda
    }
];

export const handler = middy()
    .use(httpHeaderNormalizer())
    .use(httpJsonBodyParser())
    .handler(httpRouterHandler(routes))
    .use(httpErrorHandler());
