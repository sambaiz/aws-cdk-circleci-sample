#!/usr/bin/env node
import 'source-map-support/register';
import cdk = require('@aws-cdk/cdk');
import { SharedIAMCIStack } from '../lib/iam/shared-iam-ci-stack';
import { VPCStack } from '../lib/vpc/vpc-stack';
import { SomeAppStack } from '../lib/some-app/some-app-stack'

const app = new cdk.App();
const deployEnv = app.node.getContext('env').replace(/^[a-z]/g, (v: string) => {
    return v.toUpperCase()
})

new SharedIAMCIStack(app, 'SharedIAMCIStack');
const vpcStack = new VPCStack(app, `${deployEnv}VPCStack`);
vpcStack.exportValue.privateSubnetIds
const someAppStack = new SomeAppStack(app, `${deployEnv}SomeAppStack`, {
    privateSubnetIds: [
        vpcStack.exportValue.privateSubnetIds[0].makeImportValue(),
        vpcStack.exportValue.privateSubnetIds[1].makeImportValue(),
    ]
})
someAppStack.addDependency(vpcStack)