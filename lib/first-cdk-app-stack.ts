import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import  { RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as apigateway  from 'aws-cdk-lib/aws-apigateway';


export class FirstCdkAppStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Defind Dunamodb tables
    const dynamodb_table = new dynamodb.Table(this,"Table", {
      partitionKey: { name: "id" , type: dynamodb.AttributeType.STRING},
      removalPolicy: RemovalPolicy.DESTROY
    })
    const lambda_backend = new NodejsFunction (this, "function", {
      tracing: lambda.Tracing.ACTIVE,
      environment: {
      DYNAMODB: dynamodb_table.tableName
      }
    })
    //Grant Lambda function read access to dynamodb table 
    dynamodb_table.grantReadData(lambda_backend.role!)
    
    const api = new apigateway.RestApi(this, "RestAPI", {
     deployOptions: {
       dataTraceEnabled: true,
       tracingEnabled: true
       
     } 
    })
    const endpoint = api.root.addResource("scan")
    const endpointMethod = endpoint.addMethod("GET", new apigateway.LambdaIntegration(lambda_backend))
  }
}
