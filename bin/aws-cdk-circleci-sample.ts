#!/usr/bin/env node
import 'source-map-support/register';
import cdk = require('@aws-cdk/cdk');
import { IAMCIStack } from '../lib/iam-ci-stack';
import { VPCStack } from '../lib/vpc-stack';

const app = new cdk.App();
new IAMCIStack(app, 'IAMCIStack');
new VPCStack(app, 'VPCStack');
