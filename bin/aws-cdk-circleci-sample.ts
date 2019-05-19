#!/usr/bin/env node
import 'source-map-support/register';
import cdk = require('@aws-cdk/cdk');
import { IAMCIStack } from '../lib/iam-ci-stack';

const app = new cdk.App();
new IAMCIStack(app, 'IAMCIStack');
