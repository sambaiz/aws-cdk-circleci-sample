#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/cdk'
import { VPCStack } from '../lib/vpc/vpc-stack';
import { SomeAppStack } from '../lib/some-app/some-app-stack'

const app = new cdk.App();
const deployEnv = app.node.getContext('env').replace(/^[a-z]/g, (v: string) => {
    return v.toUpperCase()
})

if (deployEnv !== 'Stg' && deployEnv !== 'Prd') {
    throw new Error(`unknown env ${deployEnv}`)
}

const vpcStack = new VPCStack(app, `${deployEnv}VPCStack`);
const someAppStack = new SomeAppStack(app, `${deployEnv}SomeAppStack`, {
    dbSubnetIds: [
        vpcStack.exportValue.privateSubnetIds[0].makeImportValue(),
        vpcStack.exportValue.privateSubnetIds[1].makeImportValue(),
    ]
})
someAppStack.addDependency(vpcStack)