# Welcome to your CDK TypeScript project

This is a blank project for CDK development with TypeScript.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `npx cdk deploy`  deploy this stack to your default AWS account/region
* `npx cdk diff`    compare deployed stack with current state
* `npx cdk synth`   emits the synthesized CloudFormation template


## My Notes.


First, install aws-cli on your laptop, then cdk-cli with npm. 

Create a new directory and initialize a CDK project:
> cdk init app --language typescript

Bootstrap the project (need to execute only once):
> cdk bootstratp

Then, deploy the project:
> cdk deploy.

For the parameter storage and setting without new deployment,
I have used Parameter Store from AWS System Manager (SSM). 

The value of this parameter can be changed with this command:
> aws ssm put-parameter --name "/myapp/dynamic-string" --value "Hello World\!" --overwrite

The code for Lambda function was written in TypeScript, under the lambda-ts directory.
After editing, it must be transpiled to JavaScript before deployment.
> cd lambda-ts
> npm run build

Then, you can deploy it again with cdk deploy command at project root directory.

This is deployed on AWS. You can find it at the following URL: 
https://epu8pa0gh3.execute-api.us-west-2.amazonaws.com/prod/

# Why SSM ? 
SSM parameter manager seems to me a good solution, considering elapse time to set a
new value - about 3 seconds on my trials - and (almost) inmediate refresh.

With SSM, at zero cost you can store up to 10K parameter per region with a max lenght
of 4K characters. 

## Other options ?
The parameter could be stored in some database like PostgreSQL on RDS or DynamoDB.
The upside of this option is you can build a fully parameter management system,
enable parameter versioning, by storing past values and metadata like date of edit
and by whom. Another advantage of this option comparing to SSM, it is the potential
improvement by decreasing the time involved to set the parameter value from the base
case of about 3 seconds.

The downside of this option would be the developing time, operational and risk cost. 
