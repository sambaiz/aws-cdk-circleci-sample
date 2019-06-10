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

const vpcStackExport = new VPCStack(app, `${deployEnv}VPCStack`).export
new SomeAppStack(app, `${deployEnv}SomeAppStack`, {
    dbSubnetIds: vpcStackExport.vpc.privateSubnets.map(v => v.subnetId)
})