#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ProductSpecificationsApiStack042220260842 } from '../lib/cdk-app-stack';

const app = new cdk.App();
new ProductSpecificationsApiStack042220260842(app, 'ProductSpecificationsApiStack042220260842', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});