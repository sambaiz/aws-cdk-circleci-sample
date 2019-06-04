import cdk = require('@aws-cdk/cdk');
import iam = require('@aws-cdk/aws-iam')

// Shareng resources for stg and prd envinronment.
export class SharedIAMCIStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const ciUser = this.ciUser()
    const ciAccessKey = this.accessKey(ciUser)
    new cdk.CfnOutput(this, `${this.stackName}-CircleCIUserAccessKeyId`, { value: ciAccessKey.accessKeyId });
    new cdk.CfnOutput(this, `${this.stackName}-CircleCIUserSecretAccessKey`, { value: ciAccessKey.accessKeySecretAccessKey });
  }

  private ciUser() {
    const ciGroup = new iam.Group(this, 'CIGroup', {
      groupName: 'CI',
    })
    const ciAssumeRole = new iam.Role(this, 'CIAssumeRole', {
      roleName: 'CIAssumeRole',
      assumedBy: new iam.AccountPrincipal(cdk.Aws.accountId),
      managedPolicyArns: ['arn:aws:iam::aws:policy/AdministratorAccess']
    })
    const ciUserRole = new iam.Role(this, 'CIUserRole', {
      roleName: 'CIUserRole',
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
    return new iam.User(this, 'CircleCIUser', {
      userName: 'CircleCI',
      groups: [ciGroup]
    })
  }

  private accessKey(user: iam.User) {
    return new iam.CfnAccessKey(this, 'CircleCIUserAccessKey', {
      userName: user.userName
    })
  }
}
