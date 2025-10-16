import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import * as iam from 'aws-cdk-lib/aws-iam';


import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class MeraparStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const path = require('node:path');

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'MeraparQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
    
    const dynamicStringParam = new ssm.StringParameter(this, 'DynamicString', {
      parameterName: '/myapp/dynamic-string',
      stringValue: 'Hello World!', // Initial value
      description: 'Dynamic string displayed in HTML page',
      tier: ssm.ParameterTier.STANDARD,
    });

    const webLambda = new lambda.Function(this, 'WebLambda', {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../lambda-handler')) ,
      environment: {
        PARAMETER_NAME: dynamicStringParam.parameterName,
      },
      timeout: cdk.Duration.seconds(10),
    });

    dynamicStringParam.grantRead(webLambda);

    // Create API Gateway
    const api = new apigateway.RestApi(this, 'HtmlApi', {
      restApiName: 'Dynamic HTML Service',
      description: 'Serves HTML page with dynamic content',
      deployOptions: {
        stageName: 'prod',
      },
    });

    // Add Lambda integration
    const integration = new apigateway.LambdaIntegration(webLambda);
    api.root.addMethod('GET', integration);

    // Output the API URL
    new cdk.CfnOutput(this, 'ApiUrl', {
      value: api.url,
      description: 'URL of the HTML service',
    });

    // Output the parameter name for easy updates
    new cdk.CfnOutput(this, 'ParameterName', {
      value: dynamicStringParam.parameterName,
      description: 'SSM Parameter name to update the dynamic string',
    });
  }
}
