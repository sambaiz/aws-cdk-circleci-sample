import * as cdk from '@aws-cdk/cdk'
import * as rds from '@aws-cdk/aws-rds'

interface ImportValue {
  dbSubnetIds: string[]
}

export class SomeAppStack extends cdk.Stack {
  protected deployEnv: string
  private importValue: ImportValue
  constructor(
    scope: cdk.Construct,
    id: string,
    importValue: ImportValue,
    props?: cdk.StackProps
  ) {
    super(scope, id, props)
    this.deployEnv = this.node.getContext('env')
    this.importValue = importValue

    this.dbSubnetGroup()
  }

  private dbSubnetGroup() {
    new rds.CfnDBSubnetGroup(this, 'DBSubnetGroup', {
      dbSubnetGroupDescription: `${this.deployEnv}_subnet_group_for_some_app_db`,
      subnetIds: this.importValue.dbSubnetIds,
      dbSubnetGroupName: `${this.deployEnv}-some-app`
    })
  }
}
