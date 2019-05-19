#!/usr/bin/env node
import 'source-map-support/register';
import cdk = require('@aws-cdk/cdk');
import { AwsCdkCircleciSampleStack } from '../lib/aws-cdk-circleci-sample-stack';

const app = new cdk.App();
new AwsCdkCircleciSampleStack(app, 'AwsCdkCircleciSampleStack');
