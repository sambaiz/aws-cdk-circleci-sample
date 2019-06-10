import * as cdk from '@aws-cdk/cdk'
import * as ec2 from '@aws-cdk/aws-ec2'
import { CfnOutput } from '@aws-cdk/cdk'

interface ExportOutput {
  publicSubnetIds: CfnOutput[]
  privateSubnetIds: CfnOutput[]
}

interface ExportValue {
  publicSubnetIds: string[]
  privateSubnetIds: string[]
}

export class VPCStack extends cdk.Stack {
  protected deployEnv: string
  private exportOutput: ExportOutput
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)
    this.deployEnv = this.node.getContext('env')
    const vpc = this.vpc()

    this.exportOutput = {
      publicSubnetIds: vpc.publicSubnets.map((v, i) => {
        return new cdk.CfnOutput(this, `PublicSubnet${i}Id`, {
          value: v.subnetId
        })
      }),
      privateSubnetIds: vpc.privateSubnets.map((v, i) => {
        return new cdk.CfnOutput(this, `PrivateSubnet${i}Id`, {
          value: v.subnetId
        })
      })
    }
  }

  export() {
    return {
      publicSubnetIds: this.exportOutput.publicSubnetIds.map(v =>
        v.makeImportValue()
      ),
      privateSubnetIds: this.exportOutput.privateSubnetIds.map(v =>
        v.makeImportValue()
      )
    }
  }

  private vpc() {
    let cidr: string | null
    if (this.deployEnv === 'stg') {
      cidr = '172.32.1.0/24'
    } else if (this.deployEnv === 'prd') {
      cidr = '172.32.2.0/24'
    } else {
      throw new Error(`unknown env ${this.deployEnv}`)
    }
    return new ec2.Vpc(this, `${this.deployEnv}-vpc`, {
      cidr: cidr,
      maxAZs: 2,
      subnetConfiguration: [
        {
          cidrMask: 26,
          subnetType: ec2.SubnetType.Public,
          name: `${this.deployEnv}-vpc-public`
        },
        {
          cidrMask: 26,
          subnetType: ec2.SubnetType.Private,
          name: `${this.deployEnv}-vpc-private`
        }
      ]
    })
  }
}
