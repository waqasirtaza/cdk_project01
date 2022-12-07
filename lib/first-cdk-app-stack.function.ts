import * as AWSXRay from 'aws-xray-sdk';
import * as AWSSDK from 'aws-sdk';
import { APIGatewayProxyEvent } from "aws-lambda";
//Define DocumentClient
const AWS = AWSXRay.captureAWS(AWSSDK)
const docClient = new AWS.DynamoDB.DocumentClient();
//define table by variable passed from stack
const table = process.env.DYNAMOOB || "undefined"

//define tables in params
const params = {
    TableName : table
}
//ScanItems function uses params to scan a dynamodb table
async function scanItems(){
    try {
        const data = await docClient.scan(params).promise()
        return data
    } catch (err) {
        return err
    }
}
//Actual handler logs evens and calls scanItems  and log error on catch
exports.handler = async (event: APIGatewayProxyEvent) =>{
    try{
        console.log(event)
        const data = await scanItems()
        return { body: JSON.stringify(data)}
    } catch (err){
        return {error: err}
    }
}   