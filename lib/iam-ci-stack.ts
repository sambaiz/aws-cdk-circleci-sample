import cdk = require('@aws-cdk/cdk');
import iam = require('@aws-cdk/aws-iam')

export class IAMCIStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const ciGroup = new iam.Group(this, 'CIGroup', {
      groupName: 'CI',
    })
    const ciAssumeRole = new iam.Role(this, 'CIAssumeRole', {
      assumedBy: new iam.AccountPrincipal(cdk.Aws.accountId),
      managedPolicyArns: ['arn:aws:iam::aws:policy/AdministratorAccess']
    })
    const ciUserRole = new iam.Role(this, 'CIUserRole', {
      assumedBy: new iam.AccountPrincipal(cdk.Aws.accountId)
    })
    const ciUserPolicy = new iam.Policy(this, 'CIPolicy', {
      groups: [ciGroup],
      policyName: 'CIUserPolicy',
      statements: [
        new iam.PolicyStatement(iam.PolicyStatementEffect.Allow)
          .addAction('sts:AssumeRole').addResource(ciAssumeRole.roleArn)
      ]
    })
    ciUserPolicy.attachToRole(ciUserRole)
    const ciUser = new iam.User(this, 'CircleCIUser', {
      userName: 'CircleCI',
      groups: [ciGroup]
    })
    const ciAccessKey = new iam.CfnAccessKey(this, 'CircleCIUserAccessKey', {
      userName: ciUser.userName
    })
    new cdk.CfnOutput(this, 'CircleCIUserAccessKeyId', { value: ciAccessKey.accessKeyId });
    new cdk.CfnOutput(this, 'CircleCIUserSecretAccessKey', { value: ciAccessKey.accessKeySecretAccessKey });
  }
}
