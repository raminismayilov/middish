import * as path from "path";
import * as cdk from 'aws-cdk-lib';
import {Construct} from 'constructs';
import {NodejsFunction} from "aws-cdk-lib/aws-lambda-nodejs";
import {LambdaRestApi} from "aws-cdk-lib/aws-apigateway";

export class MiddishStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const simpleLambda = new NodejsFunction(this, "SimpleLambda", {
            entry: path.join(__dirname, "..", "src", "index.ts"),
            handler: "handler"
        });

        const simpleApi = new LambdaRestApi(this, "SimpleApi", {
            restApiName: "BscCharService",
            handler: simpleLambda,
            proxy: false,
        });

        const bscChars = simpleApi.root.addResource("chars");
        bscChars.addMethod("GET");

        const singleBscChar = bscChars.addResource("{id}");
        singleBscChar.addMethod("GET");
    }
}
